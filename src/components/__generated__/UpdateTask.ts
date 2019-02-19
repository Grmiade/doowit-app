/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTask
// ====================================================

export interface UpdateTask_updateTask {
  __typename: 'Task'
  id: string
  done: boolean
}

export interface UpdateTask {
  updateTask: UpdateTask_updateTask
}

export interface UpdateTaskVariables {
  id: string
  done: boolean
}
