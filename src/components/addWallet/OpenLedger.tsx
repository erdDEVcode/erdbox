import React, { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'
import { LedgerWallet } from 'elrondjs'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

import ResolvedWallet from './ResolvedWallet'
import Button from '../Button'
import ErrorBox from '../ErrorBox'
import Icon from '../Icon'

const Container = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })}
  padding: 2rem;
`

const StyledError = styled(ErrorBox)`
  min-width: 50%;
  text-align: center;
  word-break: normal;
`

const StyledResolvedWallet = styled(ResolvedWallet)`
  margin-top: 2rem;
  max-width: 400px;
`

const Content = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center', basis: 0 })}
  ${(p: any) => p.theme.font('body')};
  font-size: 1rem;
  width: 80%;
  text-align: center;

  p {
    line-height: 1.4em;
    margin-top: 2rem;
  }
`

const LedgerIcon = styled(Icon)`
  width: 160px;
`

const ConnectButton = styled(Button)`
  margin: 2rem 0 1rem;
`

interface Props {
  renderSuccess: Function
}

const OpenLedger: React.FunctionComponent<Props> = ({ renderSuccess }) => {
  const [wallet, setWallet] = useState<any>()
  const [error, setError] = useState()

  const connect = useCallback(async () => {
    try {
      const wallet = await LedgerWallet.connect([ TransportU2F, TransportWebUSB ])
      setWallet(wallet)
    } catch (err) {
      console.error(`Error fetching ledger wallet: ${err.message}`)
      setError(err)
      setWallet(null)
    }
  }, [])

  return (
    <Container>
      <Content>
        <LedgerIcon name='ledger' />
        <p>Connect your Ledger and open the Elrond app.</p>
        {wallet ? null : (
          <React.Fragment>
            <ConnectButton onClick={connect}>Connect to wallet</ConnectButton>
            {error ? <StyledError error={error} /> : null}
          </React.Fragment>
        )}
      </Content>
      <StyledResolvedWallet wallet={wallet} />
      {wallet ? renderSuccess(wallet) : null}
    </Container>
  )
}

export default OpenLedger