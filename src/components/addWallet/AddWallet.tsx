import React, { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import Button from '../Button'
import CreateWallet from './CreateWallet'
import OpenWallet from './OpenWallet'
import RenderProcess from './RenderProcess'
import { WALLET_PROCESS } from '../../constants'
import SlidingPanels from '../SlidingPanels'

const HEIGHT = '640px'

const Container = styled.div`
  width: 640px;
  height: 640px;
  overflow: hidden;
`

const Panel = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  width: 100%;
  height: ${HEIGHT};
`

const BackButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.5em 1em;
  position: absolute;
  top: 10px;
  left: 10px;
`

interface Props {
  className?: string
  onComplete?: () => void,
}

const AddWallet: React.FunctionComponent<Props> = ({ className, onComplete }) => {
  const [process, setProcess] = useState<string>('')
  const [processTick, setProcessTick] = useState(0) /* use this to ensure process gets reset each time */
  const [ showProcess, setShowProcess ] = useState<boolean>(false)

  const toggleProcess = useCallback(() => {
    setShowProcess(!showProcess)
    setProcessTick(processTick + 1)
  }, [ processTick, showProcess ])

  const createPassphrase = useCallback(() => {
    setProcess(WALLET_PROCESS.CREATE_PASSPHRASE)
    toggleProcess()
  }, [ toggleProcess ])

  const openPassphrase = useCallback(() => {
    setProcess(WALLET_PROCESS.OPEN_PASSPHRASE)
    toggleProcess()
  }, [ toggleProcess ])

  const openPemJson = useCallback(() => {
    setProcess(WALLET_PROCESS.OPEN_PEMJSON)
    toggleProcess()
  }, [ toggleProcess ])

  const openLedger = useCallback(() => {
    setProcess(WALLET_PROCESS.OPEN_LEDGER)
    toggleProcess()
  }, [ toggleProcess ])

  return (
    <Container className={className}>
      <SlidingPanels active={showProcess ? 1 : 0}>
        <Panel>
          <h2>Open existing wallet</h2>
          <OpenWallet
            openLedger={openLedger}
            openPassphrase={openPassphrase}
            openPemJson={openPemJson}
          />
          <h2>Create new wallet</h2>
          <CreateWallet
            createPassphrase={createPassphrase}
          />
        </Panel>
        <Panel>
          <BackButton onClick={toggleProcess}>← Back</BackButton>
          <RenderProcess key={processTick} process={process} onComplete={onComplete} />
        </Panel>
      </SlidingPanels>
    </Container>
  )
}

export default AddWallet

