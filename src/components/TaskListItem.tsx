import React from 'react'

import { Text } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'

import { TaskItemFragment } from './__generated__/TaskItemFragment'
import { ToggleTask, ToggleTaskVariables } from './__generated__/ToggleTask'
import DeleteTaskButton from './DeleteTaskButton'
import Task from './Task'
import { isFakeId } from '../utils'

const StyledDeleteTaskButton = styled(DeleteTaskButton)`
  margin-left: auto;
`

const TOGGLE_TASK = gql`
  mutation ToggleTask($id: ID!) {
    toggleTask(id: $id) {
      id
      done
      version
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
      version
    }
  `

  public render() {
    const { task } = this.props
    const isFakeTask = isFakeId(task.id)

    return (
      <Mutation<ToggleTask, ToggleTaskVariables>
        mutation={TOGGLE_TASK}
        optimisticResponse={{
          toggleTask: {
            __typename: 'Task',
            done: !task.done,
            id: task.id,
            version: task.version + 1,
          },
        }}
        variables={{ id: task.id }}
      >
        {toogleTask => (
          <Task checked={task.done} loading={isFakeTask} onCheck={() => toogleTask()}>
            <Text>{task.message}</Text>
            <StyledDeleteTaskButton disabled={isFakeTask} taskId={task.id} />
          </Task>
        )}
      </Mutation>
    )
  }
}
