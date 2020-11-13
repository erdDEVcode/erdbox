import React, { useCallback, useEffect, useState } from 'react'
import { Provider, ContractQueryParams, SignedTransaction, NetworkConfig } from 'erdor'

import { _ } from '../utils'
import Data, { DEFAULT_PRIMARY_TOKEN } from '../data'

export interface ChainContextValue {
  provider?: Provider,
  config?: NetworkConfig,
  primaryToken?: string,
}

const ChainContext = React.createContext({} as ChainContextValue)

interface Props {
  provider?: Provider,
}

export const ChainProvider: React.FunctionComponent<Props> = ({ provider: inputProvider, children }) => {
  const [ chain, setChain ] = useState<ChainContextValue>({})
  
  useEffect(() => {
    ;(async () => {
      if (inputProvider) {
        try {
          const config = await inputProvider!.getNetworkConfig()
          const primaryToken = _.get(Data.getNetworkMetadata(config.chainId), 'primaryToken', DEFAULT_PRIMARY_TOKEN)
          const provider: Provider = {
            getNetworkConfig: async () => {
              return await inputProvider!.getNetworkConfig()
            },
            getAddress: async (address: string) => {
              return await inputProvider!.getAddress(address)
            },
            queryContract: async (params: ContractQueryParams) => {
              return await inputProvider!.queryContract(params)
            },
            sendSignedTransaction: async (signedTx: SignedTransaction) => {
              return await inputProvider!.sendSignedTransaction(signedTx)
            },
            getTransaction: async (txHash: string) => {
              return await inputProvider!.getTransaction(txHash)
            },
          }

          setChain({ config, primaryToken, provider })
        } catch (err) {
          console.error(`Error setting up chain provider`, err)
        }
      }
    })()
  }, [ inputProvider ])

  return (
    <ChainContext.Provider value={chain}>
      {children}
    </ChainContext.Provider>
  )
}

export const ChainConsumer = ChainContext.Consumer

