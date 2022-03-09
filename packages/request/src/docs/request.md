---
sidemenu: false
nav:
  order: 3
  title: request
---

# request

网络请求库，基于 umi-request 封装, 旨在为开发者提供一个内部统一的 api 调用方式, 简化使用

[测试用例](http://10.1.2.7/Visual-FE/one-start/blob/master/tests/request/index.test.ts#L1)

## 设计行为

当接口返回异常时候，自动打印状态码及消息，以 notifaction 组件作为载体

除了状态码异常外，对以下两种后端约定返回格式也进行异常抛出

```ts | pure
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
```

错误状态码消息映射

```ts | pure
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
```

当接口返回 401 状态码或者请求前发现 token 失效的时候，自动跳转到登录页并刷新页面，可以通过参数修改内部默认行为

## 使用方式

os-request 使用方式和 umi-request 大体一致

请求方式没有变化，请求参数基于 umi-request 进行了扩展

```tsx | pure
import type { RequestOptionsInit } from 'umi-request';

export type RequestOptions = RequestOptionsInit & {
  /**
   * 登录页面 URL 地址
   * @default /user/login
   */
  loginRouteUrl?: string;
  /**
   * 本地用户信息存储的 key 值
   * @default 'tongyu_USER_LOCAL_FIELD'
   */
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
};
```

os-request 对返回值内容进行了统一序列化，格式如下

```ts | pure
export type Result<T> = {
  error: boolean;
  errorMessage: string;
  data?: T;
  response: Response;
};
```
