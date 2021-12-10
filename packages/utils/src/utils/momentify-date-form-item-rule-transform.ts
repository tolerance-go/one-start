import moment, { Moment } from 'moment';

const momentifyDateFormItemRuleTransform = (val: string | Moment | undefined) => {
  if (val == null) {
    return val;
  }
  if (typeof val === 'string') {
    return moment(val);
  }
  return val;
};

export { momentifyDateFormItemRuleTransform };
