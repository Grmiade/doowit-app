/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompleteTask
// ====================================================

export interface CompleteTask_completeTask {
  __typename: 'Task'
  id: string
  done: boolean
  version: number
}

export interface CompleteTask {
  completeTask: CompleteTask_completeTask
}

export interface CompleteTaskVariables {
  id: string
}
