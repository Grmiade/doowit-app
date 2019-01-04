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
      id
      done
    }
  }
`

function TasksView() {
  return (
    <>
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
                      return {
                        ...prev,
                        tasks: [...prev.tasks, subscriptionData.data.taskCreated],
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
                subscribeToTaskDone={() => subscribeToMore<TaskDone>({ document: TASK_DONE })}
                tasks={!loading ? data!.tasks : []}
              />
              {!loading && <AddTask />}
            </>
          )
        }}
      </Query>
    </>
  )
}

export default TasksView
