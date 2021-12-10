import BigNumber from 'bignumber.js';
import { SwapFieldNameEnums } from '../constants/fields';
import { EquityDirectionEnums } from '../constants/swap';

/** Σ 标的物信息数据 * 标的方向 */
const dataSummary = (
  data: any,
  name: string,
  isDirection: boolean = true,
  precision: number = 6,
) => {
  const totalData = data?.reduce((total: BigNumber, next: any) => {
    const longShort =
      next[SwapFieldNameEnums.EquityDirection] === EquityDirectionEnums.Long ? 1 : -1;
    return new BigNumber(next[name] ?? 0).multipliedBy(isDirection ? longShort : 1).plus(total);
    // return total + (next[name] ?? 0) * (isDirection ? longShort : 1);
  }, new BigNumber(0));
  return totalData.toFixed(precision);
};

export { dataSummary };
