import React, { useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Callout, H1, Intent } from '@blueprintjs/core';
import { gql } from 'graphql.macro';

import { GetTasks } from './__generated__/GetTasks';
import { TaskCreated } from './__generated__/TaskCreated';
import { TaskDeleted } from './__generated__/TaskDeleted';
import { TaskUpdated } from './__generated__/TaskUpdated';
import AddTask from './AddTask';
import TaskList from './TaskList';

const TASK_CREATED = gql`
  subscription TaskCreated {
    taskCreated {
      id
      message
      done
    }
  }
`;

const TASK_DELETED = gql`
  subscription TaskDeleted {
    taskDeleted {
      id
    }
  }
`;

const TASK_UPDATED = gql`
  subscription TaskUpdated {
    taskUpdated {
      id
      done
    }
  }
`;

interface TasksViewProps {
  className?: string;
}

export const GET_TASKS = gql`
  query GetTasks {
    ...TaskListFragment
  }
  ${TaskList.fragment}
`;

function TasksView(props: TasksViewProps) {
  const { data, error, loading, subscribeToMore } = useQuery<GetTasks>(GET_TASKS);

  useEffect(() => {
    const unsubscribe = subscribeToMore<TaskCreated>({
      document: TASK_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newTask = subscriptionData.data.taskCreated;

        const alreadyExist = prev.tasks.some(task => task.id === newTask.id);
        if (alreadyExist) return prev;

        return {
          ...prev,
          tasks: [...prev.tasks, newTask],
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  useEffect(() => {
    const unsubscribe = subscribeToMore<TaskDeleted>({
      document: TASK_DELETED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== subscriptionData.data.taskDeleted.id),
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  useEffect(() => {
    const unsubscribe = subscribeToMore<TaskUpdated>({ document: TASK_UPDATED });
    return () => unsubscribe();
  }, [subscribeToMore]);

  const tasks = data ? data.tasks : [];

  return (
    <div className={props.className}>
      <H1>
        <span aria-label="alarm" role="img">
          ⏰
        </span>{' '}
        MY TASKS
      </H1>

      {error && (
        <Callout intent={Intent.DANGER}>
          <p>{error.message}</p>
        </Callout>
      )}

      <TaskList loading={loading} tasks={tasks} />

      {!loading && <AddTask />}
    </div>
  );
}

export default TasksView;
