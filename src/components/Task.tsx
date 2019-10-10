import React from 'react';

import { Card, Checkbox, Elevation, Spinner } from '@blueprintjs/core';
import styled from 'styled-components/macro';

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const StyledSpinner = styled(Spinner)`
  margin-right: 10px;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0;
`;

const StyledActions = styled.div`
  margin-left: auto;
`;

interface TaskProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  checked: boolean;
  disabled: boolean;
  loading: boolean;
  onCheck?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

function Task(props: TaskProps) {
  const { actions, className, checked, children, disabled, loading, onCheck } = props;

  return (
    <StyledCard
      className={className}
      elevation={Elevation.ONE}
      interactive={!disabled}
      onClick={event => {
        event.preventDefault();
        if (onCheck) onCheck(event);
      }}
    >
      <StyledCheckbox checked={checked} disabled={disabled} />
      {children}
      {loading && <StyledSpinner size={16} />}
      {actions && <StyledActions>{actions}</StyledActions>}
    </StyledCard>
  );
}

Task.defaultProps = {
  checked: false,
  disabled: false,
  loading: false,
};

export default Task;
