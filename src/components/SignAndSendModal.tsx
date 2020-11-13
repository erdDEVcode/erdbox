import React, { Component } from 'react'
import { Transaction, TransactionReceipt } from 'erdor'

import { _ } from '../utils'
import Modal from './Modal'
import { DisplayOptions } from './send/interfaces'
import Send from './send/Send'
import { ChainConsumer, GlobalConsumer, WalletProvider } from '../contexts'

interface Props {
}

interface SendModalState {
  onRequestClose: () => {},
  onComplete: (receipt: TransactionReceipt) => {},
  initialValues: object,
}

interface State {
  showSendModal?: SendModalState,
}

export interface SignAndSendModalInterface {
  signAndSend: (tx: Transaction) => Promise<any>
}

export default class SignAndSendModal extends Component<Props> implements SignAndSendModalInterface {
  state: State = {}

  /* render */

  render () {
    const isActive = !!this.state.showSendModal
    const { onRequestClose, ...otherProps } = this.state.showSendModal || {}

    return (
      <GlobalConsumer>
        {globalCtx => (
          <ChainConsumer>
            {chainCtx => (
              <WalletProvider activeWallet={globalCtx.activeWallet} chain={chainCtx}>
                <Modal
                  isOpen={isActive}
                  width='700px'
                  height='640px'
                  onRequestClose={onRequestClose}
                >
                  <Send isActive={isActive} {...otherProps} />
                </Modal>
              </WalletProvider>
            )}
          </ChainConsumer>
        )}
      </GlobalConsumer>
    )
  }

  async signAndSend(tx: Transaction) {
    return new Promise((resolve, reject) => {
      let receipt: any = undefined

      this.setState({
        showSendModal: {
          onRequestClose: () => {
            this.setState({ showSendModal: null })
            if (receipt) {
              resolve(receipt)
            } else {
              reject(new Error('User cancelled the process'))
            }
          },
          onComplete: (_receipt: TransactionReceipt) => {
            receipt = _receipt
            resolve(receipt)
          },
          initialValues: {
            toValue: tx.receiver,
            dataValue: tx.data,
            cryptoValue: tx.value,
            gasLimitValue: tx.gasLimit,
            gasPriceValue: tx.gasPrice,
          },
          displayOptions: (_.get(tx, 'meta.displayOptions') as DisplayOptions),
        }
      })
    })
    .finally(() => {
      this.setState({ showSendModal: null })
    })
  }
}