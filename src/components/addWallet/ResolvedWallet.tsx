import React from 'react'
import styled from '@emotion/styled'

import { Wallet } from '../../types/all'
import ValueBox from '../ValueBox'

const Container = styled(ValueBox)`
`

const Text = styled.div`
  font-size: 1.1rem;
  word-break: break-all;

  label {
    ${(p: any) => p.theme.font('body', 'light')};
    display: block;
    font-style: italic;
    font-size: 70%;
    margin: 0 0.2em 0.2em 0;
  }
`

interface Props {
  wallet?: Wallet,
  className?: string,
}

const ResolvedWallet: React.FunctionComponent<Props> = ({ wallet, className }) => {
  return wallet ? (
    <Container className={className}>
      <Text><label>Address:</label> {wallet.address()}</Text>
    </Container>
  ) : null
}


export default ResolvedWallet