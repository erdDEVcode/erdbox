import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { Wallet } from 'elrondjs'

import Button from '../Button'
import { GlobalConsumer } from '../../contexts'
import CreatePassphrase from './CreatePassphrase'
import OpenPassphrase from './OpenPassphrase'
import OpenPemJson from './OpenPemJson'
import OpenLedger from './OpenLedger'
import { WALLET_PROCESS } from'../../constants'

const StyledButton = styled(Button)`
  margin-top: 2rem;
`

interface Props {
  process: string,
  onComplete?: () => void,
}

const RenderProcess: React.FunctionComponent<Props> = ({ process, onComplete }) => {
  const gotoDashboard = useCallback((addWallet, wallet) => {
    addWallet(wallet)
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  const buildButtonRenderFn = useCallback(addWallet => (wallet: Wallet) => (
    <StyledButton onClick={() => gotoDashboard(addWallet, wallet)}>Add wallet</StyledButton>
  ), [ gotoDashboard ])

  return (
    <GlobalConsumer>
      {({ addWallet }) => {
        const renderSuccess = buildButtonRenderFn(addWallet)

        switch (process) {
          case WALLET_PROCESS.CREATE_PASSPHRASE:
            return <CreatePassphrase renderSuccess={renderSuccess} />
          case WALLET_PROCESS.OPEN_PASSPHRASE:
            return <OpenPassphrase renderSuccess={renderSuccess}  />
          case WALLET_PROCESS.OPEN_PEMJSON:
            return <OpenPemJson renderSuccess={renderSuccess} />
          case WALLET_PROCESS.OPEN_LEDGER:
            return <OpenLedger renderSuccess={renderSuccess} />
        }
      }}
    </GlobalConsumer>
  )
}

export default RenderProcess