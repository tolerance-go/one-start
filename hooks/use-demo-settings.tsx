import type { OSFormFieldItems, RecordType } from '@ty-one-start/one-start';
import { OSForm } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export const useDemoSettings = ({
  fieldItems,
  initialSettings,
}: {
  fieldItems: OSFormFieldItems;
  initialSettings?: RecordType;
}) => {
  const [settings, setSettings] = useState(initialSettings ?? {});

  const settingForm = (
    <div
      style={{
        background: '#eee',
        padding: '0 10px',
        marginBottom: 20,
      }}
    >
      <OSForm
        onValuesChange={(_, values_) => {
          setSettings(values_);
        }}
        settings={{
          layout: 'inline',
          initialValues: settings,
          fieldItems,
        }}
      />
    </div>
  );

  return {
    settingForm,
    settings,
  };
};
