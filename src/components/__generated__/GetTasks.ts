/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTasks
// ====================================================

export interface GetTasks_tasks {
  __typename: 'Task'
  id: string
  done: boolean
  message: string
}

export interface GetTasks {
  __typename: 'Query'
  tasks: GetTasks_tasks[]
}
