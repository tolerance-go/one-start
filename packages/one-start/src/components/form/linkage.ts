import utl from 'lodash';
import type { OSFormType, RecordType } from '../typings';

export const getTruthChangedValues = (
  changedValues_: Record<string, any>,
  originValues: Record<string, any>,
) => {
  /** 过滤没有发生变化的 field */
  const nextTruthChangedValues = Object.keys(changedValues_)
    .filter((key) => {
      return changedValues_[key] !== originValues[key];
    })
    .reduce((merged, nextKey) => {
      return {
        ...merged,
        [nextKey]: changedValues_[nextKey],
      };
    }, {});

  return nextTruthChangedValues;
};

export const valueLinkageHandler = (
  changedValues: Record<string, any>,
  values: Record<string, any>,
  linkage: Required<Required<OSFormType>['settings']>['valueLinkage'],
  // onChange?: OSFormType['onChange'],
) => {
  const linkagedData = linkage.reduce(
    (data, next) => {
      const nextChangedValues = next(data.changedValues, data.values);
      /** 过滤没有发生变化的 field */
      const nextTruthChangedValues = getTruthChangedValues(nextChangedValues, data.values);

      const mergedChangeValues = {
        ...data.changedValues,
        ...nextTruthChangedValues,
      };

      return {
        changedValues: mergedChangeValues,
        values: {
          ...values,
          ...mergedChangeValues,
        },
      };
    },
    {
      changedValues,
      values,
    },
  );

  // onChange?.(nextValues);

  return {
    changedValues: linkagedData.changedValues,
    values: linkagedData.values,
  };
};

export const handleAsyncLinkage = utl.debounce(
  async (
    changedValues: Record<string, any>,
    values: Record<string, any>,
    valueAsyncLinkage: Required<Required<OSFormType>['settings']>['valueAsyncLinkage'],
    // onChange?: OSFormType['onChange'],
    callback: (data: { changedValues: RecordType; values: RecordType }) => void,
  ) => {
    const formAsyncLinkageItem = valueAsyncLinkage;

    const { parallel, serial } = formAsyncLinkageItem;

    const getSerial = () => {
      if (serial) {
        if (serial.length === 0) {
          /** 过滤掉真正发生的变化的值的简写 */
          return () => Promise.resolve({});
        }
        if (serial.length === 1) {
          return (_changedValues: Record<string, any>, _values: Record<string, any>) =>
            serial[0](_changedValues, _values).then((curChangedValues) =>
              getTruthChangedValues(curChangedValues, _values),
            );
        }
        return serial.reduce((asyncFn, next) => {
          return (_changedValues: Record<string, any>, _values: Record<string, any>) =>
            asyncFn(_changedValues, _values).then((curChangedValues) => {
              const curTruthChangedValues = getTruthChangedValues(curChangedValues, _values);

              const mergedChangeValues = {
                ..._changedValues,
                ...curTruthChangedValues,
              };

              const curValues = {
                ..._values,
                ...mergedChangeValues,
              };

              return next(mergedChangeValues, curValues).then((nextChangedValues) => {
                const nextTruthChangedValues = getTruthChangedValues(nextChangedValues, curValues);

                const nextValues = {
                  ...curValues,
                  ...nextTruthChangedValues,
                };
                return nextValues;
              });
            });
        });
      }
      return null;
    };

    const getParallel = () => {
      const getParas = () => {
        if (parallel) {
          return Object.keys(parallel).map((key) => {
            const fn = parallel[key];
            return fn;
          });
        }
        return [];
      };

      const ps = getParas().concat(getSerial() ?? []);
      return ps.map((fn) =>
        // 按照 promise 执行时间早晚排序
        fn(changedValues, values).then((changedValues_) => {
          return {
            timestamp: new Date().getTime(),
            changedValues: changedValues_,
          };
        }),
      );
    };

    const paras = getParallel();
    if (paras.length) {
      const allChangedValues = await Promise.all(paras);
      const mergedChangedValues = allChangedValues
        .sort((a, b) => a.timestamp - b.timestamp)
        .reduce((dist, next) => {
          return {
            ...dist,
            ...next.changedValues,
          };
        }, {});

      callback({
        changedValues: mergedChangedValues,
        values: {
          ...values,
          ...mergedChangedValues,
        },
      });
      return;

      // onChange?.({ ...normalizedValues, ...mergedChangedValues });
    }

    callback({
      changedValues,
      values,
    });
  },
  500,
);
