import { Balance, Rate } from 'elrond-data'

export type Balances = Record<string, Balance>
export type Rates = Record<string, Rate>

export enum IPC {
  WIDGET_READY = 1,
  RESPONSE,
  PROVIDER_CHANGED,
  SHOW_WALLET_LOADER,
  GET_WALLET_ADDRESS,
  CLOSE_WALLET,
  SIGN_TRANSACTION,
  CALL_PROXY_PROVIDER,
}

export enum IpcTarget {
  PROXY = 1,
  WIDGET,
}

export interface IpcResponse {
  target: IpcTarget,
  id: number,
  data?: any,
  error?: string,
}

export interface IpcRequest {
  target: IpcTarget,
  id: number,
  type: IPC,
  data?: any,
}
