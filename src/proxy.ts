require('./polyfills')
import { Provider, SignedTransaction, Signer, Transaction } from 'elrondjs'

import { extractEventData, IpcBase, sendIpcResponse, _ } from './utils'
import { IPC, ErdBox, IpcRequest, GetWalletAddressOptions, IpcTarget } from './types/all'

const Window: any = (typeof window !== 'undefined') ? window : {}

/**
 * @internal
 */
class ErdBoxImpl extends IpcBase implements ErdBox {
  protected _iframe: HTMLIFrameElement
  protected _provider?: Provider
  protected _signer: Signer

  constructor(iframe: HTMLIFrameElement) {
    super(iframe.contentWindow!, IpcTarget.WIDGET)
    this._iframe = iframe

    this._signer = {
      signTransaction: async (tx: Transaction): Promise<SignedTransaction> => {
        return this._enableWidgetUi(() => this._callIpc(IPC.SIGN_TRANSACTION, tx))
      },
    }

    Window.addEventListener('message', (e: Event) => {
      const eventData = extractEventData(e)

      const { target, id, type } = eventData as IpcRequest

      if (id && type && target === IpcTarget.PROXY) {
        switch (type) {
          case IPC.WIDGET_READY:
            Window.dispatchEvent(new Window.Event('erdbox:ready'))
            break
          case IPC.RESPONSE:
            this._handleIpcResponse(eventData)
            break
          default:
            this._handleWidgetRequest(eventData)
        }
      }
    }, false)
  }

  async _handleWidgetRequest (req: IpcRequest) {
    const { id, data, type } = req

    try {
      switch (type) {
        case IPC.CALL_PROXY_PROVIDER:
          const { method, params } = data
          const provider = this.getProvider()
          if (!provider) {
            throw new Error('Provider not set')
          }
          const ret = await (provider as any)[method].apply(provider, params)
          sendIpcResponse(this._iframe.contentWindow!, { target: IpcTarget.WIDGET, id, data: ret })
          break
        default:
          throw new Error(`Unexpected call from widget: ${req.type}`)
      }
    } catch (err) {
      sendIpcResponse(this._iframe.contentWindow!, { target: IpcTarget.WIDGET, id, error: err.message })
    }
  }

  async _enableWidgetUi (cb: Function): Promise<any> {
    try {
      this._iframe.style.display = 'block'
      const ret = await cb()
      this._iframe.style.display = 'none'
      return ret
    } catch (err) {
      this._iframe.style.display = 'none'
      throw err
    }
  }

  _loadAddressFromCache (): string | null {
    return window.localStorage.getItem('erdbox_wallet_address')    
  }

  _saveAddressToCache (address: string | null) {
    if (!address) {
      window.localStorage.removeItem('erdbox_wallet_address')
    } else {
      window.localStorage.setItem('erdbox_wallet_address', address)    
    }
  }

  async setProvider (provider: Provider) {
    this._provider = provider
    const networkConfig = await provider.getNetworkConfig()
    await this._callIpc(IPC.PROVIDER_CHANGED, networkConfig)
  }

  getProvider (): Provider | undefined {
    return this._provider
  }

  getSigner (): Signer {
    return this._signer
  }

  async getWalletAddress(options?: GetWalletAddressOptions): Promise<string> {
    return await this._enableWidgetUi(() => this._callIpc(IPC.GET_WALLET_ADDRESS, options))
  }

  async closeWallet(): Promise<void> {
    await this._callIpc(IPC.CLOSE_WALLET)
  }
}


export const initProxy = () => {
  if (Window) {
    const scriptTag = Window.document.getElementById('erdboxScript')
    if (!scriptTag) {
      return
    }
    const scriptSrc = scriptTag.getAttribute('src')

    const iframeSrc =
      `<body id='erdboxWidget'><script type='text/javascript' src='${scriptSrc}'></script></body>`

    const iframe = Window.document.createElement('iframe');
    iframe.style.position = 'absolute'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.style.width = '100vw'
    iframe.style.height = '100vh'
    iframe.style.zIndex = '2147483647'
    iframe.style.display = 'none'
    Window.document.body.appendChild(iframe)

    Window.erdbox = new ErdBoxImpl(iframe)

    // kick-off!
    const iframeWindow = iframe.contentWindow
    iframeWindow?.document.open()
    iframeWindow?.document.write(iframeSrc)
    iframeWindow?.document.close()
  }
}