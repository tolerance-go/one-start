import type React from 'react';
import { useEffect } from 'react';
import type {
  OSLayoutStepsFormAPI,
  OSLayoutStepsFormType,
  RecordType,
  RequiredRecursion,
} from '@ty-one-start/typings';
import { logRequestMessage } from '@ty-one-start/utils';
import { normalizeRequestOutputs } from '@ty-one-start/utils';
import { useLoading } from '@ty-one-start/utils';

export const useRequestInitialValues = ({
  apis,
  requestInitialValues: _requestInitialValues,
  asyncInitialValuesRef,
}: {
  apis: OSLayoutStepsFormAPI;
  requestInitialValues?: RequiredRecursion<OSLayoutStepsFormType>['requests']['requestInitialValues'];
  asyncInitialValuesRef: React.MutableRefObject<RecordType | undefined>;
}) => {
  const requestInitialValuesLoading = useLoading();

  const requestInitialValues = async () => {
    if (!_requestInitialValues) return;

    requestInitialValuesLoading.switch();
    const { error, data } = await _requestInitialValues()
      .then(normalizeRequestOutputs)
      .then(logRequestMessage());

    if (!error) {
      // eslint-disable-next-line no-param-reassign
      asyncInitialValuesRef.current = data;
      apis.setFieldsValue(data);
    }
    requestInitialValuesLoading.switch();
  };

  useEffect(() => {
    requestInitialValues();
  }, []);

  return {
    requestInitialValuesLoading: requestInitialValuesLoading.loading,
  };
};
