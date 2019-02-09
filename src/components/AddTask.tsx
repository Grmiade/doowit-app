import React, { useState } from 'react'

import { EditableText } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'

import { CreateTask, CreateTaskVariables } from './__generated__/CreateTask'
import { GetTasks } from './__generated__/GetTasks'
import Task from './Task'
import { GET_TASKS } from './TasksView'
import { generateFakeId } from '../utils'

const CREATE_TASK = gql`
  mutation CreateTask($message: String!) {
    createTask(message: $message) {
      id
      message
      done
    }
  }
`

const StyledEditableText = styled(EditableText)`
  width: 100%;
`

function AddTask() {
  const [value, setValue] = useState('')

  return (
    <Mutation<CreateTask, CreateTaskVariables>
      mutation={CREATE_TASK}
      optimisticResponse={{
        createTask: {
          __typename: 'Task',
          done: false,
          message: value,
          id: generateFakeId(),
        },
      }}
      update={(proxy, { data }) => {
        if (!data) return
        const prev = proxy.readQuery<GetTasks>({ query: GET_TASKS })
        if (prev) {
          const alreadyExist = prev.tasks.some(task => task.id === data.createTask.id)
          if (alreadyExist) return

          const tasks = [...prev.tasks, { __typename: 'Task', ...data.createTask }]
          proxy.writeQuery({ query: GET_TASKS, data: { ...prev, tasks } })
        }
      }}
    >
      {createTask => (
        <Task disabled>
          <StyledEditableText
            placeholder="New Task"
            value={value}
            onChange={setValue}
            onConfirm={value => {
              if (value !== '') {
                createTask({ variables: { message: value } })
                setValue('')
              }
            }}
          />
        </Task>
      )}
    </Mutation>
  )
}

export default AddTask
