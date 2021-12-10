/** values:校验的数组 params:必填的参数名list 返回为空的字段名 */
const getTargetInfoRequiredRule = (values: any = [], params: string[]) => {
  return params.find((field) => {
    return values.find((item: any) => !item[field] && item[field] !== 0);
  });
};
export { getTargetInfoRequiredRule };
