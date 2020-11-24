import React from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import DefaultButton from '../Button'
import { ButtonProps } from '../interfaces'

export const ButtonContainer = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center', wrap: 'wrap' })}
`

const StyledButton = styled(DefaultButton)`
  margin: 1rem;
  width: 12em;
  height: 100px;
`

const ButtonContent = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};

  svg {
    width: 64px;
    height: 64px;
    margin-right: 0.5rem;    

    path {
      fill: inherit;
    }
  }
`

export const Button: React.FunctionComponent<ButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      <ButtonContent>
        {children}
      </ButtonContent>
    </StyledButton>
  )
}

