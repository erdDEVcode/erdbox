import React from 'react'

import { ButtonContainer, Button } from './Buttons'
import SeedSvg from '../SeedSvg'

interface Props {
  createPassphrase: () => void,
}

const CreateWallet: React.FunctionComponent<Props> = ({ createPassphrase }) => {
  return (
    <ButtonContainer>
      <Button onClick={createPassphrase}>
        <SeedSvg />
        <div>Seed phrase / mnemonic</div>
      </Button>
    </ButtonContainer>
  )
}

export default CreateWallet