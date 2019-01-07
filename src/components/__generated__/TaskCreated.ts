/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: TaskCreated
// ====================================================

export interface TaskCreated_taskCreated {
  __typename: 'Task'
  id: string
  message: string
  done: boolean
}

export interface TaskCreated {
  taskCreated: TaskCreated_taskCreated
}
