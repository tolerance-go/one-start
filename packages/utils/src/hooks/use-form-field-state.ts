import { IOFormField } from '@ty-one-start/io-component';

import useMergedState from 'rc-util/lib/hooks/useMergedState';

const useFormFieldState = (props: IOFormField) => {
  const [value, onChange] = useMergedState(props.initialValue, {
    value: props.value,
    onChange: props.onChange,
  });

  return { value, onChange };
};

export { useFormFieldState };
