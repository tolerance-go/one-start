import type { RecordType } from '../../typings';

export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? PartialRecursive<U>[]
    : T[P] extends RecordType
    ? PartialRecursive<T[P]>
    : T[P];
};
