import type { RecordType } from '../core';

export type RequestOutputs<Outputs = any> = {
  error: boolean;
  data?: Outputs;
};

export type RequestIO<Inputs = any, Outputs = any, Extra extends RecordType = RecordType> = (
  options: Inputs,
) => Promise<(RequestOutputs<Outputs> & Extra) | boolean | void>;

/** 完全结构化返回值 */
export type RequestInputsAndStructuredOutputs<
  Inputs = any,
  Outputs = any,
  Extra extends RecordType = RecordType,
> = (options: Inputs) => Promise<RequestOutputs<Outputs> & Extra>;

type _SettingsValue = boolean | string | number | React.ReactNode | null | undefined;

// container runtime value
export type SettingsValue =
  | _SettingsValue
  | _SettingsValue[]
  | Record<string, _SettingsValue>
  | ((...args: any[]) => _SettingsValue);

export type OSCore = {
  type?: string;
  settings?: Record<string, SettingsValue | OSCore>;
  requests?: Record<string, RequestIO | Record<string, RequestIO>>;
  hooks?: Record<string, Function>;
  slots?: Record<string, React.ReactNode>;
  actionsRef?: React.MutableRefObject<Record<string, Function> | null>;
  refKey?: string;
};

export type SettingsDataNode = {
  checkable?: boolean;
  children?: SettingsDataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  isLeaf?: boolean;
  key: string | number;
  title?: string;
  selectable?: boolean;
};

export type AbstractItem = {
  title?: string;
  key?: string;
};
