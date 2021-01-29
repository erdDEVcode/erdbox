import React, { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { flex, boxShadow, smoothTransitions } from 'emotion-styled-utils'

import Button from '../Button'
import CreateWallet from './CreateWallet'
import OpenWallet from './OpenWallet'
import RenderProcess from './RenderProcess'
import { WALLET_PROCESS } from '../../constants'

const Container = styled.div`
  width: 100%;
  margin: auto;
` 

const FirstPanel = styled.div`
  ${(p: any) => boxShadow({ color: p.theme.modal.shadowColor })};
  position: relative;
  width: 100%;
  display: ${(p: any) => p.isActive ? 'block': 'none'};;
  height: 350px;
`

const NextPanel = styled(FirstPanel)`
  background-color: ${(p: any) => p.theme.addWalletModal.activeTab.bgColor};
  display: ${(p: any) => p.isActive ? 'block': 'none'};;
  height: 640px;
  border-radius: 10px;

  & > div {
    ${flex({ direction: 'column', justify: 'center', align: 'stretch' })};
    height: 100%;
  }
`

const Tabs = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'stretch', basis: 0 })};
  border-collapse: collapse;
`

const Tab = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};
  ${(p: any) => p.theme.font('header')};
  font-size: ${(p: any) => p.isActive ? '1.2rem' : '1rem'};
  padding: 0.5em;
  background-color: ${(p: any) => p.isActive ? p.theme.addWalletModal.activeTab.bgColor : p.theme.addWalletModal.inactiveTab.bgColor};
  border: 1px solid ${(p: any) => p.isActive ? p.theme.addWalletModal.activeTab.borderColor : p.theme.addWalletModal.inactiveTab.borderColor};
  margin-bottom: -1px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const Section = styled.div`
  ${(p: any) => p.isActive ? flex({ direction: 'column', justify: 'center', align: 'center' }) : 'display: none;'};
  margin: 0 0 1rem;
  height: 100%;
  padding: 1rem;
  background-color: ${(p: any) => p.theme.addWalletModal.activeTab.bgColor};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

const BackButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.5em 1em;
  position: absolute;
  top: 10px;
  left: 10px;
`

const TABS = {
  OPEN: 'open',
  CREATE: 'create',
}

interface Props {
  className?: string
  onComplete?: () => void,
}

const AddWallet: React.FunctionComponent<Props> = ({ className, onComplete }) => {
  const [tab, setTab] = useState<string>(TABS.OPEN)
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
  
  const selectOpen = useCallback(() => {
    setTab(TABS.OPEN)
  }, [])

  const selectCreate = useCallback(() => {
    setTab(TABS.CREATE)
  }, [])

  return (
    <Container className={className}>
      <FirstPanel isActive={!showProcess}>
        <Tabs>
          <Tab isActive={tab === TABS.OPEN} onClick={selectOpen}>Open wallet</Tab>
          <Tab isActive={tab === TABS.CREATE} onClick={selectCreate}>Create new</Tab>
        </Tabs>
        <Section isActive={tab === TABS.OPEN}>
          <OpenWallet
            openLedger={openLedger}
            openPassphrase={openPassphrase}
            openPemJson={openPemJson}
          />
        </Section>
        <Section isActive={tab === TABS.CREATE}>
          <CreateWallet
            createPassphrase={createPassphrase}
          />
        </Section>
      </FirstPanel>
      <NextPanel isActive={!!showProcess}>
        <div>
          <BackButton onClick={toggleProcess}>← Back</BackButton>
          <RenderProcess key={processTick} process={process} onComplete={onComplete} />
        </div>
      </NextPanel>
    </Container>
  )
}

export default AddWallet

