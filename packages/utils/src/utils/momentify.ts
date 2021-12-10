import type { Moment } from 'moment';
import moment from 'moment';

export const momentify = (val: Moment | string | undefined | null, clone: boolean = true) => {
  if (val == null) return undefined;
  // eslint-disable-next-line no-nested-ternary
  return moment.isMoment(val) ? (clone ? val.clone() : val) : moment(val);
};
