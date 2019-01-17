import React from 'react'

import { Text } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { TaskItemFragment } from './__generated__/TaskItemFragment'
import { UpdateTask, UpdateTaskVariables } from './__generated__/UpdateTask'
import DeleteTaskButton from './DeleteTaskButton'
import Task from './Task'
import { isFakeId } from '../utils'

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $done: Boolean!) {
    updateTask(id: $id, done: $done) {
      id
      done
    }
  }
`

interface TaskListItemProps {
  task: TaskItemFragment
}

export default class TaskListItem extends React.Component<TaskListItemProps> {
  public static fragment = gql`
    fragment TaskItemFragment on Task {
      id
      done
      message
    }
  `

  public render() {
    const { task } = this.props
    const isFakeTask = isFakeId(task.id)
    const variables = { id: task.id, done: !task.done }
    const debounceOptions = { debounceKey: task.id, debounceTimeout: 500 }

    return (
      <Mutation<UpdateTask, UpdateTaskVariables>
        mutation={UPDATE_TASK}
        optimisticResponse={{
          updateTask: {
            __typename: 'Task',
            ...variables,
          },
        }}
        variables={variables}
        context={debounceOptions}
      >
        {updateTask => (
          <Task
            checked={task.done}
            actions={<DeleteTaskButton disabled={isFakeTask} taskId={task.id} />}
            loading={isFakeTask}
            onCheck={() => updateTask()}
          >
            <Text>{task.message}</Text>
          </Task>
        )}
      </Mutation>
    )
  }
}
