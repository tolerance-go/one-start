import type { OSDigitFieldValueType } from '../../typings';

export const formatter = (value?: OSDigitFieldValueType) =>
  value == null ? '' : `${value}`.replace(/(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g, ',');

export const parser = (value?: string): OSDigitFieldValueType =>
  value?.toString().replace(/,*/g, '') ?? '';
