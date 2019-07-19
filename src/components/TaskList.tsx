import React from 'react';

import { Intent, ProgressBar } from '@blueprintjs/core';
import { gql } from 'graphql.macro';

import { TaskListFragment_tasks } from './__generated__/TaskListFragment';
import TaskListItem from './TaskListItem';

interface TaskListProps {
  loading: boolean;
  tasks: TaskListFragment_tasks[];
}

function determineRatioIntent(ratio: number) {
  if (ratio >= 0.75) return Intent.SUCCESS;
  if (ratio >= 0.5) return Intent.WARNING;
  return Intent.DANGER;
}

function TaskList(props: TaskListProps) {
  const { loading, tasks } = props;

  if (loading) return <ProgressBar animate stripes intent={Intent.NONE} value={1} />;
  const ratio = tasks.length !== 0 ? tasks.filter(task => task.done).length / tasks.length : 1;

  return (
    <>
      <ProgressBar
        animate={false}
        intent={determineRatioIntent(ratio)}
        stripes={false}
        value={ratio}
      />
      <br />
      {tasks.map(task => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </>
  );
}

TaskList.defaultProps = {
  loading: false,
};

TaskList.fragment = gql`
  fragment TaskListFragment on Query {
    tasks {
      id
      ...TaskFragment
    }
  }
  ${TaskListItem.fragments.task}
`;

export default TaskList;
