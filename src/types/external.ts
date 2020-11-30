import { Provider, Signer } from 'elrondjs'

/**
 * Options for getting wallet address.
 */
export interface GetWalletAddressOptions {
  /**
   * If `true` then the user must create/load a valid wallet in order to close the wallet-loading modal.
   * 
   * If not set or `false` then the user can close the wallet-loading modal and cancel the process without creating/loading a wallet.
   */
  mustLoadWallet?: boolean
}

export interface ErdBox {
  /**
   * Set the provider for the widget.
   */
  setProvider: (provider: Provider) => Promise<void>,
  /**
   * Get the current provider used by the widget.
   */
  getProvider: () => Provider | undefined,
  /**
   * Get a signer which can be used to sign transactions.
   */
  getSigner: () => Signer,
  /**
   * Get the current wallet address.
   * 
   * If no wallet is currently loaded then the `options.mustLoadWallet` option can be set to force them to create/load one.
   */
  getWalletAddress: (options?: GetWalletAddressOptions) => Promise<string>,
}

