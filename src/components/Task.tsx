import React from 'react'

import { Card, Checkbox, Elevation, Spinner } from '@blueprintjs/core'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`

const StyledSpinner = styled(Spinner)`
  margin-right: 10px;
`

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0;
`

interface TaskProps {
  className?: string
  checked: boolean
  disabled: boolean
  loading: boolean
  onCheck?: (value: boolean) => void
}

export default class Task extends React.Component<TaskProps> {
  public static defaultProps = {
    checked: false,
    disabled: false,
    loading: false,
  }

  private handleCheck = () => {
    const { checked, onCheck } = this.props
    if (onCheck) onCheck(!checked)
  }

  public render() {
    const { className, checked, children, disabled, loading } = this.props
    const isInteractive = !disabled && !loading

    return (
      <StyledCard
        interactive={isInteractive}
        className={className}
        elevation={Elevation.ONE}
        onClick={isInteractive ? this.handleCheck : undefined}
      >
        {loading ? (
          <StyledSpinner size={16} />
        ) : (
          <StyledCheckbox disabled={disabled} checked={checked} onChange={this.handleCheck} />
        )}
        {children}
      </StyledCard>
    )
  }
}
