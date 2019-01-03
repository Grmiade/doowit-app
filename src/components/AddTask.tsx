import React from 'react'

import { EditableText } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { CreateTask, CreateTaskVariables } from './__generated__/CreateTask'
import Task from './Task'
import { GET_TASKS } from './TasksView'
// import { GetTasks } from './__generated__/GetTasks'
// import { generateFakeId } from '../utils'

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
    const { value } = this.state

    return (
      <Mutation<CreateTask, CreateTaskVariables>
        awaitRefetchQueries
        mutation={CREATE_TASK}
        refetchQueries={[{ query: GET_TASKS }]}
        // optimisticResponse={{
        //   __typename: 'Mutation',
        //   createTask: {
        //     __typename: 'Task',
        //     done: false,
        //     message: value,
        //     id: generateFakeId(),
        //   },
        // }}
        // update={(proxy, result) => {
        //   if (!result.data) return
        //   const data = proxy.readQuery<GetTasks>({ query: GET_TASKS })
        //   if (data) {
        //     const alreadyExist = data.tasks.some(task => task.id === result.data!.createTask.id)
        //     if (alreadyExist) return

        //     data.tasks.push({ __typename: 'Task', ...result.data.createTask })
        //     proxy.writeQuery({ query: GET_TASKS, data })
        //   }
        // }}
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
