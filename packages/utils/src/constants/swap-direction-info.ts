/** 交易方向列表常用属性 */
const counterPartyName = '交易对手方';

const filterMap = (value: string = '', map: { [x: string]: string }) =>
  Object.keys(map).find((key) => key !== value);

export { counterPartyName, filterMap };
