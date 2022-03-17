import { extend } from 'umi-request';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { notification } from '@ty/antd';
import type { ArgsProps } from '@ty/antd/lib/notification';

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

export type ResponseErrorType = RestfulError | RPCError | string | unknown | undefined;

export type RequestOptions = RequestOptionsInit & {
  /** 登录页面 URL 地址 */
  loginRouteUrl?: string;
  /** 本地用户信息存储的 key 值 */
  localTokenFieldName?: string;
  /**
   * 忽略接口发送前验证本地 token 不存在自动跳转登录页
   * @default false
   */
  ignoreValidateToken?: boolean;
  /**
   * 忽略接口返回无权限状态码时，自动转登录页面
   * @default false
   */
  ignoreNoAccess?: boolean;
  /**
   * 忽略通知信息打印
   * @default false
   */
  ignoreErrorTips?: boolean;
  /** 忽略通知信息打印的回调 */
  errorTipsCustomHandler?: (args: ArgsProps) => void;
};

/**
 * 错误信息提示
 * @param args
 */
const defaultErrorTipsCustomHandler = (args: ArgsProps) => {
  notification.error(args);
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError<ResponseErrorType>): Result<ResponseErrorType> => {
  if ((error.data as RPCError | undefined)?.error) {
    const inlineError = error.data as RPCError;
    const { ignoreErrorTips, errorTipsCustomHandler } = error.request.options;

    if (!ignoreErrorTips) {
      const errorTipsCustomHandlerFun = errorTipsCustomHandler ?? defaultErrorTipsCustomHandler;
      errorTipsCustomHandlerFun({
        message: `请求错误 ${inlineError.error.code}`,
        description: inlineError.error.message,
      });
    }
    return {
      error: true,
      data: undefined,
      response: error.response,
      errorMessage: inlineError.error.message,
    };
  }

  if ((error.data as RestfulError | undefined)?.errorMessage) {
    const inlineError = error.data as RestfulError;
    const { response, request } = error;
    const { ignoreErrorTips, errorTipsCustomHandler } = request.options;

    if (!ignoreErrorTips) {
      const errorTipsCustomHandlerFun = errorTipsCustomHandler ?? defaultErrorTipsCustomHandler;
      errorTipsCustomHandlerFun({
        message: `请求错误 ${(response && response.status) ?? ''}`,
        description: inlineError.errorMessage,
      });
    }
    return {
      error: true,
      data: undefined,
      response: error.response,
      errorMessage: inlineError.errorMessage,
    };
  }

  const { response, request } = error;
  const { ignoreErrorTips, errorTipsCustomHandler } = request.options;

  if (response && response.status) {
    const ackmsg = response.headers.get('ackmsg');
    const errorText = ackmsg
      ? decodeURIComponent(ackmsg)
      : codeMessage[response.status] || response.statusText;
    const { status } = response;

    if (!ignoreErrorTips) {
      const errorTipsCustomHandlerFun = errorTipsCustomHandler ?? defaultErrorTipsCustomHandler;
      errorTipsCustomHandlerFun({
        message: `请求错误 ${status}`,
        description: errorText,
      });
    }
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
  (url: string, options: RequestOptions) => {
    const {
      localTokenFieldName = 'tongyu_USER_LOCAL_FIELD',
      ignoreValidateToken = false,
      loginRouteUrl = '/user/login',
    } = options;

    const getToken = () => {
      let user;
      try {
        user = JSON.parse(window.localStorage.getItem(localTokenFieldName) ?? 'null');
      } catch {
        user = null;
      }

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

request.interceptors.response.use(
  (res, options: RequestOptions) => {
    const { loginRouteUrl = '/user/login', ignoreNoAccess = false } = options;

    if (res.status === 401 && !ignoreNoAccess) {
      window.location.href = loginRouteUrl;
    }
    return res;
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

const requestPro = <T extends any>(url: string, options?: RequestOptions): Promise<Result<T>> => {
  return request(url, options) as Promise<Result<T>>;
};

export default requestPro;
