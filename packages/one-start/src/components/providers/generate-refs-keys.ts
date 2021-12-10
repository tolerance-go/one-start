export type GenerateRefsKeys<
  T extends Record<string, string | Record<string, string | Record<string, string>>>,
> = {
  [K in keyof T]: T[K] extends Record<string, string | Record<string, string>>
    ? T[K] extends Record<string, string>
      ? keyof GenerateRefsKeys<T[K]>
      : GenerateRefsKeys<T[K]>
    : T[K];
};
