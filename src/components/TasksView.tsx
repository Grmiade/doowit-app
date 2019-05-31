import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Callout, H1, Intent } from '@blueprintjs/core'
import { loader } from 'graphql.macro'

import { GetTasks } from './__generated__/GetTasks'
import { TaskCreated } from './__generated__/TaskCreated'
import { TaskDeleted } from './__generated__/TaskDeleted'
import { TaskUpdated } from './__generated__/TaskUpdated'
import AddTask from './AddTask'
import TaskList from './TaskList'

const GET_TASKS = loader('./GetTasks.graphql')
const TASK_CREATED = loader('./TaskCreated.graphql')
const TASK_DELETED = loader('./TaskDeleted.graphql')
const TASK_UPDATED = loader('./TaskUpdated.graphql')

interface TasksViewProps {
  className?: string
}

function TasksView(props: TasksViewProps) {
  const { data, error, loading, subscribeToMore } = useQuery<GetTasks>(GET_TASKS)

  useEffect(() => {
    const unsubscribe = subscribeToMore<TaskCreated>({
      document: TASK_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newTask = subscriptionData.data.taskCreated

        const alreadyExist = prev.tasks.some(task => task.id === newTask.id)
        if (alreadyExist) return prev

        return {
          ...prev,
          tasks: [...prev.tasks, newTask],
        }
      },
    })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToMore<TaskDeleted>({
      document: TASK_DELETED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return {
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== subscriptionData.data.taskDeleted.id),
        }
      },
    })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToMore<TaskUpdated>({ document: TASK_UPDATED })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tasks = !loading && data ? data.tasks : []

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
  )
}

export default TasksView
