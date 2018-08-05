/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleTask
// ====================================================

export interface ToggleTask_toggleTask {
  __typename: 'Task'
  id: string
  done: boolean
}

export interface ToggleTask {
  toggleTask: ToggleTask_toggleTask
}

export interface ToggleTaskVariables {
  id: string
}
