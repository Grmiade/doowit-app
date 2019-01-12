import React from 'react'

import { EditableText } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { CreateTask, CreateTaskVariables } from './__generated__/CreateTask'
import { GetTasks } from './__generated__/GetTasks'
import Task from './Task'
import { GET_TASKS } from './TasksView'
import { generateFakeId } from '../utils'

const CREATE_TASK = gql`
  mutation CreateTask($message: String!) {
    createTask(message: $message) {
      id
      message
      done
    }
  }
`

interface AddTaskState {
  value: string
}

export default class AddTask extends React.Component<{}, AddTaskState> {
  public state: AddTaskState = {
    value: '',
  }

  public render() {
    const { value } = this.state

    return (
      <Mutation<CreateTask, CreateTaskVariables>
        mutation={CREATE_TASK}
        optimisticResponse={{
          createTask: {
            __typename: 'Task',
            done: false,
            message: value,
            id: generateFakeId(),
          },
        }}
        update={(proxy, { data }) => {
          if (!data) return
          const prev = proxy.readQuery<GetTasks>({ query: GET_TASKS })
          if (prev) {
            const alreadyExist = prev.tasks.some(task => task.id === data.createTask.id)
            if (alreadyExist) return

            const tasks = [...prev.tasks, { __typename: 'Task', ...data.createTask }]
            proxy.writeQuery({ query: GET_TASKS, data: { ...prev, tasks } })
          }
        }}
      >
        {mutate => (
          <Task disabled>
            <EditableText
              confirmOnEnterKey
              placeholder="New Task"
              value={value}
              onChange={value => this.setState({ value })}
              onConfirm={value => {
                if (value !== '') {
                  mutate({ variables: { message: value } })
                  this.setState({ value: '' })
                }
              }}
            />
          </Task>
        )}
      </Mutation>
    )
  }
}
