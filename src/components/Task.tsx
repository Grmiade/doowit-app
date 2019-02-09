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

const StyledActions = styled.div`
  margin-left: auto;
`

interface TaskProps {
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  checked: boolean
  disabled: boolean
  loading: boolean
  onCheck?: () => void
}

function Task(props: TaskProps) {
  const { actions, className, checked, children, disabled, loading } = props
  const isInteractive = !disabled && !loading

  return (
    <StyledCard
      interactive={isInteractive}
      className={className}
      elevation={Elevation.ONE}
      onClick={event => {
        event.preventDefault()
        if (isInteractive && props.onCheck) props.onCheck()
      }}
    >
      {loading ? (
        <StyledSpinner size={16} />
      ) : (
        <StyledCheckbox disabled={!isInteractive} checked={checked} />
      )}
      {children}
      {actions && <StyledActions>{actions}</StyledActions>}
    </StyledCard>
  )
}

Task.defaultProps = {
  checked: false,
  disabled: false,
  loading: false,
}

export default Task
