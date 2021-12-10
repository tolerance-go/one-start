import { extend } from 'umi-request';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { notification } from '@ty/antd';

export const BCTServicePrefix = process.env.NODE_ENV === 'development' ? '/bct-service' : '';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export type Result<T> = {
  error: boolean;
  errorMessage: string;
  data?: T;
  response: Response;
};

export type RPCError = {
  error: {
    code: number;
    message: string;
  };
  id: string;
  jsonrpc: string;
};

export type RestfulError = {
  errorMessage: string;
};

export type ResponseErrorType = RestfulError | RPCError | string | unknown;

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError<ResponseErrorType>): Result<ResponseErrorType> => {
  if ((error.data as RPCError).error) {
    const inlineError = error.data as RPCError;
    notification.error({
      message: `请求错误 ${inlineError.error.code}`,
      description: inlineError.error.message,
    });
    return {
      error: true,
      data: undefined,
      response: error.response,
      errorMessage: inlineError.error.message,
    };
  }

  if ((error.data as RestfulError).errorMessage) {
    const inlineError = error.data as RestfulError;
    const { response } = error;
    notification.error({
      message: `请求错误 ${(response && response.status) ?? ''}`,
      description: inlineError.errorMessage,
    });
    return {
      error: true,
      data: undefined,
      response: error.response,
      errorMessage: inlineError.errorMessage,
    };
  }

  const { response } = error;
  if (response && response.status) {
    const ackmsg = response.headers.get('ackmsg');
    const errorText = ackmsg
      ? decodeURIComponent(ackmsg)
      : codeMessage[response.status] || response.statusText;
    const { status } = response;

    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
    return {
      error: true,
      data: undefined,
      response: error.response,
      errorMessage: errorText,
    };
  }

  if (!response) {
    const errorText = '您的网络发生异常，无法连接服务器';
    notification.error({
      description: errorText,
      message: '网络异常',
    });
    return {
      error: true,
      data: undefined,
      response: error.response,
      errorMessage: errorText,
    };
  }

  return {
    error: true,
    data: undefined,
    response: error.response,
    errorMessage: '未知错误',
  };
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  getResponse: true,
});

/**
 * 在请求或响应被 then 或 catch 处理前拦截它们
 */
request.interceptors.request.use(
  (
    url: string,
    options: RequestOptionsInit & {
      /** 忽略验证本地 token 是否存在 */
      ignoreValidateToken?: boolean;
      loginRouteUrl?: string;
      localTokenFieldName?: string;
    },
  ) => {
    const {
      localTokenFieldName = 'tongyu_USER_LOCAL_FIELD',
      ignoreValidateToken = false,
      loginRouteUrl = '/user/login',
    } = options;

    const getToken = () => {
      const user = JSON.parse(localStorage.getItem(localTokenFieldName) || '');
      if (!ignoreValidateToken && !user?.token) {
        window.location.href = loginRouteUrl;
        return { url, options };
      }

      if (user) {
        try {
          const { token } = user;
          return token;
        } catch {
          return '';
        }
      }

      return '';
    };

    return {
      url,
      options: {
        ...options,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    };
  },
  { global: false },
);

request.use(async (ctx, next) => {
  await next();

  const { res, req } = ctx;
  const { data, response } = res;

  // 兼顾老接口，依然通过 error + code 返回错误
  if (typeof res.data === 'object' && res.data.error) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw {
      error: true,
      data,
      response,
      name: '',
      request: req,
      type: '',
      message: '',
    } as ResponseError<RPCError>;
  }

  ctx.res = {
    error: false,
    data,
    response,
    errorMessage: '',
  } as Result<unknown>;
});

const requestPro = <T extends any>(
  url: string,
  options: RequestOptionsInit,
): Promise<Result<T>> => {
  return request(url, options) as Promise<Result<T>>;
};

export default requestPro;
