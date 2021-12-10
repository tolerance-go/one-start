import type { Rule } from '@ty/antd/lib/form';
import type { Moment } from 'moment';
import type { FormInstance } from 'rc-field-form/lib/interface';
import type { RequestIO } from '../../typings';
import { momentify } from '../../utils/momentify';
import { normalizeRequestOutputs } from '../../utils/normalize-request-outputs';

const getTradingDaysRule = (options: {
  request?: RequestIO<
    {
      date: Moment;
      form: FormInstance;
    },
    {
      /** 返回 error 时，将用于提示信息 */
      message?: string;
    }
  >;
}): Rule => {
  return (form) => ({
    validator: async (_, value: Moment | string | undefined) => {
      if (value == null || options.request == null) {
        return Promise.resolve();
      }

      const { error, data } = await options
        .request({
          date: momentify(value) as Moment,
          form,
        })
        .then(normalizeRequestOutputs);
      if (error) {
        return Promise.reject(new Error(data?.message ?? '验证失败'));
      }
      return Promise.resolve();
    },
  });
};

export { getTradingDaysRule };
