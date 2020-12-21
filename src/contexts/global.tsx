import React from 'react'
import { Wallet } from 'elrondjs'

const getWalletIndex = (wallets: Wallet[], w: Wallet) => wallets.findIndex((a: Wallet) => a.address() === w.address())

export interface GlobalContextValue {
  wallets: Wallet[],
  activeWallet?: Wallet,
  setActiveWallet: (w: Wallet) => void,
  addWallet: (w: Wallet) => void,
  removeWallet: (w: Wallet) => void,
}

const GlobalContext = React.createContext({} as GlobalContextValue)

interface GlobalProviderState {
  wallets: Wallet[],
  activeWallet?: Wallet,
}

const initialWallets: Wallet[] = []

export class GlobalProvider extends React.Component {
  state: GlobalProviderState = {
    wallets: initialWallets,
    activeWallet: initialWallets[0],
  }

  render () {
    return (
      <GlobalContext.Provider value={{
        wallets: this.state.wallets,
        activeWallet: this.state.activeWallet,
        setActiveWallet: this._setActiveWallet,
        addWallet: this._addWallet,
        removeWallet: this._removeWallet,
      }}>
        {this.props.children}
      </GlobalContext.Provider>
    )
  }

  getActiveWallet = () => {
    return this.state.activeWallet
  }

  closeActiveWallet = () => {
    if (this.state.activeWallet) {
      this._removeWallet(this.state.activeWallet)
    }
  }

  _setActiveWallet = (w: Wallet) => {
    this.setState({
      activeWallet: w,
    })
  }

  _addWallet = (w: Wallet) => {
    const pos = getWalletIndex(this.state.wallets, w)

    if (0 > pos) {
      this.setState({
        wallets: this.state.wallets.concat(w),
        activeWallet: w,
      })
    }
  }

  _removeWallet = (w: Wallet) => {
    const pos = getWalletIndex(this.state.wallets, w)

    if (0 <= pos) {
      this.state.wallets.splice(pos, 1)
      const newActivePos = (0 < pos ? pos - 1 : this.state.wallets.length - 1)

      this.setState({
        wallets: this.state.wallets.concat([]),
        activeWallet: this.state.wallets[newActivePos]
      })
    }
  }
}

export const GlobalConsumer = GlobalContext.Consumer
