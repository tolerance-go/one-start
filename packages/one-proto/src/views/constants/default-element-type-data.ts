import { OSTableType, OSTextFieldType, OSTriggerType } from '@ty-one-start/one-start';

export const defaultElementTypeData: {
  trigger: OSTriggerType;
  'text-field': OSTextFieldType;
  table: OSTableType;
} = {
  trigger: {
    type: 'button',
    settings: {
      text: 'text',
    },
  },
  'text-field': {
    mode: 'edit',
    settings: {},
  },
  table: {
    settings: {
      fieldItems: [
        {
          type: 'text',
          settings: {
            title: 'text',
            dataIndex: 'text',
          },
        },
      ],
    },
  },
};
