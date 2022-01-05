import type { RecordType } from '../typings/core';

export type RequiredRecursion<T> = {
  [P in keyof T]-?: T[P] extends RecordType ? RequiredRecursion<T[P]> : Required<T[P]>;
};

/**
 * https://stackoverflow.com/a/59187769 Extract the type of an element of an array/tuple without
 * performing indexing
 */
export declare type ElementOf<T> = T extends (infer E)[]
  ? E
  : T extends readonly (infer F)[]
  ? F
  : never;
/** https://github.com/Microsoft/TypeScript/issues/29729 */
export declare type LiteralUnion<T extends U, U> = T | (U & {});
