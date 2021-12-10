import React from 'react';

export interface IInputBaseProps {
  autoSelect?: boolean;
  value?: any;
  onChange?: (...args: any[]) => any;
  onValueChange?: (...args: any[]) => any;
  editing?: boolean;
}

export abstract class InputBase<P = any, S = any> extends React.PureComponent<
  P & IInputBaseProps,
  S
> {
  public abstract renderEditing(): any;

  public abstract renderRendering(): any;

  public render() {
    if (this.props.editing === undefined ? true : this.props.editing) {
      return this.renderEditing();
    }
    return this.renderRendering();
  }
}
