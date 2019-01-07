/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskListFragment
// ====================================================

export interface TaskListFragment_tasks {
  __typename: 'Task'
  id: string
  done: boolean
  message: string
}

export interface TaskListFragment {
  __typename: 'Query'
  tasks: TaskListFragment_tasks[]
}
