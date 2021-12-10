import type { FormInstance } from '@ty/antd';
import { useRef } from 'react';

export const useFormLinkage = (form: FormInstance) => {
  type DependType = Record<
    string,
    {
      depends: (string | number)[];
      callBackFn: (...arg: any) => any;
      dependsVal: any[];
    }
  >;
  const depend = useRef<DependType>({});
  const allDependFields = useRef(new Set<string | number>([]));
  const linkageField = useRef(new Set<string | number>([]));

  const resetDepends = () => {
    depend.current = {};
  };

  const registrationLinkage = (
    field: string,
    depends: (string | number)[],
    callBack: (...arg: any) => any,
  ) => {
    depend.current[field] = {
      depends,
      callBackFn: callBack,
      dependsVal: [],
    };
    depends.forEach((d) => allDependFields.current.add(d));
    linkageField.current.add(field);
  };

  const unRegistrationLinkage = (field: string) => {
    depend.current[field]?.depends.forEach((d) => {
      allDependFields.current.delete(d);
    });
    linkageField.current.delete(field);
    delete depend.current[field];
  };

  const onValuesChange = (changeVal: Record<string, any>) => {
    if (!allDependFields.current.size) return;
    const changeName = Object.keys(changeVal)[0];
    const val = changeVal[changeName];
    linkageField.current.forEach((field) => {
      const key = depend.current[field];
      const dependIndex = key.depends.findIndex((d) => d === changeName);
      if (dependIndex >= 0) {
        key.dependsVal = [...key.depends.map((d) => form.getFieldValue(d))];
        (key.dependsVal ?? [])[dependIndex] = val;
        form.setFieldsValue({
          [field]: key.callBackFn?.(...key.dependsVal),
        });
      }
    });
  };

  return {
    registrationLinkage,
    unRegistrationLinkage,
    resetDepends,
    onValuesChange,
  };
};
