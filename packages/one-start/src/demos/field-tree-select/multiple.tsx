import type { OSTreeSelectFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSTreeSelectField } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSTreeSelectFieldValueType>();

  return (
    <OSProviderWrapper>
      <OSTreeSelectField
        mode="edit"
        value={value}
        onChange={setValue}
        settings={{
          multiple: true,
          treeOptions: [
            {
              value: 'p',
              label: 'P',
              children: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
                { value: 'c', label: 'C' },
              ],
            },
          ],
        }}
      ></OSTreeSelectField>
    </OSProviderWrapper>
  );
};
