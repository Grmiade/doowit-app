import React from 'react'

import { ProgressBar, Intent } from '@blueprintjs/core'
import gql from 'graphql-tag'

import { TaskItem } from './__generated__/TaskItem'
import TaskListItem from './TaskListItem'

interface TaskListProps {
  loading: boolean
  subscribeToTaskDone: () => () => void
  subscribeToTaskDeleted: () => () => void
  tasks: TaskItem[]
}

export default class TaskList extends React.Component<TaskListProps> {
  public static defaultProps = {
    loading: false,
  }

  public static fragment = gql`
    fragment TaskListFragment on Query {
      tasks {
        ...TaskItemFragment
      }
    }
    ${TaskListItem.fragment}
  `

  private static determineRatioIntent(ratio: number) {
    if (ratio >= 0.75) return Intent.SUCCESS
    if (ratio >= 0.5) return Intent.WARNING
    return Intent.DANGER
  }

  private unsubscribeToTaskDone: () => void
  private unsubscribeToTaskDeleted: () => void

  public componentDidMount() {
    this.unsubscribeToTaskDone = this.props.subscribeToTaskDone()
    this.unsubscribeToTaskDeleted = this.props.subscribeToTaskDeleted()
  }

  public componentWillUnmount() {
    this.unsubscribeToTaskDone()
    this.unsubscribeToTaskDeleted()
  }

  public render() {
    const { loading, tasks } = this.props

    if (loading) return <ProgressBar animate stripes intent={Intent.NONE} value={1} />

    const ratio = tasks.length !== 0 ? tasks.filter(task => task.done).length / tasks.length : 1

    return (
      <>
        <ProgressBar
          animate={false}
          intent={TaskList.determineRatioIntent(ratio)}
          stripes={false}
          value={ratio}
        />
        <br />
        {tasks.map(task => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </>
    )
  }
}
