import React from 'react'

import { H1 } from '@blueprintjs/core'
import { loader } from 'graphql.macro'
import { Query } from 'react-apollo'

import { GetTasks } from './__generated__/GetTasks'
import AddTask from './AddTask'
import TaskList from './TaskList'
import { TaskCreated } from './__generated__/TaskCreated'
import { TaskDeleted } from './__generated__/TaskDeleted'
import { TaskUpdated } from './__generated__/TaskUpdated'

const GET_TASKS = loader('./GetTasks.graphql')
const TASK_CREATED = loader('./TaskCreated.graphql')
const TASK_DELETED = loader('./TaskDeleted.graphql')
const TASK_UPDATED = loader('./TaskUpdated.graphql')

interface TasksViewProps {
  className?: string
}

function TasksView(props: TasksViewProps) {
  return (
    <div className={props.className}>
      <H1>
        <span aria-label="alarm" role="img">
          ⏰
        </span>{' '}
        MY TASKS
      </H1>
      <Query<GetTasks> query={GET_TASKS}>
        {({ data, loading, error, subscribeToMore }) => {
          if (error) return error.message

          const tasks = !loading && data ? data.tasks : []

          return (
            <>
              <TaskList
                loading={loading}
                subscribeToNewTask={() =>
                  subscribeToMore<TaskCreated>({
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
                }
                subscribeToTaskDeleted={() =>
                  subscribeToMore<TaskDeleted>({
                    document: TASK_DELETED,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      return {
                        ...prev,
                        tasks: prev.tasks.filter(
                          task => task.id !== subscriptionData.data.taskDeleted.id,
                        ),
                      }
                    },
                  })
                }
                subscribeToTaskDone={() => subscribeToMore<TaskUpdated>({ document: TASK_UPDATED })}
                tasks={tasks}
              />
              {!loading && <AddTask />}
            </>
          )
        }}
      </Query>
    </div>
  )
}

export default TasksView
