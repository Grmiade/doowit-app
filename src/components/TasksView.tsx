import React from 'react'

import { H1 } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { GetTasks } from './__generated__/GetTasks'
import AddTask from './AddTask'
import TaskList from './TaskList'
import { TaskCreated } from './__generated__/TaskCreated'
import { TaskDeleted } from './__generated__/TaskDeleted'
import { TaskDone } from './__generated__/TaskDone'

export const GET_TASKS = gql`
  query GetTasks {
    ...TaskListFragment
  }
  ${TaskList.fragment}
`

const TASK_CREATED = gql`
  subscription TaskCreated {
    taskCreated {
      id
      message
      done
      version
    }
  }
`

const TASK_DELETED = gql`
  subscription TaskDeleted {
    taskDeleted {
      id
    }
  }
`

const TASK_DONE = gql`
  subscription TaskDone {
    taskDone {
      taskId: id
      done
      version
    }
  }
`

interface TasksViewProps {
  className?: string
}

function TasksView(props: TasksViewProps) {
  return (
    <div className={props.className}>
      <H1>⏰ MY TASKS</H1>
      <Query<GetTasks> query={GET_TASKS}>
        {({ data, loading, error, subscribeToMore }) => {
          if (error) return error.message

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
                subscribeToTaskDone={() =>
                  subscribeToMore<TaskDone>({
                    document: TASK_DONE,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      const updatedTask = subscriptionData.data.taskDone
                      return {
                        ...prev,
                        tasks: prev.tasks.map(task => {
                          const shouldApplyUpdate =
                            updatedTask.taskId === task.id && updatedTask.version >= task.version
                          if (shouldApplyUpdate) return { ...task, ...updatedTask }
                          return task
                        }),
                      }
                    },
                  })
                }
                tasks={!loading ? data!.tasks : []}
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
