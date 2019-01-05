import React from 'react'

import { Text } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'

import { TaskItem } from './__generated__/TaskItem'
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
    }
  }
`

interface TaskListItemProps {
  task: TaskItem
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

    return (
      <Mutation<ToggleTask, ToggleTaskVariables>
        mutation={TOGGLE_TASK}
        // TODO: Use updatedAt to handle concurrency?
        // optimisticResponse={{
        //   toggleTask: {
        //     __typename: 'Task',
        //     done: !task.done,
        //     id: task.id,
        //   },
        // }}
        variables={{ id: task.id }}
      >
        {(toogleTask, { loading }) => (
          <Task checked={task.done} loading={loading || isFakeTask} onCheck={() => toogleTask()}>
            <Text>{task.message}</Text>
            <StyledDeleteTaskButton disabled={loading || isFakeTask} taskId={task.id} />
          </Task>
        )}
      </Mutation>
    )
  }
}
