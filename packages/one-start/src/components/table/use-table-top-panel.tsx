import { Col, Row, Space } from '@ty/antd';
import React from 'react';
import type { OSFormFieldItem, OSTableAPI, OSTableType } from '../typings';
import type { RequiredRecursion } from '../utils/typings';
import { useMemo } from 'react';
import { DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW } from './constants';

export const useTableTopPanel = ({
  spreadBtnDom,
  selectionDom,
  singleSearchForm,
  searchFormFieldItems,
  searchFormItemChunkSize,
  drawerDom,
  searchFormDom,
  searchSwitchDom,
  expandBtn,
  actions,
  extraActions,
  settingDom,
  tableActionsRef,
  clsPrefix,
  highlightTag,
}: {
  spreadBtnDom?: React.ReactNode;
  selectionDom?: React.ReactNode;
  singleSearchForm?: boolean;
  searchFormFieldItems: OSFormFieldItem[];
  searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
  drawerDom?: React.ReactNode;
  searchFormDom?: React.ReactNode;
  searchSwitchDom?: React.ReactNode;
  expandBtn?: React.ReactNode;
  actions?: RequiredRecursion<OSTableType>['settings']['actions'];
  extraActions?: OSTableType['extraActions'];
  settingDom?: React.ReactNode;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
  clsPrefix?: string;
  highlightTag?: React.ReactNode;
}) => {
  const leftPanelHasDom = spreadBtnDom || selectionDom;

  const isLeftShowSearchForm =
    searchFormDom &&
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
      {drawerDom}
      {isLeftShowSearchForm ? null : searchFormDom}
      {(spreadBtnDom || selectionDom || searchSwitchDom || settingDom || actions || expandBtn) && (
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
                {normalizedActions.left?.map((item, index) =>
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
              {isLeftShowSearchForm && highlightTag && (
                <span style={{ marginRight: 10 }}>{highlightTag}</span>
              )}
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
              {settingDom}
            </Space>
          </Col>
        </Row>
      )}
    </>
  );
};
