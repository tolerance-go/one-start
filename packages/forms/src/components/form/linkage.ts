import type { OSFormType, RecordType } from '@ty-one-start/typings';

export const execValueSyncLinkage = (
  changedValues: Record<string, any>,
  values: Record<string, any>,
  linkage: Required<Required<OSFormType>['settings']>['valueLinkage'],
  // onChange?: OSFormType['onChange'],
) => {
  if (linkage.length === 0) {
    return {
      changedValues,
      values,
    };
  }

  const linkagedData = linkage.reduce(
    (data, next) => {
      const nextChangedValues = next(data.changedValues, data.values);

      const mergedChangeValues = {
        ...data.changedValues,
        ...nextChangedValues,
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

export const execValueAsyncLinkage = async (
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
        return () => Promise.resolve(changedValues);
      }
      if (serial.length === 1) {
        return (_changedValues: Record<string, any>, _values: Record<string, any>) => {
          return serial[0](_changedValues, _values).then((curChangedValues) => {
            return {
              ..._changedValues,
              ...curChangedValues,
            };
          });
        };
      }
      return serial.reduce((asyncFn, next) => {
        return (_changedValues: Record<string, any>, _values: Record<string, any>) =>
          asyncFn(_changedValues, _values).then((curChangedValues) => {
            const mergedChangeValues = {
              ..._changedValues,
              ...curChangedValues,
            };

            const curValues = {
              ..._values,
              ...mergedChangeValues,
            };

            return next(mergedChangeValues, curValues).then((nextChangedValues) => {
              const nextValues = {
                ...mergedChangeValues,
                ...nextChangedValues,
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
};
