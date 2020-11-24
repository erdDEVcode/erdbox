import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'
import { BasicWallet } from 'elrondjs'

import ResolvedWallet from './ResolvedWallet'
import TextArea from '../TextArea'

const Container = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })}
`

const StyledTextArea = styled(TextArea)`
  height: 140px;
  width: 400px;
`

const StyledResolvedWallet = styled(ResolvedWallet)`
  margin-top: 2rem;
  max-width: 400px;
`

interface Props {
  renderSuccess: Function
}

const OpenPassphrase: React.FunctionComponent<Props> = ({ renderSuccess }) => {
  const [wallet, setWallet] = useState<any>()
  const [value, setValue] = useState('')

  useEffect(() => {
    const checkTimer = setTimeout(() => {
      if (value) {
        const wallet = BasicWallet.fromMnemonic(value)
        if (wallet) {
          setWallet(wallet)
          return
        }
      }

      setWallet(undefined)
    }, 250)

    return () => clearTimeout(checkTimer)
  }, [ value ])

  return (
    <Container>
      <h2>Enter seed phrase below</h2>
      <StyledTextArea
        placeholder="Enter seed phrase here..."
        value={value}
        onChange={setValue}
      />
      <StyledResolvedWallet wallet={wallet} />
      {wallet ? renderSuccess(wallet) : null}
    </Container>
  )
}

export default OpenPassphrase