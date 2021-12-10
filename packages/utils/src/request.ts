/* eslint-disable @typescript-eslint/no-throw-literal, no-throw-literal */
import { notification } from '@ty/antd';
import type { JSONSchema4 } from 'json-schema';
import _ from 'lodash';
import { extend, RequestOptionsInit, RequestResponse, ResponseError } from 'umi-request';

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

const bctCodeMessage = {};

export interface BCTAPIReqData {
  method: string;
  params?: any;
}
export type ParamsData<T> = T extends { method: string; params?: infer P } ? P : T;

export interface BCTAPIData {
  id?: string;
  /** 没有此字段表示 restful 风格，body 为 data */
  jsonrpc?: string;
  result?: any;
  error?: {
    code?: number;
    message?: string;
  };
  [key: string]: any;
}

export interface ResultData<
  R extends BCTAPIData = BCTAPIData,
  K extends keyof R = 'result',
  D extends R[K] = R[K],
> {
  error: boolean;
  success: boolean;
  data: R;
  result: D;
}

export type ResponseBCTData = RequestResponse<BCTAPIData>;

export type ResponseData<D = ResultData<BCTAPIData>> = RequestResponse<D>;

export interface IODataSchemas {
  request: JSONSchema4;
  response: JSONSchema4;
}

export type RequestOptionsInitWithSchemas = RequestOptionsInit & {
  schemas?: IODataSchemas;
  onCancelInterceptorsRequest?: Function;
};

export type ResponseErrorPartialResponse = Omit<ResponseError, 'response'> & {
  response?: Response;
};

const hanldeDeleteNull = (data: any): any => {
  if (_.isArray(data)) {
    return data.map((value) => {
      return hanldeDeleteNull(value);
    });
  }

  if (_.isObject(data)) {
    const newData = _.omitBy(data, _.isNull);
    return _.mapValues(newData, (value) => {
      return hanldeDeleteNull(value);
    });
  }
  return data;
};

const handleData = (data: BCTAPIData) => {
  const noNullData = hanldeDeleteNull(data);
  return noNullData;
};

const errorHandler = (error: ResponseErrorPartialResponse & { code?: number }): ResponseData => {
  const { response = {} as Response, code, data, type, message } = error;
  const getErrorText = () => {
    if (message) {
      return message;
    }

    if (code != null && (bctCodeMessage as { [key: number]: string })[code]) {
      return (bctCodeMessage as { [key: number]: string })[code];
    }

    if ((codeMessage as { [key: number]: string })[response.status]) {
      return (codeMessage as { [key: number]: string })[response.status];
    }

    return response.statusText;
  };

  const getErrorCode = () => {
    if (code != null) {
      return code;
    }
    return response.status;
  };

  const getErrorType = () => {
    if (type) {
      return type;
    }
    return '请求错误';
  };

  const errortext = getErrorText();
  const { url } = response;

  console.error(`${getErrorType()} url: ${url} code: ${code}`);
  notification.error({
    message: `${getErrorType()} - ${getErrorCode()}`,
    description: errortext,
  });

  return {
    response,
    data: {
      error: true,
      success: false,
      data,
      result: data,
    },
  };
};

const request = extend({
  errorHandler,
  getResponse: true,
});

request.use(async (ctx, next) => {
  await next();

  const { res, req } = ctx;

  const { response, data } = res as ResponseBCTData;
  const { options } = req as {
    options: RequestOptionsInitWithSchemas;
  };
  let newData = data;
  if (response.status === 200 && options.schemas) {
    newData = handleData(data);
  }

  // 业务错误处理
  if (data.error) {
    const { code, message } = data.error;
    throw {
      name: '',
      type: '',
      data: undefined,
      request: req,
      response,
      message,
      code,
    } as ResponseError;
  }

  // restful api style
  if (!data.hasOwnProperty('jsonrpc')) {
    ctx.res = {
      response,
      data: {
        error: false,
        success: true,
        data,
        result: newData,
      } as ResultData,
    } as ResponseData;
  } else {
    // 业务包装
    ctx.res = {
      response,
      data: {
        error: false,
        success: true,
        result: newData.result,
        data,
      } as ResultData,
    } as ResponseData;
  }
});

/**
 * 在请求或响应被 then 或 catch 处理前拦截它们
 */
request.interceptors.request.use((url: string, options: RequestOptionsInitWithSchemas) => {
  if (options.onCancelInterceptorsRequest) {
    const res = options.onCancelInterceptorsRequest(url, options);
    return res;
  }

  const json = localStorage.getItem('tongyu_USER_LOCAL_FIELD');
  if (!json) {
    window.location.href = '/user/login';
    return { url, options };
  }

  const user = JSON.parse(json);
  const { token } = user;

  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
});

/**
 * 请求返回拦截器
 * - 判断状态码
 */
request.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    // @todo 常量应该由 login page 模块提供
    window.location.href = '/user/login';
  }

  return response;
});

const requestPro = async <RD extends ResultData<BCTAPIData> = ResultData<BCTAPIData>>(
  url: string,
  options: RequestOptionsInitWithSchemas,
): Promise<ResponseData> => {
  return request<RD>(url, options);
};

export default requestPro;
