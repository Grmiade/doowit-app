import React from 'react'

import { Intent, Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { loader } from 'graphql.macro'
import { Mutation } from 'react-apollo'

import { DeleteTask, DeleteTaskVariables } from './__generated__/DeleteTask'
import { GetTasks } from './__generated__/GetTasks'

const DELETE_TASK = loader('./DeleteTask.graphql')
const GET_TASKS = loader('./GetTasks.graphql')

interface DeleteTaskButtonProps {
  className?: string
  disabled?: boolean
  taskId: string
}

function DeleteTaskButton(props: DeleteTaskButtonProps) {
  return (
    <Mutation<DeleteTask, DeleteTaskVariables>
      mutation={DELETE_TASK}
      optimisticResponse={{
        deleteTask: {
          __typename: 'Task',
          id: props.taskId,
        },
      }}
      update={(proxy, { data }) => {
        if (!data) return
        const prev = proxy.readQuery<GetTasks>({ query: GET_TASKS })
        if (prev) {
          const tasks = prev.tasks.filter(task => task.id !== data.deleteTask.id)
          proxy.writeQuery({ query: GET_TASKS, data: { ...prev, tasks } })
        }
      }}
      variables={{ id: props.taskId }}
    >
      {deleteTask => (
        <Button
          small
          className={props.className}
          disabled={props.disabled}
          icon={IconNames.TRASH}
          intent={Intent.DANGER}
          onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            event.stopPropagation()
            deleteTask()
          }}
        />
      )}
    </Mutation>
  )
}

export default DeleteTaskButton
