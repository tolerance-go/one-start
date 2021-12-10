import { OSFormType, OSTableType, RequiredRecursion } from '@ty-one-start/one-start';
import { fieldTypeValueEnums } from './field-items';
import { osSubTypeFieldItemsSettingsMap } from './os-sub-type-field-items-settings-map';

export const osTriggerTypeFieldItems: RequiredRecursion<OSFormType>['settings']['fieldItems'] = [
  {
    type: 'select',
    settings: {
      title: 'type',
      dataIndex: 'type',
      valueEnums: {
        button: 'button',
        dropdown: 'dropdown',
      },
    },
  },
  ...Object.keys(osSubTypeFieldItemsSettingsMap['button-trigger']).map((fieldKey) => {
    const configs = osSubTypeFieldItemsSettingsMap['button-trigger'][fieldKey];
    return {
      ...configs,
      dependencies: ['type'],
      settings: ({ form }) => {
        return {
          ...configs?.settings,
          dataIndex: ['settings', configs?.settings.dataIndex],
          hide: form.getFieldValue('type') !== 'button',
        };
      },
    } as RequiredRecursion<OSFormType>['settings']['fieldItems'][number];
  }),
];

export const osLayoutTypeFieldItems: RequiredRecursion<OSFormType>['settings']['fieldItems'] = [
  {
    type: 'editable-table',
    settings: {
      title: 'navData',
      dataIndex: ['settings', 'navData'],
      fieldItems: [
        {
          type: 'text',
          settings: { editable: true, autoFocus: true, title: 'title', dataIndex: 'title' },
        },
        { type: 'text', settings: { editable: true, title: 'key', dataIndex: 'key' } },
      ],
      addable: {},
    },
  },
];

export const osTableTypeFieldItems: RequiredRecursion<OSTableType>['settings']['fieldItems'] = [
  {
    type: 'editable-table',
    settings: {
      title: 'fieldItems',
      dataIndex: ['settings', 'fieldItems'],
      fieldItems: [
        {
          type: 'select',
          settings: {
            editable: true,
            title: 'type',
            dataIndex: 'type',
            valueEnums: fieldTypeValueEnums,
          },
        },
        {
          type: 'layout-modal-form',
          settings: {
            editable: true,
            title: '配置',
            dataIndex: 'settings',
            buttonTriggerText: '配置',
            modalDialogSettings: {
              title: '标题',
            },
            formFieldItems: [
              {
                type: 'text',
                settings: {
                  title: 'title',
                  dataIndex: 'title',
                },
              },
              {
                type: 'text',
                settings: {
                  title: 'dataIndex',
                  dataIndex: 'dataIndex',
                },
              },
            ],
          },
        },
      ],
      addable: {},
    },
  },
];

export const osElementTypeFieldItemsMap = {
  trigger: osTriggerTypeFieldItems,
  layout: osLayoutTypeFieldItems,
  table: osTableTypeFieldItems,
};
