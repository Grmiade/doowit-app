import React from 'react'

import { Card, Checkbox, Elevation } from '@blueprintjs/core'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0;
`

interface TaskProps {
  className?: string
  checked: boolean
  disabled?: boolean
  onCheck?: (value: boolean) => void
}

export default class Task extends React.Component<TaskProps> {
  public static defaultProps = {
    checked: false,
  }

  private handleCheck = () => {
    const { checked, disabled, onCheck } = this.props
    if (!disabled && onCheck) onCheck(!checked)
  }

  public render() {
    const { className, checked, children, disabled } = this.props

    return (
      <StyledCard
        interactive={!disabled}
        className={className}
        elevation={Elevation.ONE}
        onClick={this.handleCheck}
      >
        <StyledCheckbox disabled={disabled} checked={checked} onChange={this.handleCheck} />
        {children}
      </StyledCard>
    )
  }
}
