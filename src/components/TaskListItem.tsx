import React from 'react'

import { useMutation } from '@apollo/react-hooks'
import { Text } from '@blueprintjs/core'
import { loader } from 'graphql.macro'

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

  const [updateTask] = useMutation<UpdateTask, UpdateTaskVariables>(UPDATE_TASK, {
    optimisticResponse: {
      updateTask: {
        __typename: 'Task',
        ...variables,
      },
    },
    variables,
    context: debounceOptions,
  })

  return (
    <Task
      actions={<DeleteTaskButton disabled={isFakeTask} taskId={task.id} />}
      checked={task.done}
      loading={isFakeTask}
      onCheck={() => updateTask()}
    >
      <Text>{task.message}</Text>
    </Task>
  )
}

export default TaskListItem
