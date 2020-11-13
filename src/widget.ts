require('./polyfills')
import { Address, ContractQueryParams, ContractQueryResult, Provider, NetworkConfig, SignedTransaction, Transaction, TransactionOnChain, TransactionReceipt } from 'erdor'
import { sendIpcResponse, _ } from './utils'
import { onceAppReady } from './App'
import { GetWalletAddressOptions, IPC, IpcResponse } from './types/all'
import { IpcBase } from './utils'

export const initWidget = () => {
  const Window: any = (typeof window !== 'undefined') ? window : undefined

  if (Window) {
    class IpcProvider extends IpcBase implements Provider {
      _config: NetworkConfig

      constructor (config: NetworkConfig) {
        super(Window.parent)
        this._config = config
      }

      getNetworkConfig (): Promise<NetworkConfig> {
        return Promise.resolve(this._config)
      }
      getAddress (address: string): Promise<Address> {
        return this._callIpc(IPC.CALL_PROXY_PROVIDER, { method: 'getAddress', params: [ address ] })
      }
      queryContract (params: ContractQueryParams): Promise<ContractQueryResult> {
        return this._callIpc(IPC.CALL_PROXY_PROVIDER, { method: 'queryContract', params: [params] })
      }
      sendSignedTransaction (signedTx: SignedTransaction): Promise<TransactionReceipt> {
        return this._callIpc(IPC.CALL_PROXY_PROVIDER, { method: 'sendSignedTransaction', params: [signedTx] })
      }
      getTransaction (txHash: string): Promise<TransactionOnChain> {
        return this._callIpc(IPC.CALL_PROXY_PROVIDER, { method: 'getTransaction', params: [txHash] })
      }
    }

    let ipcProvider: IpcProvider

    Window.addEventListener('message', async (e: any) => {
      const eventData = _.get(e, 'data', {})
      
      const { id, type, data } = eventData

      if (id && type) {
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
            case IPC.SIGN_AND_SEND_TRANSACTION:
              ret = await App.signAndSendTransaction(data as Transaction)
              break
            case IPC.RESPONSE:
              if (ipcProvider) {
                ipcProvider._handleIpcResponse(eventData as IpcResponse)
              }
              break
            default:
              throw new Error('Bad IPC command')
          }

          sendIpcResponse(Window.parent, { id, data: ret })
        } catch (err) {
          sendIpcResponse(Window.parent, { id, error: err.message })
        }
      }
    }, false)

    // inform parent proxy once we are ready!
    onceAppReady()
      .then(() => {
        Window.parent.postMessage({ id: 1, type: IPC.WIDGET_READY }, '*')
      })
      .catch(err => {
        console.error(err)
      })
  }
}