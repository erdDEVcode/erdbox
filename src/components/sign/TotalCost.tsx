import React from 'react'
import styled from '@emotion/styled'

import ValueBox from '../ValueBox'
import FiatValue from './FiatValue'

const Container = styled(ValueBox)`
  & > div {
    margin-bottom: 1rem;

    &:last-of-type {
      margin-bottom: 0;
      font-size: 120%;
    }
  }

  strong {
    display: inline-block;
    width: 3em;
    ${(p: any) => p.theme.font('body', 'bold')};
    margin-right: 1em;
  }
`

interface TotalCostProps {
  className?: string,
  totalGasValue: string,
  totalGasCurrencyValue: string,
  totalValue: string,
  totalCurrencyValue: string,
}

const TotalCost: React.FunctionComponent<TotalCostProps> = ({
  className,
  totalGasValue,
  totalGasCurrencyValue,
  totalValue,
  totalCurrencyValue,
}) => {
  return (
    <Container className={className}>
      <div>
        <strong>Fee:</strong>
        {totalGasValue ? (
          <span>
            {totalGasValue} <FiatValue value={totalGasCurrencyValue} />
          </span>
        ) : null}
      </div>
      <div>
        <strong>Total:</strong>
        {totalValue ? (
          <span>
            {totalValue} <FiatValue value={totalCurrencyValue} />
          </span>
        ) : null}
      </div>
    </Container>
  )
}

export default TotalCost