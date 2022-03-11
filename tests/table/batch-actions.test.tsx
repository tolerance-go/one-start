import Demo from '../../packages/one-start/src/demos/table/batch-actions';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../utils';

describe('batch-actions', () => {
  it('默认搜索后选中全部', async () => {
    const html = mount(<Demo />);
    await waitForComponentToPaint(html, 1200);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 100 项');

    // 取消当前页选中
    act(() => {
      html.find('.ty-ant-table-thead input.ty-ant-checkbox-input').simulate('change', {
        target: { checked: false },
      });
    });
    await waitForComponentToPaint(html, 100);

    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 80 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(false));

    // 点击搜索
    act(() => {
      html.find('button.search-button').simulate('click');
    });
    await waitForComponentToPaint(html, 1200);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 100 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(true));

    // 取消当前页选中
    act(() => {
      html.find('.ty-ant-table-thead input.ty-ant-checkbox-input').simulate('change', {
        target: { checked: false },
      });
    });
    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 80 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(false));

    // 重置搜索
    act(() => {
      html.find('button.reset-button').simulate('click');
    });
    await waitForComponentToPaint(html, 1200);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 100 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(true));

    // 取消当前页选中
    act(() => {
      html.find('.ty-ant-table-thead input.ty-ant-checkbox-input').simulate('change', {
        target: { checked: false },
      });
    });
    await waitForComponentToPaint(html, 100);

    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 80 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(false));

    // 进入第二页
    act(() => {
      html.find('li.ty-ant-pagination-item-2').simulate('click');
    });
    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 80 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(true));

    // 进入第一页
    act(() => {
      html.find('li.ty-ant-pagination-item-1').simulate('click');
    });

    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 80 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(false));

    // 清空所有
    act(() => {
      html.find('div.ty-ant-table-selection-extra .ty-ant-dropdown-trigger').simulate('mouseenter');
    });
    await waitForComponentToPaint(html, 250);
    act(() => {
      html.find('span.ty-ant-dropdown-menu-title-content').at(1).simulate('click');
    });
    await waitForComponentToPaint(html, 100);

    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 0 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(false));

    // 选中当前页
    act(() => {
      html.find('.ty-ant-table-thead input.ty-ant-checkbox-input').simulate('change', {
        target: { checked: true },
      });
    });

    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 20 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(true));

    // 选中全部
    act(() => {
      html.find('div.ty-ant-table-selection-extra .ty-ant-dropdown-trigger').simulate('mouseenter');
    });
    await waitForComponentToPaint(html, 250);
    act(() => {
      html.find('span.ty-ant-dropdown-menu-title-content').at(0).simulate('click');
    });

    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 100 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(true));

    // 反选当前页
    act(() => {
      html.find('div.ty-ant-table-selection-extra .ty-ant-dropdown-trigger').simulate('mouseenter');
    });
    await waitForComponentToPaint(html, 250);
    act(() => {
      html.find('span.ty-ant-dropdown-menu-title-content').at(2).simulate('click');
    });
    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 80 项');
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(Array(21).fill(false));

    // 选中第一行
    act(() => {
      html
        .find('.ty-ant-table-tbody input.ty-ant-checkbox-input')
        .at(0)
        .simulate('change', {
          target: { checked: true },
        });
    });
    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 81 项');
    let fls = Array(21).fill(false);
    fls[1] = true;
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(fls);

    // 继续反选当前页
    act(() => {
      html.find('div.ty-ant-table-selection-extra .ty-ant-dropdown-trigger').simulate('mouseenter');
    });
    await waitForComponentToPaint(html, 250);
    act(() => {
      html.find('span.ty-ant-dropdown-menu-title-content').at(2).simulate('click');
    });
    await waitForComponentToPaint(html, 100);
    expect(html.find('span.bulk-operation-counter').text()).toBe('已选择 99 项');
    fls = Array(21).fill(true);
    fls[0] = false;
    fls[1] = false;
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual(fls);
  });

  it('批量操作启动和关闭', async () => {
    const html = mount(<Demo />);
    await waitForComponentToPaint(html, 1200);

    // 关闭批量操作
    act(() => {
      html.find('button.t_enableRowBulk').simulate('click');
    });

    await waitForComponentToPaint(html, 1200);

    expect(html.find('span.bulk-operation-counter').exists()).toBe(false);
    expect(
      html.find('input.ty-ant-checkbox-input').map((item) => item.props().checked),
    ).toStrictEqual([]);
  });
});
