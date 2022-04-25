import { Col, Row } from 'antd';
import React from 'react';
import type { OSSourceTableType } from '@ty-one-start/typings';
import OSEmpty from '../../table/components/empty';
import { renderEditForm } from '../render-edit-form';
import { renderViewForm } from '../render-view-form';
import type { RowMeta } from '../typings';

export const PanelView = ({
  activeMeta,
  rowViewable,
  panelable,
  clsPrefix,
  baseTableDom,
  rowEditable,
  requestViewRowData,
  requestRowEditData,
  requestSaveRowData,
}: {
  clsPrefix: string;
  activeMeta?: RowMeta;
  rowViewable?: Required<OSSourceTableType>['settings']['rowViewable'];
  rowEditable?: Required<OSSourceTableType>['settings']['rowEditable'];
  panelable?: Required<OSSourceTableType>['settings']['panelable'];
  baseTableDom: React.ReactNode;
  requestViewRowData?: Required<OSSourceTableType>['requests']['requestViewRowData'];
  requestRowEditData?: Required<OSSourceTableType>['requests']['requestRowEditData'];
  requestSaveRowData?: Required<OSSourceTableType>['requests']['requestSaveRowData'];
}) => {
  const renderPanelView = () => {
    if (!activeMeta) return null;

    const { type: metaType, ...params } = activeMeta;

    if (metaType === 'view') {
      if (typeof rowViewable === 'function') {
        return renderViewForm({
          ...params,
          formSettings: rowViewable(params).formSettings,
          requestViewRowData,
          rowViewable,
        });
      }

      return renderViewForm({
        ...params,
        formSettings: rowViewable?.formSettings,
        requestViewRowData,
        rowViewable,
      });
    }

    if (metaType === 'edit') {
      const renderDoms = () => {
        if (typeof rowEditable === 'function') {
          return renderEditForm({
            ...params,
            ...rowEditable?.(params),
            rowEditable,
            requestRowEditData,
            requestSaveRowData,
          });
        }

        return renderEditForm({
          ...params,
          ...rowEditable,
          rowEditable,
          requestRowEditData,
          requestSaveRowData,
        });
      };

      const { editFormDom, saveButtonDom, resetButtonDom } = renderDoms();

      return (
        <Row
          style={{
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Col flex="auto">{editFormDom}</Col>
          <Col flex={'none'}>
            <Row justify="end" gutter={5}>
              <Col>{resetButtonDom}</Col>
              <Col>{saveButtonDom}</Col>
            </Row>
          </Col>
        </Row>
      );
    }

    return null;
  };

  const tableSpan = panelable?.tableSpan ?? 10;

  return (
    <Row gutter={15}>
      <Col span={tableSpan}>{baseTableDom}</Col>
      <Col
        style={{
          borderRadius: '2px',
          padding: '10px 15px',
          border: '1px solid #babfc7',
        }}
        className={`${clsPrefix}-panel`}
        span={24 - tableSpan}
      >
        {activeMeta ? (
          <div style={{ height: '100%' }} key={`${activeMeta.rowId}_${activeMeta.type}`}>
            {renderPanelView()}
          </div>
        ) : (
          <OSEmpty style={{ margin: 0 }} />
        )}
      </Col>
    </Row>
  );
};
