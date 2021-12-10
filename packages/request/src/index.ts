import type { ResponseErrorType, RestfulError, Result, RPCError } from './request';
import request, { BCTServicePrefix } from './request';

export default request;
export { BCTServicePrefix };
export type { Result, RPCError, RestfulError, ResponseErrorType };
export * from './utils';
