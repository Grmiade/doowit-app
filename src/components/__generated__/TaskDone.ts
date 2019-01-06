/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: TaskDone
// ====================================================

export interface TaskDone_taskDone {
  __typename: 'Task'
  taskId: string
  done: boolean
  version: number
}

export interface TaskDone {
  taskDone: TaskDone_taskDone
}
