import type { ResponseErrorType, RestfulError, Result, RPCError } from './request';
import request, { BCTServicePrefix, extendOptions } from './request';

export default request;
export { BCTServicePrefix, extendOptions };
export type { Result, RPCError, RestfulError, ResponseErrorType };
export * from './utils';
