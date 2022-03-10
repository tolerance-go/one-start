import SearchFormDemo from '../../packages/one-start/src/demos/table/search-form';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../utils';

describe('table search form', () => {
  it('搜索表单联动', async () => {
    const html = mount(<SearchFormDemo />);
    await waitForComponentToPaint(html, 1200);

    // 展开更多
    act(() => {
      html.find('a.collapse-link').simulate('click');
    });
    await waitForComponentToPaint(html);
    expect(html.find('#t_select_search label').exists()).toBe(false);

    // 展开 select
    act(() => {
      html.find('div.t_select .ty-ant-select-selector').simulate('mousedown');
    });
    await waitForComponentToPaint(html);

    // 选择 A
    act(() => {
      html.find('.ty-ant-select-item-option').at(0).simulate('click');
    });
    await waitForComponentToPaint(html);
    expect(html.find('#t_select_search label').exists()).toBe(true);
  });

  it('URL params sync', async () => {
    const html = mount(<SearchFormDemo />);
    await waitForComponentToPaint(html, 1200);

    act(() => {
      html.find('button#setURLParamsBtn').simulate('click');
      // html.find('input#money').simulate('change', {
      //   target: { value: 200 },
      // });
    });

    await waitForComponentToPaint(html, 100);

    expect(html.find('input#t_money').props().value).toBe('200');
    expect(html.find('div#t_formItem_date').props().style?.display).toBe('none');
    expect(html.find('input#t_date').exists()).toBe(true);

    act(() => {
      html.find('a.collapse-link').simulate('click');
    });

    await waitForComponentToPaint(html, 100);

    expect(html.find('div#t_formItem_date').props().style?.display).toBe('block');
    expect(html.find('input#t_date').props().value).toBe('2022-02-02');

    act(() => {
      html.find('button.reset-button').simulate('click');
    });

    await waitForComponentToPaint(html, 100);

    expect(html.find('input#t_money').props().value).toBe('');
    expect(html.find('input#t_date').props().value).toBe('');
    expect(html.find('div#t_formItem_date').props().style?.display).toBe('none');
    expect(html.find('input#t_date').exists()).toBe(true);
  });
});
