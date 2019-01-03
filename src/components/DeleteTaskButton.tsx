import React from 'react'

import { Intent, Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { DeleteTask, DeleteTaskVariables } from './__generated__/DeleteTask'
import { GET_TASKS } from './TasksView'

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`

interface DeleteTaskButtonProps {
  className?: string
  taskId: string
}

function DeleteTaskButton(props: DeleteTaskButtonProps) {
  return (
    <Mutation<DeleteTask, DeleteTaskVariables>
      awaitRefetchQueries
      mutation={DELETE_TASK}
      variables={{ id: props.taskId }}
      refetchQueries={[{ query: GET_TASKS }]}
    >
      {(deleteTask, { loading }) => (
        <Button
          small
          className={props.className}
          loading={loading}
          icon={IconNames.TRASH}
          intent={Intent.DANGER}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            deleteTask()
          }}
        />
      )}
    </Mutation>
  )
}

export default DeleteTaskButton
