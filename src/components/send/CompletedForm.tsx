import React from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import ValueBox from '../ValueBox'
import Button from '../Button'
import { ViewInExplorerContext, ViewTransactionInExplorer } from '../ViewInExplorer'
import { DisplayOptions } from './interfaces'


const Container = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'center' })};
`

const TxId = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  width: 80%;
  margin: 2rem;

  button {
    margin-top: 1rem;
  }
`

const NewButton = styled(Button)`
  margin-top: 3rem;
  font-size: 0.6rem;
`

interface Props {
  className?: string,
  displayOptions?: DisplayOptions,
  onReset: () => void,
  props: any,
}

const CompletedForm: React.FunctionComponent<Props> = ({
  className,
  onReset,
  props: {
    txId,
  },
}) => {
  return (
    <Container className={className}>
      <h2>Your transaction is in progress.</h2>
      <TxId>
        <ValueBox>{txId}</ValueBox>
        <ViewTransactionInExplorer id={txId}>
          {({ onClick }: ViewInExplorerContext) => (
            <Button icon='open-external' onClick={onClick}>
              View in explorer
            </Button>
          )}
        </ViewTransactionInExplorer>
      </TxId>
      <NewButton onClick={onReset}>
        Send another transaction
      </NewButton>
    </Container>
  )
}

export default CompletedForm
