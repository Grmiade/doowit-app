import React from 'react'

import { Text } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { TaskItemFragment } from './__generated__/TaskItemFragment'
import { CompleteTask, CompleteTaskVariables } from './__generated__/CompleteTask'
import { UncompleteTask, UncompleteTaskVariables } from './__generated__/UncompleteTask'
import DeleteTaskButton from './DeleteTaskButton'
import Task from './Task'
import { isFakeId } from '../utils'

const COMPLETE_TASK = gql`
  mutation CompleteTask($id: ID!) {
    completeTask(id: $id) {
      id
      done
      version
    }
  }
`

const UNCOMPLETE_TASK = gql`
  mutation UncompleteTask($id: ID!) {
    uncompleteTask(id: $id) {
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
    const debounceOptions = { debounceKey: 'toggleTask', debounceTimeout: 500 }

    if (task.done) {
      return (
        <Mutation<UncompleteTask, UncompleteTaskVariables>
          mutation={UNCOMPLETE_TASK}
          optimisticResponse={{
            uncompleteTask: {
              __typename: 'Task',
              done: false,
              id: task.id,
              version: task.version + 1,
            },
          }}
          variables={{ id: task.id }}
          context={debounceOptions}
        >
          {uncompleteTask => (
            <Task
              checked
              actions={<DeleteTaskButton disabled={isFakeTask} taskId={task.id} />}
              loading={isFakeTask}
              onCheck={() => uncompleteTask()}
            >
              <Text>{task.message}</Text>
            </Task>
          )}
        </Mutation>
      )
    }

    return (
      <Mutation<CompleteTask, CompleteTaskVariables>
        mutation={COMPLETE_TASK}
        optimisticResponse={{
          completeTask: {
            __typename: 'Task',
            done: true,
            id: task.id,
            version: task.version + 1,
          },
        }}
        variables={{ id: task.id }}
        context={debounceOptions}
      >
        {completeTask => (
          <Task
            actions={<DeleteTaskButton disabled={isFakeTask} taskId={task.id} />}
            checked={false}
            loading={isFakeTask}
            onCheck={() => completeTask()}
          >
            <Text>{task.message}</Text>
          </Task>
        )}
      </Mutation>
    )
  }
}
