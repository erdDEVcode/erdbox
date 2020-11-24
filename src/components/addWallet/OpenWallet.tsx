import React from 'react'

import { ButtonContainer, Button } from './Buttons'
import Icon from '../Icon'
import styled from '@emotion/styled'

const ButtonIcon = styled(Icon)`
  margin-right: 0.5em;
`

interface Props {
  openLedger: () => void,
  openPassphrase: () => void,
  openPemJson: () => void,
}

const OpenWallet: React.FunctionComponent<Props> = ({ openLedger, openPassphrase, openPemJson }) => {
  return (
    <ButtonContainer>
      <Button onClick={openPassphrase}>
        <ButtonIcon name='seed' />
        <div>Seed phrase / mnemonic</div>
      </Button>
      <Button onClick={openPemJson}>
        <ButtonIcon name='fileWallet' />
        <div>JSON or PEM file</div>
      </Button>
      <Button onClick={openLedger}>
        <ButtonIcon name='ledger' />
        <div>Ledger Nano</div>
      </Button>
    </ButtonContainer>
  )
}

export default OpenWallet