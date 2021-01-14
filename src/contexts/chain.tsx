import React, { useCallback, useEffect, useState } from 'react'
import { Provider, ContractQueryParams, SignedTransaction, NetworkConfig } from 'elrondjs'
import { data } from 'elrond-data'

import { _ } from '../utils'

const DEFAULT_PRIMARY_TOKEN = 'egld'

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
          const primaryToken = _.get(data.getNetwork(config.chainId), 'primaryToken', DEFAULT_PRIMARY_TOKEN)
          const provider: Provider = {
            getNetworkConfig: async () => {
              return await inputProvider!.getNetworkConfig()
            },
            getAddress: async (address: string) => {
              return await inputProvider!.getAddress(address)
            },
            getESDTData: async (address: string, token: string) => {
              return await inputProvider!.getESDTData(address, token)
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
            waitForTransaction: async (txHash: string) => {
              return await inputProvider!.waitForTransaction(txHash)
            }
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

