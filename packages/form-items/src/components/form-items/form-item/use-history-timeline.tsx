import { HistoryOutlined } from '@ant-design/icons';
import { Popover, Timeline } from '@ty/antd';
import React from 'react';
import type { OSFormItemInputHistoryData, RecordType } from '../@ty-one-start/typings';
import { useClsPrefix } from '../../utils/use-cls-prefix';

export const useHistoryTimeline = ({
  title,
  historyData,
  inputEl,
  inputProps,
}: {
  title?: React.ReactNode;
  historyData?: OSFormItemInputHistoryData[];
  inputEl?: React.ReactNode;
  inputProps?: RecordType;
}) => {
  const prefix = useClsPrefix('os-form-item-history');
  if (historyData?.length) {
    if (React.isValidElement(inputEl)) {
      return (
        <Popover
          overlayInnerStyle={{
            maxWidth: 1000,
          }}
          className={`${prefix}-popover`}
          overlayClassName={`${prefix}-popover-overlay`}
          title={`${title ? `${title}的` : ''}历史修改记录`}
          content={
            <Timeline mode="left" className={`${prefix}-timeline`}>
              {historyData?.map((item) => {
                return (
                  <Timeline.Item>
                    <div>
                      {React.cloneElement(inputEl, {
                        ...inputProps,
                        onChange: undefined,
                        mode: 'read',
                        value: item.current,
                      })}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          }
        >
          <HistoryOutlined
            style={{ marginLeft: 4, cursor: 'pointer', color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}
          />
        </Popover>
      );
    }
  }

  return null;
};
