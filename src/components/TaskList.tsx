import React, { useEffect } from 'react'

import { ProgressBar, Intent } from '@blueprintjs/core'
import gql from 'graphql-tag'

import { TaskListFragment_tasks } from './__generated__/TaskListFragment'
import TaskListItem from './TaskListItem'

interface TaskListProps {
  loading: boolean
  subscribeToNewTask: () => () => void
  subscribeToTaskDeleted: () => () => void
  subscribeToTaskDone: () => () => void
  tasks: TaskListFragment_tasks[]
}

function determineRatioIntent(ratio: number) {
  if (ratio >= 0.75) return Intent.SUCCESS
  if (ratio >= 0.5) return Intent.WARNING
  return Intent.DANGER
}

function TaskList(props: TaskListProps) {
  useEffect(() => {
    const unsubscribeToNewTask = props.subscribeToNewTask()
    const unsubscribeToTaskDeleted = props.subscribeToTaskDeleted()
    const unsubscribeToTaskDone = props.subscribeToTaskDone()
    return () => {
      unsubscribeToNewTask()
      unsubscribeToTaskDeleted()
      unsubscribeToTaskDone()
    }
  }, [])

  const { loading, tasks } = props
  if (loading) return <ProgressBar animate stripes intent={Intent.NONE} value={1} />
  const ratio = tasks.length !== 0 ? tasks.filter(task => task.done).length / tasks.length : 1

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
  )
}

TaskList.defaultProps = {
  loading: false,
}

TaskList.fragment = gql`
  fragment TaskListFragment on Query {
    tasks {
      ...TaskItemFragment
    }
  }
  ${TaskListItem.fragment}
`

export default TaskList
