import type {
  InputProps,
  SelectProps,
  TreeSelectProps,
  PopoverProps,
  DatePickerProps,
  TimeRangePickerProps,
  CheckboxProps,
  RateProps,
  RadioProps,
  ProgressProps,
  AvatarProps,
  InputNumberProps,
  SwitchProps,
  CascaderProps,
  FormInstance,
  ImageProps,
} from 'antd';
import type { RangePickerProps } from 'antd/lib/date-picker';
import type { PasswordProps, TextAreaProps } from 'antd/lib/input';
import type { SketchPickerProps } from 'react-color';
import type { ProFieldValueObjectType, ProSchema } from '../typing';

type FieldPropsCommonType = Record<string, any>;

export type ProFieldValueTypeWithFieldProps =
  | {
      valueType: 'text';
      fieldProps: InputProps;
    }
  | {
      valueType: 'password';
      fieldProps: PasswordProps;
    }
  | {
      valueType: 'money';
      fieldProps: FieldPropsCommonType;
    }
  | {
      valueType: 'textarea';
      fieldProps: TextAreaProps;
    }
  | {
      valueType: 'option';
      fieldProps: FieldPropsCommonType;
    }
  | {
      valueType: 'date';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'dateWeek';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'dateMonth';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'dateQuarter';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'dateYear';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'dateRange';
      fieldProps: RangePickerProps;
    }
  | {
      valueType: 'dateTimeRange';
      fieldProps: RangePickerProps;
    }
  | {
      valueType: 'dateTime';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'time';
      fieldProps: TimeRangePickerProps;
    }
  | {
      valueType: 'timeRange';
      fieldProps: TimeRangePickerProps;
    }
  | {
      valueType: 'select';
      fieldProps: SelectProps<any>;
    }
  | {
      valueType: 'checkbox';
      fieldProps: CheckboxProps;
    }
  | {
      valueType: 'rate';
      fieldProps: RateProps;
    }
  | {
      valueType: 'radio';
      fieldProps: RadioProps;
    }
  | {
      valueType: 'radioButton';
      fieldProps: RadioProps;
    }
  | {
      valueType: 'index';
      fieldProps: FieldPropsCommonType;
    }
  | {
      valueType: 'indexBorder';
      fieldProps: FieldPropsCommonType;
    }
  | {
      valueType: 'progress';
      fieldProps: ProgressProps;
    }
  | {
      valueType: 'percent';
      fieldProps: InputNumberProps;
    }
  | {
      valueType: 'digit';
      fieldProps: InputNumberProps;
    }
  | {
      valueType: 'digitRange';
      fieldProps: InputNumberProps;
    }
  | {
      valueType: 'second';
      fieldProps: InputNumberProps;
    }
  | {
      valueType: 'code';
      fieldProps: InputProps | TextAreaProps;
    }
  | {
      valueType: 'jsonCode';
      fieldProps: InputProps | TextAreaProps;
    }
  | {
      valueType: 'avatar';
      fieldProps: AvatarProps;
    }
  | {
      valueType: 'switch';
      fieldProps: SwitchProps;
    }
  | {
      valueType: 'fromNow';
      fieldProps: DatePickerProps;
    }
  | {
      valueType: 'image';
      fieldProps: ImageProps | InputProps;
    }
  | {
      valueType: 'cascader';
      fieldProps: CascaderProps;
    }
  | {
      valueType: 'treeSelect';
      fieldProps: TreeSelectProps<any>;
    }
  | {
      valueType: 'color';
      fieldProps: SketchPickerProps & {
        value?: string;
        popoverProps?: PopoverProps;
        mode?: 'read' | 'edit';
        onChange?: (color: string) => void;
        colors?: string[];
      };
    };

/**
 * @param textarea ?????????
 * @param password ?????????
 * @param money ?????? option ?????? ????????????????????????
 * @param date ?????? YYYY-MM-DD
 * @param dateWeek ????????????
 * @param dateMonth ????????????
 * @param dateQuarter ???????????????
 * @param dateYear ????????????
 * @param dateRange ???????????? YYYY-MM-DD[]
 * @param dateTime ??????????????? YYYY-MM-DD HH:mm:ss
 * @param dateTimeRange ????????????????????? YYYY-MM-DD HH:mm:ss[]
 * @param time: ?????? HH:mm:ss
 * @param timeRange: ???????????? HH:mm:ss[]
 * @param index?????????
 * @param indexBorder?????????
 * @param progress: ?????????
 * @param percent: ?????????
 * @param digit ??????
 * @param second ??????
 * @param fromNow ?????????????????????
 * @param avatar ??????
 * @param code ?????????
 * @param image ????????????
 * @param jsonCode Json ?????????????????????????????????
 * @param color ???????????????
 * @param color ???????????????
 */
export type ProFieldValueType = ProFieldValueTypeWithFieldProps['valueType'];

type FieldPropsTypeBase<Entity, ComponentsType, ExtraProps, FieldPropsType> =
  | ((
      form: FormInstance<any>,
      config: ProSchema<Entity, ExtraProps> & {
        type: ComponentsType;
        isEditable?: boolean;
        rowKey?: string;
        rowIndex: number;
        entity: Entity;
      },
    ) => FieldPropsType | Record<string, any>)
  | FieldPropsType
  | Record<string, any>;

type PickFieldPropsByValueType<Type> = [ProFieldValueTypeWithFieldProps] extends [infer Item]
  ? Item extends { valueType: any; fieldProps: any }
    ? Type extends Item['valueType']
      ? Item['fieldProps']
      : never
    : never
  : never;

type GetValueType<T> = T extends { type: infer Type } ? Type : T;

type ValueTypeWithFieldPropsBase<Entity, ComponentsType, ExtraProps, ValueType> = {
  valueType?: ValueType extends (...args: any) => any ? never : ValueType;
  fieldProps?: FieldPropsTypeBase<
    Entity,
    ComponentsType,
    ExtraProps,
    PickFieldPropsByValueType<GetValueType<ValueType>>
  >;
};

type ValueTypeWithFieldPropsBaseFunction<Entity, ComponentsType, ExtraProps, ValueType> = {
  valueType?: (entity: Entity, type: ComponentsType) => ValueType;
  fieldProps?: FieldPropsTypeBase<
    Entity,
    ComponentsType,
    ExtraProps,
    PickFieldPropsByValueType<GetValueType<ValueType>>
  >;
};

type UnionSameValueType<ValueType> = [ValueType] extends [infer Type]
  ? Type extends ProFieldValueType
    ? never
    : Type
  : ValueType;

export type ValueTypeWithFieldProps<Entity, ComponentsType, ExtraProps, ValueType> =
  | ValueTypeWithFieldPropsBase<Entity, ComponentsType, ExtraProps, ProFieldValueObjectType>
  | ValueTypeWithFieldPropsBase<Entity, ComponentsType, ExtraProps, ProFieldValueType | undefined>
  | ValueTypeWithFieldPropsBase<Entity, ComponentsType, ExtraProps, UnionSameValueType<ValueType>>
  | ValueTypeWithFieldPropsBaseFunction<Entity, ComponentsType, ExtraProps, ProFieldValueType>
  | ValueTypeWithFieldPropsBaseFunction<
      Entity,
      ComponentsType,
      ExtraProps,
      ProFieldValueObjectType
    >;
