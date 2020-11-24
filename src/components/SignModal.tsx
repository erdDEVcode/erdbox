import React, { Component } from 'react'
import { SignedTransaction, Transaction } from 'elrondjs'

import { _ } from '../utils'
import Modal from './Modal'
import { DisplayOptions } from './sign/interfaces'
import Sign from './sign/Sign'

interface Props {
}

interface SignModalState {
  onRequestClose: () => {},
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
      <Modal
        isOpen={isActive}
        width='700px'
        height='640px'
        onRequestClose={onRequestClose}
      >
        <Sign isActive={isActive} {...otherProps} />
      </Modal>
    )
  }

  async sign(tx: Transaction) {
    return new Promise((resolve, reject) => {
      this.setState({
        showModal: {
          onRequestClose: () => {
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
            cryptoValue: tx.value,
            gasLimitValue: tx.gasLimit,
            gasPriceValue: tx.gasPrice,
          },
          displayOptions: (_.get(tx, 'meta.displayOptions') as DisplayOptions),
        }
      })
    })
  }
}