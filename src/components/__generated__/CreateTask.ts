/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTask
// ====================================================

export interface CreateTask_createTask {
  __typename: 'Task'
  id: string
  message: string
  done: boolean
  version: number
}

export interface CreateTask {
  createTask: CreateTask_createTask
}

export interface CreateTaskVariables {
  message: string
}
