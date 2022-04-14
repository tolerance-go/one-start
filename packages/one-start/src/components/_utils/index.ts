import React from 'react';

export type Ref<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;

export function forwardRef<T, P = {}>(
  render: (props: P, ref: Ref<T>) => React.ReactElement | null,
): (props: P & React.RefAttributes<T>) => React.ReactElement | null {
  return React.forwardRef(render);
}

// demo
// const Root = <T extends {}>(props: T, ref: Ref<T>) => <div ref={ref} {...props} />;
// export default forwardRef(Root)
