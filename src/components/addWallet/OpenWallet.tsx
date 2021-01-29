import React from 'react'
import styled from '@emotion/styled'

import { ButtonContainer, Button } from './Buttons'
import Icon from '../Icon'

const Container = styled.div`
`

const ButtonIcon = styled(Icon)`
  margin-right: 0.5em;
`

const Better = styled(ButtonContainer)`
  button {
    font-size: 150%;
    width: 12em;
  }
`

const Worse = styled(ButtonContainer)`
  button {
    font-size: 90%;
    width: 14em;
  }
`

interface Props {
  className?: string,
  openLedger: () => void,
  openPassphrase: () => void,
  openPemJson: () => void,
}

const OpenWallet: React.FunctionComponent<Props> = ({ openLedger, openPassphrase, openPemJson, className }) => {
  return (
    <Container className={className}>
      <Better>
        <Button onClick={openLedger}>
          <ButtonIcon name='ledger' />
          <div>Ledger Nano</div>
        </Button>
      </Better>
      <Worse>
        <Button onClick={openPassphrase}>
          <ButtonIcon name='seed' />
          <div>Seed phrase / mnemonic</div>
        </Button>
        <Button onClick={openPemJson}>
          <ButtonIcon name='fileWallet' />
          <div>JSON or PEM file</div>
        </Button>
      </Worse>
    </Container>
  )
}

export default OpenWallet