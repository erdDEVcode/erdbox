import React, { useState, useMemo, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'
import { LedgerWallet, SignedTransaction, Transaction } from 'elrondjs'

import { AssetValueNumberStyle } from '../../utils'
import Button from '../Button'
import TotalCost from './TotalCost'
import FiatValue from './FiatValue'
import ErrorBox from '../ErrorBox'
import LoadingIcon from '../LoadingIcon'
import Icon from '../Icon'
import { DisplayOptions } from './interfaces'


const Container = styled.div`
`

const Group = styled.div`
  margin-bottom: 2rem;
`

const Label = styled.div`
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
  margin-bottom: 0.2rem;
  ${(p: any) => p.theme.font('body', 'bold')};
`

const TextValue = styled.div`
  ${(p: any) => p.theme.font('data')};
`

const ConfirmContainer = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
  margin-bottom: 2rem;
`

const WaitingForLedger = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
  ${(p: any) => p.theme.font('body', 'bold', 'italic')};
  color: ${(p: any) => p.theme.send.waitingForLedger.textColor};
  margin-left: 0.5rem;

  svg {
    width: 50px;
    height: auto;
    margin-right: 0.5rem;
  }
`

const StyledErrorBox = styled(ErrorBox)`
  margin-bottom: 1rem;
`

const BackButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.5em 1em;
  position: absolute;
  top: 10px;
  left: 10px;
`

interface Props {
  className?: string,
  displayOptions?: DisplayOptions,
  onPrevious?: () => void,
  onSign: (tx: Transaction) => Promise<any>,
  props: any,
}

const ConfirmForm: React.FunctionComponent<Props> = ({
  className,
  onPrevious,
  onSign,
  props: {
    wallet,
    fromValue,
    toValue,
    transferValueDec,
    rate,
    dataValue,
    gasLimitValue,
    gasPriceValue,
    gasPriceValueDec,
    totalGasValue,
    totalGasCurrencyValue,
    totalValue,
    totalCurrencyValue,
  },
}) => {
  const [ signing, setSigning ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  const transferValueString = useMemo(() => {
    if (transferValueDec) {
      return transferValueDec.toString({ numberStyle: AssetValueNumberStyle.RAW_SCALED, showSymbol: true })
    } else {
      return null
    }
  }, [transferValueDec])

  const transferCurrencyValueString = useMemo(() => {
    if (rate && transferValueDec) {
      return transferValueDec.toCurrencyValueString(rate)
    } else {
      return null
    }
  }, [rate, transferValueDec])

  const doSign = useCallback(async () => {
    if (signing) {
      return
    }

    setSigning(true)
    setError('')
    
    const tx: Transaction = {
      sender: fromValue,
      receiver: toValue,
      value: transferValueDec.toString({ numberStyle: AssetValueNumberStyle.RAW }),
      gasPrice: gasPriceValueDec.toNumber({ numberStyle: AssetValueNumberStyle.RAW }),
      gasLimit: gasLimitValue,
      data: dataValue,
    }

    onSign(tx)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setSigning(false)
      })
  }, [
    fromValue,
    toValue,
    dataValue,
    transferValueDec,
    gasPriceValueDec,
    gasLimitValue,
    onSign,
    signing,
  ])

  return (
    <Container className={className}>
      {onPrevious ? <BackButton onClick={onPrevious}>← Edit</BackButton> : null}
      <Group>
        <Label>From</Label>
        <TextValue>{fromValue}</TextValue>
      </Group>
      <Group>
        <Label>To</Label>
        <TextValue>{toValue}</TextValue>
      </Group>
      <Group>
        <Label>Transfer</Label>
        <TextValue>{transferValueString} <FiatValue value={transferCurrencyValueString} /></TextValue>
      </Group>
      {dataValue ? (
        <Group>
          <Label>Data</Label>
          <TextValue>{dataValue}</TextValue>
        </Group>
      ) : null}
      <Group>
        <Label>Transaction fee</Label>
        <TextValue>{gasLimitValue} x {gasPriceValue} = {totalGasValue}</TextValue>
      </Group>
      <Group>
        <TotalCost
          totalGasValue={totalGasValue}
          totalGasCurrencyValue={totalGasCurrencyValue}
          totalValue={totalValue}
          totalCurrencyValue={totalCurrencyValue}
        />
      </Group>
      {error ? <StyledErrorBox error={error} /> : null}
      <ConfirmContainer>
        <Button onClick={doSign}>
          {signing ? <LoadingIcon /> : 'Confirm and sign'}
        </Button>
        {(signing && (wallet instanceof LedgerWallet)) ? (
          <WaitingForLedger>
            <Icon name='ledger' />
            <span>Please confirm on your Ledger...</span>
          </WaitingForLedger>
        ) : null}
      </ConfirmContainer>
    </Container>
  )
}

export default ConfirmForm
