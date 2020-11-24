import React, { Component } from 'react'
import { PromiseResolver } from 'elrond-data'

import { _ } from '../utils'
import Modal from './Modal'
import AddWallet from './addWallet/AddWallet'

interface Props {
}

interface AddWalletModalState {
  onRequestClose?: () => void,
  onComplete: () => void,
  promise: PromiseResolver
}

interface State {
  showAddWalletModal?: AddWalletModalState,
}

export interface AddWalletModalInterface {
  show: () => Promise<any>
}

export default class AddWalletModal extends Component<Props> implements AddWalletModalInterface {
  state: State = {}

  /* render */

  render () {
    const isActive = !!this.state.showAddWalletModal
    const { onRequestClose, onComplete } = this.state.showAddWalletModal || {}

    return (
      <Modal 
        isOpen={isActive} 
        width='640px' 
        height='640px' 
        onRequestClose={onRequestClose}
      >
        <AddWallet onComplete={onComplete} />
      </Modal>
    )
  }

  _onCloseAddWalletModal = () => {
    const promise = _.get(this.state.showAddWalletModal, 'promise')
    if (promise) {
      promise.reject(new Error('User denied access'))
    }
  }

  _onWalletLoaded = () => {
    const promise = _.get(this.state.showAddWalletModal, 'promise')
    if (promise) {
      // wait for event loop to finish and global context to be updated
      setTimeout(() => promise.resolve(), 0)
    }
  }

  show = async (cancelDisallowed?: boolean) => {
    return new Promise((resolve, reject) => {
      this.setState({
        showAddWalletModal: {
          cancelDisallowed,
          onComplete: this._onWalletLoaded,
          onRequestClose: cancelDisallowed ? undefined : this._onCloseAddWalletModal,
          promise: { resolve, reject },
        },
      })
    }).finally(() => {
      this.setState({ showAddWalletModal: undefined })
    })
  }
}