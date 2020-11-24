import { Balance, Rate } from 'elrond-data'

export type Balances = Record<string, Balance>
export type Rates = Record<string, Rate>

export enum IPC {
  WIDGET_READY = 1,
  RESPONSE,
  PROVIDER_CHANGED,
  SHOW_WALLET_LOADER,
  GET_WALLET_ADDRESS,
  SIGN_TRANSACTION,
  SIGN_AND_SEND_TRANSACTION,
  CALL_PROXY_PROVIDER,
}

export interface IpcResponse {
  id: number,
  data?: any,
  error?: string,
}

export interface IpcRequest {
  id: number,
  type: IPC,
  data?: any,
}
