/* eslint-disable no-return-assign */
import Demo from '../../packages/one-start/src/demos/search-table/visual-manage';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../utils';
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSTableRequestDataSourceParams,
} from '@ty-one-start/one-start';

describe('search-table', () => {
  it('应用视图后从第一页开始搜索', async () => {
    let options:
      | undefined
      | OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

    const html = mount(<Demo onRequestDataSource={(opt) => (options = opt)} />);
    await waitForComponentToPaint(html, 1200);

    act(() => {
      html.find('li.ty-ant-pagination-next > button').simulate('click');
    });

    await waitForComponentToPaint(html, 1200);

    act(() => {
      html.find('button.visual-manager-button').simulate('click');
    });

    await waitForComponentToPaint(html, 1200);

    act(() => {
      html.find('button.visual-manager-apply-button').at(0).simulate('click');
    });

    await waitForComponentToPaint(html, 1200);

    expect(options?.search).toStrictEqual({
      money: -279017462758012,
      percent: -5717274175563392,
      text: 'nhlhym',
    });
    expect(options?.current).toBe(1);
    expect(options?.pageSize).toBe(20);
  });
});
