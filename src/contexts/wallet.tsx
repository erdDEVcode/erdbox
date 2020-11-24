import React from 'react'
import { Wallet } from 'elrondjs'
import { Balances, Rates } from '../types/all'

import { useBalances, useRates } from '../hooks'
import { ChainContextValue } from './chain'

export interface WalletContextValue {
  wallet?: Wallet,
  balances: Balances,
  rates: Rates,
}

const WalletContext = React.createContext({} as WalletContextValue)

interface Props {
  activeWallet?: Wallet,
  chain?: ChainContextValue,
}

export const WalletProvider: React.FunctionComponent<Props> = ({ children, activeWallet, chain }) => {
  const { balances } = useBalances(activeWallet, chain)
  const { rates } = useRates()

  return (
    <WalletContext.Provider value={{
      wallet: activeWallet,
      balances,
      rates,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const WalletConsumer = WalletContext.Consumer

