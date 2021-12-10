import { Col, Row, Space } from '@ty/antd';
import React from 'react';
import type { OSFormFieldItem, OSGridAPI, OSGridType } from '../typings';
import type { RequiredRecursion } from '../utils/typings';
import { useMemo } from 'react';
import { DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW } from './constants';

export const useTableTopPanel = ({
  spreadBtnDom,
  selectionDom,
  singleSearchForm,
  searchFormFieldItems,
  searchFormItemChunkSize,
  searchFormDom,
  searchSwitchDom,
  expandBtn,
  actions,
  extraActions,
  tableActionsRef,
  clsPrefix,
  highlightTag,
}: {
  spreadBtnDom?: React.ReactNode;
  selectionDom?: React.ReactNode;
  singleSearchForm?: boolean;
  searchFormFieldItems: OSFormFieldItem[];
  searchFormItemChunkSize?: RequiredRecursion<OSGridType>['settings']['searchFormItemChunkSize'];
  searchFormDom?: React.ReactNode;
  searchSwitchDom?: React.ReactNode;
  expandBtn?: React.ReactNode;
  actions?: RequiredRecursion<OSGridType>['settings']['actions'];
  extraActions?: OSGridType['extraActions'];
  tableActionsRef: React.MutableRefObject<OSGridAPI>;
  clsPrefix?: string;
  highlightTag?: React.ReactNode;
}) => {
  const leftPanelHasDom = spreadBtnDom || selectionDom;

  const isLeftShowSearchForm =
    singleSearchForm &&
    !leftPanelHasDom &&
    searchFormFieldItems.length <=
      (searchFormItemChunkSize ?? DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW);

  const normalizedActions = useMemo(() => {
    if (actions == null) {
      return {};
    }
    if (typeof actions === 'function') {
      const back = actions({ actions: tableActionsRef.current });
      if (Array.isArray(back)) {
        return { right: back };
      }
      return back;
    }
    if (Array.isArray(actions)) {
      return { right: actions };
    }
    return actions;
  }, [actions, tableActionsRef]);

  return (
    <>
      {isLeftShowSearchForm ? null : searchFormDom}
      {(spreadBtnDom || selectionDom || searchSwitchDom || actions || expandBtn) && (
        /** 设置 gutter 会引起 margin-left/right 负数的情况，引起页面滚动 */
        <Row style={{ marginBottom: 8 }} justify="space-between">
          {isLeftShowSearchForm ? (
            <Col flex="auto" className={`${clsPrefix}-inline-search-form-wrapper`}>
              {searchFormDom}
            </Col>
          ) : (
            <Col>
              <Space size={5}>
                {expandBtn}
                {spreadBtnDom}
                {selectionDom}
                {highlightTag}
                {normalizedActions.left?.map((item: React.ReactElement, index: number) =>
                  React.cloneElement(item, {
                    ...item.props,
                    key: item.key ?? index,
                  }),
                )}
              </Space>
            </Col>
          )}
          <Col>
            <Space size={5}>
              {[
                ...(isLeftShowSearchForm ? normalizedActions.left ?? [] : []),
                ...(normalizedActions.right ?? []),
                ...(extraActions?.({
                  actions: tableActionsRef.current,
                }) ?? []),
              ]
                .filter((item): item is React.ReactElement => !!item)
                .map((item, index) =>
                  React.cloneElement(item, {
                    ...item.props,
                    key: item.key ?? index,
                  }),
                )}
              {isLeftShowSearchForm && expandBtn}
              {isLeftShowSearchForm && spreadBtnDom}
              {isLeftShowSearchForm && selectionDom}

              {searchSwitchDom}
            </Space>
          </Col>
        </Row>
      )}
    </>
  );
};
