import React, { useCallback, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'
import { BasicWallet } from 'elrondjs'

import ResolvedWallet from './ResolvedWallet'
import TextArea from '../TextArea'
import TextInput from '../TextInput'
import FileInput from '../FileInput'
import { isJson } from '../../utils'

const Container = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })}
`

const StyledTextArea = styled(TextArea)`
  height: 80px;
  width: 350px;
`

const PasswordInput = styled(TextInput)`
  margin-top: 1rem;
  max-width: 350px;
`

const StyledResolvedWallet = styled(ResolvedWallet)`
  margin-top: 2rem;
`

const StyledFileInput = styled(FileInput)`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-top: 1.5rem;
  ${(p: any) => p.theme.font('header')};
`

interface Props {
  renderSuccess: Function
}

const OpenPemJson: React.FunctionComponent<Props> = ({ renderSuccess }) => {
  const [wallet, setWallet] = useState<any>()
  const [value, setValue] = useState<string>('')
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  const updateValue = useCallback(txt => {
    setValue(txt)
    setPassword('')
    setShowPasswordInput(isJson(txt))
  }, [])

  useEffect(() => {
    const checkTimer = setTimeout(() => {
      if (value) {
        let wallet

        try {
          if (isJson(value)) {
            wallet = BasicWallet.fromJsonKeyFileString(value, password)
          } else {
            wallet = BasicWallet.fromPemFileString(value)
          }
        } catch (err) {
          // not valid
        }

        if (wallet) {
          setWallet(wallet)
          return
        }
      }

      setWallet(undefined)
    }, 250)

    return () => clearTimeout(checkTimer)
  }, [ value, password ])

  return (
    <Container>
      <StyledFileInput
        buttonContent='Open JSON or PEM file'
        accept=".json, .pem"
        onLoad={updateValue}
      />
      <StyledTextArea
        placeholder="Paste JSON or PEM contents here..."
        value={value}
        onChange={updateValue}
        rows={7}
      />
      {showPasswordInput ? (
        <React.Fragment>
          <Label>Enter password:</Label>
          <PasswordInput type="password" value={password} onChange={setPassword} placeholder="Password..." />
        </React.Fragment>
      ) : null}
      <StyledResolvedWallet wallet={wallet} />
      {wallet ? renderSuccess(wallet) : null}
    </Container>
  )
}

export default OpenPemJson