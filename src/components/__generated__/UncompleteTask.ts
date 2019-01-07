/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UncompleteTask
// ====================================================

export interface UncompleteTask_uncompleteTask {
  __typename: 'Task'
  id: string
  done: boolean
}

export interface UncompleteTask {
  uncompleteTask: UncompleteTask_uncompleteTask
}

export interface UncompleteTaskVariables {
  id: string
}
