import type { OSFormFieldItemWithStaticPureConfigs } from '../../../typings';
import utl from 'lodash';
import { normalizeArray } from '../../utils/normalize-array';

export const countLinkageLevel = (
  keyIdToFieldSettings: Record<string, OSFormFieldItemWithStaticPureConfigs['settings']>,
  afterIndexIdRegistedPath: string[],
  /** 权重计数器 */
  counts: Record<string, number> = {},
) => {
  Object.keys(keyIdToFieldSettings).forEach((keyId) => {
    if (counts[keyId] == null) {
      // eslint-disable-next-line no-param-reassign
      counts[keyId] = 0;
    }

    const settings = keyIdToFieldSettings[keyId];
    const afterIndexIds = normalizeArray<string>(utl.get(settings, afterIndexIdRegistedPath));

    afterIndexIds.forEach((id) => {
      /** 找到 afterKey 注入的 afterIndexIds 然后同样进行权重增加 */
      if (counts[id] == null) {
        // eslint-disable-next-line no-param-reassign
        counts[id] = 1;
      } else {
        // eslint-disable-next-line no-param-reassign
        counts[id] += 1;
      }

      /** 被依赖的所依赖的项同样要增加权重，避免排序失败 */
      countLinkageLevel(utl.pick(keyIdToFieldSettings, [id]), afterIndexIdRegistedPath, counts);
    });
  });

  return counts;
};
