import { Provider, Signer } from 'elrondjs'

/**
 * Options for getting wallet address.
 */
export interface GetWalletAddressOptions {
  /**
   * If `true` then user must load a valid wallet if not already done so.
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
   */
  getWalletAddress: (options?: GetWalletAddressOptions) => Promise<string>,
}

