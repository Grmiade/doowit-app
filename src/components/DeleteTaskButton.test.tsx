import React from 'react';

import { MockedProvider } from '@apollo/react-testing';
import { Classes } from '@blueprintjs/core';
import { fireEvent, render, wait } from '@testing-library/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import faker from 'faker';

import { GetTasks } from './__generated__/GetTasks';
import DeleteTaskButton, { DELETE_TASK } from './DeleteTaskButton';
import { GET_TASKS } from './TasksView';

describe('DeleteTaskButton component', () => {
  it('should delete the related task from the cache and give visual feedback', async () => {
    const taskId = faker.random.uuid();

    const cache = new InMemoryCache();
    cache.writeQuery<GetTasks>({
      query: GET_TASKS,
      data: {
        __typename: 'Query',
        tasks: [{ id: taskId, __typename: 'Task', message: faker.lorem.words(), done: true }],
      },
    });

    const mocks = [
      {
        request: {
          query: DELETE_TASK,
          variables: { id: taskId },
        },
        result: {
          data: {
            deleteTask: {
              __typename: 'Task',
              id: taskId,
            },
          },
        },
      },
    ];

    const { getByRole } = render(
      <MockedProvider cache={cache} mocks={mocks}>
        <DeleteTaskButton taskId={taskId} />
      </MockedProvider>,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveClass(Classes.LOADING);

    await wait(() => {
      expect(button).not.toHaveClass(Classes.LOADING);
      const data = cache.readQuery<GetTasks>({ query: GET_TASKS });
      expect(data).toBeDefined();
      expect(data!.tasks).toHaveLength(0);
    });
  });
});
