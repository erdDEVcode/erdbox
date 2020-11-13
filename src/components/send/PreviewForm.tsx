import React, { useState, useMemo, useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import Data from '../../data'
import {
  AssetValue,
  AssetValueNumberStyle,
} from '../../utils/number'
import { isValidAddress } from '../../utils'
import TextInput from '../TextInput'
import TotalCost from './TotalCost'
import TextArea from '../TextArea'
import ErrorBox from '../ErrorBox'
import Button from '../Button'
import IconButton from '../IconButton'
import TextButton from '../TextButton'
import { DisplayOptions } from './interfaces'

const Container = styled.div``

const Group = styled.div`
  margin-bottom: 1.5rem;
`

const FinalGroup = styled(Group)``

const Label = styled.div`
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
  margin-bottom: 0.2rem;
`

const Col = styled.div`
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
`

const Line = styled.div`
  position: relative;
  display: inline-block;

  span {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 80%;
    color: ${(p: any) => p.theme.send.currency.textColor};
  }

  input {
    width: 100%;
  }
`

const CryptoLine = styled(Line)`
  width: 60%;
`

const FiatLine = styled(Line)`
  width: 38%;
`

const GasCol = styled(Col)`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};

  & > span {
    display: inline-block;
    margin: 0 1rem;
  }
`

const GasLimit = styled(Line)`
  width: 12em;
  min-width: 12em;
`
const GasPrice = styled(Line)`
  width: 12em;
  min-width: 12em;
`

const ResetButton = styled(IconButton)`
  font-size: 0.5rem;
`

const GasTotal = styled.div`
`

const StyledTextInput = styled(TextInput)`
  margin-top: 0.1rem;
`

const BalanceValue = styled.span`
  cursor: pointer;
  font-size: 90%;
  color: ${(p: any) => p.theme.button.textColor};
  margin-left: 0.4rem;
`

const TotalError = styled(ErrorBox)``
const ValueError = styled(ErrorBox)``

const PreviewButton = styled(Button)`
  margin-top: 2rem;
`

const AddDataButton = styled(TextButton)`
  font-size: 0.9rem;
`

const NUMBER_REGEX = /^[0-9]+(\.([0-9]+)?)?$/
const WHOLE_NUMBER_REGEX = /^[0-9]+$/

interface PreviewProps {
  className?: string,
  displayOptions?: DisplayOptions,
  props: any,
  onNext: () => void,
}

const PreviewForm: React.FunctionComponent<PreviewProps> = ({
  className,
  displayOptions,
  props: {
    primaryToken, gasPerDataByte, minGasLimit,
    toValue, setToValue,
    balanceDec, gasCostDec, transferValueDec,
    minValue, minValueString,
    cryptoValue, setCryptoValue,
    fiatValue, setFiatValue,
    dataValue, setDataValue,
    valueError, setValueError,
    rate,
    gasLimitValue, setGasLimitValue, resetGasLimit,
    gasPriceValue, setGasPriceValue, resetGasPrice,
    totalGasValue, setTotalGasValue,
    totalGasCurrencyValue, setTotalGasCurrencyValue,
    totalValue, setTotalValue,
    totalCurrencyValue, setTotalCurrencyValue,
    totalError, setTotalError,
  },
  onNext,
}) => {
  const [showDataInput, setShowDataInput] = useState(false)

  const balanceAsString = useMemo(() => {
    if (balanceDec) {
      return balanceDec.toString({ numberStyle: AssetValueNumberStyle.RAW_SCALED })
    } else {
      return null
    }
  }, [balanceDec])

  const updateCryptoValue = useCallback(v => {
    if (!NUMBER_REGEX.exec(v)) {
      setCryptoValue('')
      setFiatValue('')
    } else {
      setCryptoValue(v)

      if (rate) {
        setFiatValue(AssetValue.fromTokenScaledAmount(primaryToken, v).toCurrencyValueString(rate, {
          numberStyle: AssetValueNumberStyle.SUCCINCT_SCALED
        }))
      } else {
        setFiatValue('')
      }
    }
  }, [rate, setFiatValue, setCryptoValue, primaryToken])

  const updateFiatValue = useCallback(v => {
    if (!NUMBER_REGEX.exec(v)) {
      setCryptoValue('')
      setFiatValue('')
    } else {
      if (rate) {
        setFiatValue(v)

        if (v) {
          setCryptoValue(AssetValue.fromTokenCurrencyValue(primaryToken, rate, v).toString({
            numberStyle: AssetValueNumberStyle.RAW_SCALED
          }))
        } else {
          setCryptoValue('')
        }
      }
    }
  }, [rate, setFiatValue, setCryptoValue, primaryToken])

  const updateGasPriceValue = useCallback(v => {
    if (!NUMBER_REGEX.exec(v)) {
      setGasPriceValue('')
    } else {
      setGasPriceValue(v)
    }
  }, [setGasPriceValue])

  const updateGasLimitValue = useCallback(v => {
    if (!WHOLE_NUMBER_REGEX.exec(v)) {
      setGasLimitValue('')
    } else {
      setGasLimitValue(v)
    }
  }, [setGasLimitValue])

  const updateDataValue = useCallback(v => {
    // copied from official elrond wallet ;)
    setGasLimitValue(minGasLimit + (gasPerDataByte * v.length))
    setDataValue(v)
  }, [ setGasLimitValue, setDataValue, minGasLimit, gasPerDataByte ])

  const useEntireBalance = useCallback(() => {
    if (balanceDec) {
      let ret = balanceDec
      if (gasCostDec) {
        ret = ret.sub(gasCostDec)
      }
      updateCryptoValue(ret.toString({ numberStyle: AssetValueNumberStyle.RAW_SCALED }) || '')
    }
  }, [balanceDec, updateCryptoValue, gasCostDec])

  // calculate total value
  useEffect(() => {
    if (transferValueDec) {
      if (minValue && transferValueDec.lt(minValue)) {
        setValueError(`Must be atleast ${minValueString}`)
      } else {
        setValueError('')
      }
    }

    if (gasCostDec) {
      setTotalGasValue(gasCostDec.toString({ numberStyle: AssetValueNumberStyle.RAW_SCALED }))

      if (rate) {
        setTotalGasCurrencyValue(gasCostDec.toCurrencyValueString(rate, { showSymbol: true }))
      } else {
        setTotalGasCurrencyValue('')
      }
    } else {
      setTotalGasValue('')
      setTotalGasCurrencyValue('')
    }

    if (gasCostDec && transferValueDec) {
      const total = transferValueDec.add(gasCostDec)

      if (balanceDec && total.gt(balanceDec)) {
        setTotalError('Insufficient balance')
      } else {
        setTotalError('')
      }

      setTotalValue(total.toString({ numberStyle: AssetValueNumberStyle.RAW_SCALED, showSymbol: true }))

      if (rate) {
        setTotalCurrencyValue(total.toCurrencyValueString(rate, { showSymbol: true }))
      } else {
        setTotalCurrencyValue('')
      }
    } else {
      setTotalValue('')
      setTotalError('')
      setTotalCurrencyValue('')
    }
  }, [balanceDec, gasCostDec, transferValueDec, rate, setTotalGasValue, setTotalGasCurrencyValue, setTotalValue, setTotalCurrencyValue, setTotalError, minValue, setValueError, minValueString])

  const toValueError = useMemo(() => toValue && !isValidAddress(toValue), [toValue])

  const allValid = useMemo(() => {
    return (!totalError) && (!valueError) && isValidAddress(toValue)
  }, 
    [totalError, valueError, toValue]
  )

  return (
    <Container className={className}>
      <Group>
        <Label>To</Label>
        <StyledTextInput value={toValue} onChange={setToValue} placeholder='erd...' error={toValueError} />
      </Group>
      {displayOptions?.excludeAmount ? null : (
        <Group>
          <Label>
            <span>
              Amount
            {balanceAsString ? (
                <BalanceValue onClick={useEntireBalance}>(Balance: {balanceAsString})</BalanceValue>
              ) : null}
            </span>            
          </Label>
          <Col>
            <CryptoLine>
              <StyledTextInput value={cryptoValue} onChange={updateCryptoValue} type='number' />
              <span>{Data.getToken(primaryToken).symbol}</span>
            </CryptoLine>
            {rate ? (
              <FiatLine>
                <StyledTextInput value={fiatValue} onChange={updateFiatValue} type='number' />
                <span>USD</span>
              </FiatLine>
            ) : null}
          </Col>
          {valueError ? <ValueError>{valueError}</ValueError> : null}
        </Group>
      )}
      {(showDataInput || dataValue) ? (
        <Group>
          <Label>Data:</Label>
          <TextArea value={dataValue} onChange={updateDataValue} />
        </Group>
      ) : (
        <Group>
          <AddDataButton icon='plus' onClick={setShowDataInput}>Add data</AddDataButton>
        </Group>
      )}
      <Group>
        <Label>Transaction fee:</Label>
        <GasCol>
          <GasPrice>
            <StyledTextInput value={gasLimitValue} onChange={updateGasLimitValue} type='number' />
            <span>Gas limit <ResetButton icon='refresh' tooltip='Reset' onClick={resetGasLimit} /></span>
          </GasPrice>
          <span>x</span>
          <GasLimit>
            <StyledTextInput value={gasPriceValue} onChange={updateGasPriceValue} type='number' />
            <span>Gas price <ResetButton icon='refresh' tooltip='Reset' onClick={resetGasPrice} /></span>
          </GasLimit>
          <span>=</span>
          <GasTotal>{totalGasValue}</GasTotal>
        </GasCol>
      </Group>
      <FinalGroup>
        <TotalCost
          totalGasValue={totalGasValue}
          totalGasCurrencyValue={totalGasCurrencyValue}
          totalValue={totalValue}
          totalCurrencyValue={totalCurrencyValue}
        />
        {totalError ? (
          <TotalError error={totalError} />
        ) : null}
        <PreviewButton onClick={onNext} disabled={!allValid}>Preview</PreviewButton>
      </FinalGroup>
    </Container>
  )
}

export default PreviewForm