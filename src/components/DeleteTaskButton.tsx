import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { gql } from 'graphql.macro';

import { DeleteTask, DeleteTaskVariables } from './__generated__/DeleteTask';
import { GetTasks } from './__generated__/GetTasks';
import { GET_TASKS } from './TasksView';

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

interface DeleteTaskButtonProps {
  className?: string;
  disabled?: boolean;
  taskId: string;
}

function DeleteTaskButton(props: DeleteTaskButtonProps) {
  const [deleteTask] = useMutation<DeleteTask, DeleteTaskVariables>(DELETE_TASK, {
    optimisticResponse: {
      deleteTask: {
        __typename: 'Task',
        id: props.taskId,
      },
    },
    update(proxy, { data }) {
      if (!data) return;
      const prev = proxy.readQuery<GetTasks>({ query: GET_TASKS });
      if (prev) {
        const tasks = prev.tasks.filter(task => task.id !== data.deleteTask.id);
        proxy.writeQuery({ query: GET_TASKS, data: { ...prev, tasks } });
      }
    },
    variables: { id: props.taskId },
  });

  return (
    <Button
      small
      className={props.className}
      disabled={props.disabled}
      icon={IconNames.TRASH}
      intent={Intent.DANGER}
      onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        deleteTask();
      }}
    />
  );
}

export default DeleteTaskButton;
