/*
 * This file contains useful type declarations for NPM package consumers
 */

import { Provider, Signer, Transaction, TransactionReceipt, WalletChangeCallbackHandler } from 'erdor'

export interface GetWalletAddressOptions {
  mustLoadWallet?: boolean
}

export interface ErdConnect {
  setProvider: (provider: Provider) => Promise<void>,
  getProvider: () => Provider | undefined,
  getSigner: () => Signer,
  getWalletAddress: (options?: GetWalletAddressOptions) => Promise<string>,
  addWalletChangeListener: (cb: WalletChangeCallbackHandler) => void,
  removeWalletChangeListener: (cb: WalletChangeCallbackHandler) => void,
}

