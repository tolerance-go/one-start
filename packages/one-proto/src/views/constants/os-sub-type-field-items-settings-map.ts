import { OSFormType, OSTriggerButtonType, RequiredRecursion } from '@ty-one-start/one-start';

export const osSubTypeFieldItemsSettingsMap: {
  'button-trigger': {
    [key in keyof Omit<
      OSTriggerButtonType['settings'],
      'icon'
    >]: RequiredRecursion<OSFormType>['settings']['fieldItems'][number];
  };
} = {
  'button-trigger': {
    danger: {
      type: 'switch',
      settings: {
        title: 'danger',
        dataIndex: 'danger',
      },
    },
    disabled: {
      type: 'switch',
      settings: {
        title: 'disabled',
        dataIndex: 'disabled',
      },
    },
    text: {
      type: 'text',
      settings: {
        title: 'text',
        dataIndex: 'text',
      },
    },
    tooltip: {
      type: 'text',
      settings: {
        title: 'tooltip',
        dataIndex: 'tooltip',
      },
    },
    type: {
      type: 'select',
      settings: {
        title: 'type',
        dataIndex: 'type',
        valueEnums: {
          default: 'default',
          primary: 'primary',
          ghost: 'ghost',
          dashed: 'dashed',
          link: 'link',
          text: 'text',
        },
      },
    },
  },
};
