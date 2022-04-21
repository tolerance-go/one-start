import { Col, Row, Space } from '@ty/antd';
import React, { useMemo } from 'react';
import type {
  OSFormFieldItem,
  OSTableAPI,
  OSTableType,
  RequiredRecursion,
} from '../../@ty-one-start/typings';
import { DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW } from '../../constants';

const CoreActionsPanel: React.ForwardRefRenderFunction<
  {},
  React.PropsWithChildren<{
    selectionDom?: React.ReactNode;
    searchFormFieldItems: OSFormFieldItem[];
    searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
    searchFormDom?: React.ReactNode;
    searchSwitchDom?: React.ReactNode;
    expandBtn?: React.ReactNode;
    actions?: RequiredRecursion<OSTableType>['settings']['actions'];
    extraActions?: OSTableType['extraActions'];
    settingDom?: React.ReactNode;
    tableActionsRef: React.MutableRefObject<OSTableAPI>;
    clsPrefix?: string;
    highlightTag?: React.ReactNode;
    renderActions?: Required<OSTableType>['slots']['renderActions'];
    renderConsumers?: OSTableType['renderConsumers'];
  }>
> = ({
  selectionDom,
  searchFormFieldItems,
  searchFormItemChunkSize,
  searchFormDom,
  searchSwitchDom,
  expandBtn,
  actions,
  extraActions,
  settingDom,
  tableActionsRef,
  clsPrefix,
  highlightTag,
  renderActions,
  renderConsumers = {},
}) => {
  const searchFormIsInline =
    searchFormDom &&
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
      {(selectionDom || searchSwitchDom || settingDom || actions || expandBtn) && (
        /** 设置 gutter 会引起 margin-left/right 负数的情况，引起页面滚动 */
        <Row style={{ marginBottom: 8 }} justify="space-between">
          <Col>
            <Space size={5} style={{ height: '100%' }}>
              {selectionDom}
              {expandBtn}
              {highlightTag}
              {renderActions?.({
                apisRef: tableActionsRef,
                renderConsumers,
              })}
              {normalizedActions.left?.map((item, index) =>
                React.cloneElement(item, {
                  ...item.props,
                  key: item.key ?? index,
                }),
              )}
            </Space>
          </Col>
          <Col className={`${clsPrefix}-inline-search-form-wrapper`}>
            <Row>
              {searchFormIsInline ? (
                <Col
                  style={{
                    marginRight: -10,
                  }}
                >
                  {searchFormDom}
                </Col>
              ) : null}
              <Col>
                <Space size={5}>
                  {[
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
                  {searchSwitchDom}
                  {settingDom}
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default React.forwardRef(CoreActionsPanel);
