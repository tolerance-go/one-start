export type OSResMessage =
  | string
  | {
      text?: string;
      type: 'info' | 'success' | 'error' | 'warning';
    };
