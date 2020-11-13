import React from 'react'

import { ButtonContainer, Button } from './Buttons'
import LedgerSvg from '../LedgerSvg'
import SeedSvg from '../SeedSvg'
import FileWalletSvg from '../FileWalletSvg'

interface Props {
  openLedger: () => void,
  openPassphrase: () => void,
  openPemJson: () => void,
}

const OpenWallet: React.FunctionComponent<Props> = ({ openLedger, openPassphrase, openPemJson }) => {
  return (
    <ButtonContainer>
      <Button onClick={openPassphrase}>
        <SeedSvg />
        <div>Seed phrase / mnemonic</div>
      </Button>
      <Button onClick={openPemJson}>
        <FileWalletSvg />
        <div>JSON or PEM file</div>
      </Button>
      <Button onClick={openLedger}>
        <LedgerSvg />
        <div>Ledger Nano</div>
      </Button>
    </ButtonContainer>
  )
}

export default OpenWallet