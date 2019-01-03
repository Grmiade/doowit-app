import React from 'react'

import { Classes, Text } from '@blueprintjs/core'
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
      message @defer
    }
  `

  public render() {
    const { task } = this.props

    return (
      <Mutation<ToggleTask, ToggleTaskVariables> mutation={TOGGLE_TASK} variables={{ id: task.id }}>
        {(toogleTask, { loading }) => {
          const disabled = loading || isFakeId(task.id)
          return (
            <Task checked={task.done} disabled={disabled} onCheck={() => toogleTask()}>
              <Text className={!task.message ? Classes.TEXT_MUTED : undefined}>
                {task.message || 'Loading...'}
              </Text>
              <StyledDeleteTaskButton disabled={disabled} taskId={task.id} />
            </Task>
          )
        }}
      </Mutation>
    )
  }
}
