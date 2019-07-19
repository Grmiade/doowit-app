import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import faker from 'faker';

import Task from './Task';

describe('Task component', () => {
  it('should trigger onCheck when the user clicks on the checkbox label', () => {
    const handleCheck = jest.fn();
    const text = faker.lorem.sentence();
    const { getByText } = render(<Task onCheck={handleCheck}>{text}</Task>);

    const label = getByText(text).getElementsByTagName('label')[0];
    fireEvent.click(label);

    expect(handleCheck).toBeCalledTimes(1);
  });

  it('should trigger onCheck when the user clicks on the card', () => {
    const handleCheck = jest.fn();
    const text = faker.lorem.sentence();
    const { getByText } = render(<Task onCheck={handleCheck}>{text}</Task>);

    const card = getByText(text);
    fireEvent.click(card);

    expect(handleCheck).toBeCalledTimes(1);
  });
});
