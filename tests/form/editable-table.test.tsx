import Demo from '../../packages/one-start/src/demos/form/rich-form-in-form';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../utils';

describe('editable table', () => {
  const html = mount(<Demo />);

  it('单元格输入内部错误', async () => {
    await waitForComponentToPaint(html, 1200);

    act(() => {
      html.find('button#t_add_row').simulate('click');
    });

    await waitForComponentToPaint(html, 100);

    act(() => {
      html.find('input#t_cell_money-edit-0').simulate('change', {
        target: { value: 200 },
      });
    });

    await waitForComponentToPaint(html, 1500);

    expect(
      html.find('div#t_form_item_money-edit-0').find('div.ty-ant-form-item-has-error').exists(),
    ).toBe(true);
    // expect(html.find('div#t_form_item_money-edit-0').find('div.ty-ant-popover-open').exists()).toBe(
    //   true,
    // );
    expect(html.find('input#t_cell_digit-edit-0').props().value).toBe('2000');
  });
});
