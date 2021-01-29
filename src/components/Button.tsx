import React from 'react'
import styled from '@emotion/styled'
import { buttonStyles } from 'emotion-styled-utils'

import Icon from './Icon'
import Tooltip from './Tooltip'
import { ButtonProps } from './interfaces'

const StyledButton = styled.button`
  ${(p: any) => p.theme.font('body', 'light')};
  border-radius: 5px;
  font-size: 1.2rem;
  padding: 1em 2em;

  ${({ disabled, ...p }) => buttonStyles({
    ...p.theme.button,
    inDisabledState: disabled,
  })};
`

const Content = styled.div`
  display: inline-block;
`

const Button: React.FunctionComponent<ButtonProps> = ({ children, tooltip, onClick, ...props }) => {
  return (
    <Tooltip content={tooltip}>
      {({ tooltipElement, show, hide }) => (
        <StyledButton {...props} onClick={onClick} onMouseOver={show} onMouseOut={hide}>
          {children ? <Content>{children}</Content> : null}
          {tooltipElement}
        </StyledButton>
      )}
    </Tooltip>
  )
}

export default Button



