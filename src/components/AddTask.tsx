import React from 'react'

import { EditableText } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { CreateTask, CreateTaskVariables } from './__generated__/CreateTask'
import Task from './Task'
import { GET_TASKS } from './TasksView'

const CREATE_TASK = gql`
  mutation CreateTask($message: String!) {
    createTask(message: $message) {
      id
      message
      done
    }
  }
`

interface AddTaskProps {
  subscribeToNewTask: () => () => void
}

interface AddTaskState {
  value: string
}

export default class AddTask extends React.Component<AddTaskProps, AddTaskState> {
  private unsubscribeToNewTask: () => void

  public state: AddTaskState = {
    value: '',
  }

  public componentDidMount() {
    this.unsubscribeToNewTask = this.props.subscribeToNewTask()
  }

  public componentWillUnmount() {
    this.unsubscribeToNewTask()
  }

  public render() {
    return (
      <Mutation<CreateTask, CreateTaskVariables>
        mutation={CREATE_TASK}
        refetchQueries={[{ query: GET_TASKS }]}
      >
        {mutate => (
          <Task disabled>
            <EditableText
              confirmOnEnterKey
              placeholder="New Task"
              value={this.state.value}
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
