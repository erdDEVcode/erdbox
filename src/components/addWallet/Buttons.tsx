import React from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import DefaultButton from '../Button'
import { ButtonProps } from '../interfaces'

export const ButtonContainer = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center', wrap: 'wrap' })}
`

const StyledButton = styled(DefaultButton)`
  width: 12em;
  margin: 1.5rem;
  height: 60px;

  ${(p: any) => p.theme.media.when({ minW: 'desktop' })} {
    height: 100px;
  }
`

const ButtonContent = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};

  svg {
    width: 32px;
    height: 32px;
    margin-right: 0.5rem;    

    path {
      fill: inherit;
    }
  }

  ${(p: any) => p.theme.media.when({ minW: 'desktop' })} {
    svg {
      width: 64px;
      height: 64px;
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

