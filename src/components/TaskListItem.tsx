import React from 'react'

import { Text } from '@blueprintjs/core'
import { loader } from 'graphql.macro'
import { Mutation } from 'react-apollo'

import { TaskFragment } from './__generated__/TaskFragment'
import { UpdateTask, UpdateTaskVariables } from './__generated__/UpdateTask'
import DeleteTaskButton from './DeleteTaskButton'
import Task from './Task'
import { isFakeId } from '../utils'

const UPDATE_TASK = loader('./UpdateTask.graphql')

interface TaskListItemProps {
  task: TaskFragment
}

function TaskListItem(props: TaskListItemProps) {
  const { task } = props
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

export default TaskListItem
