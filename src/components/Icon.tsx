import React from 'react'
import styled from '@emotion/styled'

import LedgerSvg from '../images/ledger-small.svg'
import SeedSvg from '../images/seed.svg'
import FileWalletSvg from '../images/fileWallet.svg'
// import UndoSvg from '../images/ledger-small.svg'
// import PlusSvg from '../images/ledger-small.svg'

const ICONS: Record<string, any> = {
  ledger: LedgerSvg,
  seed: SeedSvg,
  fileWallet: FileWalletSvg,
}

export interface Props {
  className?: string,
  name: string,
  title?: string,
}


const Container = styled.span`
  display: inline-block;
  svg {
    max-width: 100%;
    max-height: 100%;
  }
`

const Icon: React.FunctionComponent<Props> = ({ name, ...props }) => {
  const Comp = ICONS[name]

  if (!Comp) {
    return null
  }

  return (
    <Container {...props}>
      <Comp />
    </Container>
  )
}

export default Icon
