import { NetworkMetadata } from 'erdor'

import defaultSupportedCurrencies from './supportedCurrencies.json'
import defaultSupportedTokens from './supportedTokens.json'

interface RawTokenAsset {
  symbol: string,
  symbolFormatting?: string,
  name: string,
  rateApiName?: string,
  rateMultiplier?: number
  decimals?: number,
  img?: string,
}

type RawTokenAssetRecord = Record<string, RawTokenAsset>

export interface TokenAsset extends RawTokenAsset {
  id: string,
  decimals: number,
}

export type TokenAssetRecord = Record<string, TokenAsset>

export const DEFAULT_PRIMARY_TOKEN = 'xegld'

const NETWORKS: Record<string, NetworkMetadata> = {
  1: {
    primaryToken: 'egld',
  },
  T: {
    primaryToken: 'xegld',
  }
}

class Data {
  _supportedCurrencies: TokenAssetRecord = {}
  _supportedTokens: TokenAssetRecord = {}
  _networks: Record<string, NetworkMetadata> = NETWORKS

  constructor () {
    this._loadCurrencies(defaultSupportedCurrencies)
    this._loadTokens(defaultSupportedTokens)
  }

  _loadCurrencies (data: RawTokenAssetRecord) {
    this._supportedCurrencies = Object.entries(data).reduce((m, [key, val]) => {
      const a: TokenAsset = {
        id: key,
        ...val,
        decimals: 0,
      }

      ;(m as TokenAssetRecord)[a.id] = a

      return m
    }, {})
  }

  _loadTokens(data: RawTokenAssetRecord) {
    this._supportedTokens = Object.entries(data).reduce((m, [key, val]) => {
      const a: TokenAsset = {
        id: key,
        decimals: val.decimals!,
        ...val,
      }

        ; (m as TokenAssetRecord)[a.id] = a

      return m
    }, {})
  }

  getTokens(): TokenAssetRecord {
    return Object.assign({}, this._supportedTokens)
  }

  getToken (id: string): TokenAsset {
    return this.getTokens()[id]
  }

  getTokenOrCurrency(id: string): TokenAsset {
    return this.getToken(id) || this.getCurrency(id)
  }

  getCurrency(id: string): TokenAsset {
    return this.getCurrencies()[id]
  }

  getCurrencies(): TokenAssetRecord {
    return Object.assign({}, this._supportedCurrencies)
  }

  getPrimaryCurrency(): string {
    return 'usd'
  }

  getNetworkMetadata(chainId: string): NetworkMetadata {
    return NETWORKS[chainId]
  }
}

export default new Data()