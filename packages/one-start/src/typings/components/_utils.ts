import type { OSField } from './field';

export type CreateStaticPureFieldItemConfigs<FieldType extends OSField> = {
  type?: FieldType['type'];
  settings?: FieldType['settings'];
  requests?: FieldType['requests'];
  slots?: FieldType['slots'];
  hooks?: FieldType['hooks'];
};
