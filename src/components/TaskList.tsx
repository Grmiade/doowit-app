import React, { useEffect } from 'react'

import { Intent, ProgressBar } from '@blueprintjs/core'

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
  const { loading, subscribeToNewTask, subscribeToTaskDeleted, subscribeToTaskDone, tasks } = props

  useEffect(() => {
    const unsubscribeToNewTask = subscribeToNewTask()
    const unsubscribeToTaskDeleted = subscribeToTaskDeleted()
    const unsubscribeToTaskDone = subscribeToTaskDone()
    return () => {
      unsubscribeToNewTask()
      unsubscribeToTaskDeleted()
      unsubscribeToTaskDone()
    }
  }, [subscribeToNewTask, subscribeToTaskDeleted, subscribeToTaskDone])

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

export default TaskList
