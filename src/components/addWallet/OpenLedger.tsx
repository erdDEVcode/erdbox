import React, { useCallback, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import ResolvedWallet from './ResolvedWallet'
import { getLedgerWallet, isLedgerSupported } from '../../wallet'
import LoadingIcon from '../LoadingIcon'
import Button from '../Button'
import ErrorBox from '../ErrorBox'
import Icon from '../Icon'
import LedgerSvg from '../LedgerSvg'
import IconWithTooltip from '../IconWithTooltip'

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

const StyledLedgerSvg = styled(LedgerSvg)`
  width: 160px;
`

const ErrorIcon = styled(Icon)`
  font-size: 5rem;
  color: ${(p: any) => p.theme.openLedger.error.icon.color};
`

const InfoIcon = styled(IconWithTooltip)`
  font-size: 1rem;
`

const ConnectButton = styled(Button)`
  margin: 2rem 0 1rem;
`

const NotSupported = styled.p`
  font-size: 2rem;
`

interface Props {
  renderSuccess: Function
}

const OpenLedger: React.FunctionComponent<Props> = ({ renderSuccess }) => {
  const [wallet, setWallet] = useState<any>()
  const [supported, setSupported] = useState<boolean | undefined>()
  const [error, setError] = useState()

  useEffect(() => {
    isLedgerSupported().then(setSupported).catch(err => {
      console.error(err)
      setSupported(false)
    })
  }, [])

  const connect = useCallback(async () => {
    try {
      const wallet = await getLedgerWallet()
      setWallet(wallet)
    } catch (err) {
      console.error(`Error fetching ledger wallet: ${err.message}`)
      setError(err)
      setWallet(null)
    }
  }, [])

  return (
    <Container>
      {undefined === supported ? <LoadingIcon /> : (
        supported ? (
          <Content>
            <StyledLedgerSvg />
            <p>Connect your Ledger and open the Elrond app <InfoIcon icon='info' tooltip='You may need to enable "Developer Mode" on your Ledger to install the Elrond app.' /></p>
            {wallet ? null : (
              <React.Fragment>
                <ConnectButton onClick={connect}>Connect to wallet</ConnectButton>
                {error ? <StyledError error={error} /> : null}
              </React.Fragment>
            )}
          </Content>
        ) : (
          <Content>
            <ErrorIcon name='connection-error' />
            <NotSupported>Sorry, we do not yet support the use of a Ledger wallet with your browser. Please try in Chrome.</NotSupported>
          </Content>
        )
      )}
      <StyledResolvedWallet wallet={wallet} />
      {wallet ? renderSuccess(wallet) : null}
    </Container>
  )
}

export default OpenLedger