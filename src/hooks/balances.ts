import { useMemo, useEffect, useState } from 'react'

import { doInterval } from '../utils'
import { Wallet, Balances } from '../types/all'
import { ChainContextValue } from '../contexts'

interface UseBalancesResult {
  balances: Balances,
}

export const useBalances = (wallet?: Wallet, chain?: ChainContextValue): UseBalancesResult => {
  const [balances, setBalances] = useState<Balances>({})

  const primaryToken = useMemo(() => chain?.primaryToken || null, [ chain ])

  // wallet balance timer
  useEffect(() => {
    const timer = doInterval(async () => {
      if (wallet && primaryToken && chain?.provider) {
        const address = wallet.address()
        try {
          const ret = await chain.provider!.getAddress(address)
          const { balance } = ret
          setBalances({
            [primaryToken]: {
              token: primaryToken,
              amount: balance,
            }
          })
        } catch (err) {
          console.error(`Error fetching balance: ${err.message}`)
          // TODO: notify user somehow
        }
      }
      // fetch latest balance for wallet
    }, { delayMs: 5000, executeImmediately: true })

    return () => clearInterval(timer)
  }, [wallet, chain, primaryToken])

  return { balances }
}
