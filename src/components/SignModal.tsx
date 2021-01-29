import React, { Component } from 'react'
import { LedgerWallet, SignedTransaction, Transaction, Wallet } from 'elrondjs'

import { _ } from '../utils'
import Modal from './Modal'
import { DisplayOptions } from './sign/interfaces'
import Sign from './sign/Sign'
import { GlobalConsumer } from '../contexts'

interface Props {
}

interface SignModalState {
  onRequestClose: (activeWallet?: Wallet) => {},
  onComplete: (signedTx: SignedTransaction) => {},
  initialValues: object,
}

interface State {
  showModal?: SignModalState,
}

export interface SignModalInterface {
  sign: (tx: Transaction) => Promise<any>
}

export default class SignModal extends Component<Props> implements SignModalInterface {
  state: State = {}

  /* render */

  render () {
    const isActive = !!this.state.showModal
    const { onRequestClose, ...otherProps } = this.state.showModal || {}

    return (
      <GlobalConsumer>
        {globalCtx => (
          <Modal
            isOpen={isActive}
            onRequestClose={() => onRequestClose ? onRequestClose(globalCtx.activeWallet!) : null}
          >
            <Sign isActive={isActive} {...otherProps} />
          </Modal>
        )}
      </GlobalConsumer>
    )
  }

  async sign(tx: Transaction) {
    return new Promise((resolve, reject) => {
      this.setState({
        showModal: {
          onRequestClose: (activeWallet?: Wallet) => {
            if (activeWallet && activeWallet instanceof LedgerWallet) {
              // if there are pending Legder actions then user must accept/reject before we hide modal
              // otherwise the Legder transport will will remain open, preventing the user from using
              // the Ledger in another app/tab.
              if ((activeWallet as LedgerWallet).hasPendingActions()) {
                return
              }
            }

            this.setState({ showModal: null })
            reject(new Error('User cancelled the process'))
          },
          onComplete: (signedTx: SignedTransaction) => {
            this.setState({ showModal: null })
            resolve(signedTx)
          },
          initialValues: {
            toValue: tx.receiver,
            dataValue: tx.data,
            cryptoValue: tx.value.toMinScale().toString(),
            gasLimitValue: tx.gasLimit,
            gasPriceValue: tx.gasPrice,
          },
          displayOptions: (_.get(tx, 'meta.displayOptions') as DisplayOptions),
        }
      })
    })
  }
}