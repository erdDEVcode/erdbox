require('./polyfills')
import { Address, ContractQueryParams, ContractQueryResult, Provider, NetworkConfig, SignedTransaction, Transaction, TransactionOnChain, TransactionReceipt, TransactionTracker } from 'elrondjs'
import { sendIpcResponse, _ } from './utils'
import { onceAppReady } from './App'
import { GetWalletAddressOptions, IPC, IpcRequest, IpcResponse, IpcTarget } from './types/all'
import { IpcBase } from './utils'

export const initWidget = () => {
  const Window: any = (typeof window !== 'undefined') ? window : undefined

  if (Window) {
    class IpcProvider extends IpcBase implements Provider {
      _config: NetworkConfig

      constructor (config: NetworkConfig) {
        super(Window.parent, IpcTarget.PROXY)
        this._config = config
      }

      getNetworkConfig (): Promise<NetworkConfig> {
        return Promise.resolve(this._config)
      }
      getAddress (address: string): Promise<Address> {
        return this._callIpc(IPC.CALL_PROXY_PROVIDER, { method: 'getAddress', params: [ address ] })
      }
      queryContract (params: ContractQueryParams): Promise<ContractQueryResult> {
        throw new Error('Security check - method not allowed from within widget: queryContract')
      }
      sendSignedTransaction (signedTx: SignedTransaction): Promise<TransactionReceipt> {
        throw new Error('Security check - method not allowed from within widget: sendSignedTransaction')
      }
      getTransaction (txHash: string): Promise<TransactionOnChain> {
        throw new Error('Security check - method not allowed from within widget: getTransaction')
      }
      waitForTransaction (txHash: string): Promise<void> {
        throw new Error('Security check - method not allowed from within widget: waitForTransaction')
      }
    }

    let ipcProvider: IpcProvider

    Window.addEventListener('message', async (e: any) => {
      const eventData = _.get(e, 'data', {})
      
      const { target, id, type, data } = eventData as IpcRequest

      if (id && type && target === IpcTarget.WIDGET) {
        const App = await onceAppReady()

        let ret

        try {
          switch (type as IPC) {
            case IPC.PROVIDER_CHANGED:
              const networkConfig: NetworkConfig = data
              ipcProvider = new IpcProvider(networkConfig)
              App.setProvider(ipcProvider)
              break
            case IPC.GET_WALLET_ADDRESS:
              ret = await App.getWalletAddress(data as GetWalletAddressOptions)
              break
            case IPC.SIGN_TRANSACTION:
              ret = await App.signTransaction(data as Transaction)
              break
            case IPC.RESPONSE:
              if (ipcProvider) {
                ipcProvider._handleIpcResponse(eventData as IpcResponse)
              }
              return // so that we don't send an unnecessary response back to the proxy
            default:
              throw new Error('Bad IPC command')
          }

          if (ret) {
            sendIpcResponse(Window.parent, { target: IpcTarget.PROXY, id, data: ret })
          }
        } catch (err) {
          sendIpcResponse(Window.parent, { target: IpcTarget.PROXY, id, error: err.message })
        }
      }
    }, false)

    // inform parent proxy once we are ready!
    onceAppReady()
      .then(() => {
        Window.parent.postMessage({ target: IpcTarget.PROXY, id: 1, type: IPC.WIDGET_READY }, '*')
      })
      .catch(err => {
        console.error(err)
      })
  }
}