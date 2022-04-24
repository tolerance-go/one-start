import type { Moment } from 'moment';
import moment from 'moment';

/** TODO: 支持和参数取差集 val 的类型 */
export const momentify = (val: Moment | string | undefined | null, clone: boolean = true) => {
  if (val == null) return val;
  // eslint-disable-next-line no-nested-ternary
  return moment.isMoment(val) ? (clone ? val.clone() : val) : moment(val);
};
