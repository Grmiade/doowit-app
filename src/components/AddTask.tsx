import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { EditableText } from '@blueprintjs/core'
import { loader } from 'graphql.macro'
import styled from 'styled-components'

import { CreateTask, CreateTaskVariables } from './__generated__/CreateTask'
import { GetTasks } from './__generated__/GetTasks'
import Task from './Task'
import { generateFakeId } from '../utils'

const CREATE_TASK = loader('./CreateTask.graphql')
const GET_TASKS = loader('./GetTasks.graphql')

const StyledEditableText = styled(EditableText)`
  width: 100%;
`

function AddTask() {
  const [value, setValue] = useState('')

  const [createTask] = useMutation<CreateTask, CreateTaskVariables>(CREATE_TASK, {
    optimisticResponse: {
      createTask: {
        __typename: 'Task',
        done: false,
        message: value,
        id: generateFakeId(),
      },
    },
    update(proxy, { data }) {
      if (!data) return
      const prev = proxy.readQuery<GetTasks>({ query: GET_TASKS })
      if (prev) {
        const alreadyExist = prev.tasks.some(task => task.id === data.createTask.id)
        if (alreadyExist) return

        const tasks = [...prev.tasks, { __typename: 'Task', ...data.createTask }]
        proxy.writeQuery({ query: GET_TASKS, data: { ...prev, tasks } })
      }
    },
    variables: { message: value },
  })

  return (
    <Task disabled>
      <StyledEditableText
        placeholder="New Task"
        value={value}
        onChange={setValue}
        onConfirm={value => {
          if (value !== '') {
            createTask()
            setValue('')
          }
        }}
      />
    </Task>
  )
}

export default AddTask
