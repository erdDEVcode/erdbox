import React from 'react'
import styled from '@emotion/styled'

const Container = styled.span``

interface FiatValueProps {
  className?: string,
  value: string,
}

const FiatValue: React.FunctionComponent<FiatValueProps> = ({ className, value }) => {
  return value ? (
    <Container className={className}>
      ({value})
    </Container>
  ) : null
}

export default FiatValue