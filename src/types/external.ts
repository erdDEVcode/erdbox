/*
 * This file contains useful type declarations for NPM package consumers
 */

import { Provider, Signer } from 'elrondjs'

export interface GetWalletAddressOptions {
  mustLoadWallet?: boolean
}

export interface ErdBox {
  setProvider: (provider: Provider) => Promise<void>,
  getProvider: () => Provider | undefined,
  getSigner: () => Signer,
  getWalletAddress: (options?: GetWalletAddressOptions) => Promise<string>,
}

