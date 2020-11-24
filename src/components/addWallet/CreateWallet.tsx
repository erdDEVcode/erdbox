import React from 'react'

import { ButtonContainer, Button } from './Buttons'
import Icon from '../Icon'
import styled from '@emotion/styled'

const ButtonIcon = styled(Icon)`
  margin-right: 0.5em;
`

interface Props {
  createPassphrase: () => void,
}

const CreateWallet: React.FunctionComponent<Props> = ({ createPassphrase }) => {
  return (
    <ButtonContainer>
      <Button onClick={createPassphrase}>
        <ButtonIcon name='seed' />
        <div>Seed phrase / mnemonic</div>
      </Button>
    </ButtonContainer>
  )
}

export default CreateWallet