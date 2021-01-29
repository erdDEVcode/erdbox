import { PromiseResolver } from 'elrond-data'
import { BigVal, isBigVal } from 'elrondjs'
import { IPC, IpcRequest, IpcResponse, IpcTarget } from "../types/all"
import { _ } from './lodash'


const serializeData = (data: any): string => {
  if (!data) {
    return data
  }

  if (typeof data !== 'object') {
    return JSON.stringify(data)
  }

  const san = Object.keys(data).reduce((m, k) => {
    if (isBigVal(data[k])) {
      m[k] = `BigVal:${data[k].toMinScale().toString()}`
    } else {
      m[k] = data[k]
    }
    return m
  }, {} as Record<string, any>)

  return JSON.stringify(san)
}

const unserializeData = (data: string): any => {
  if (!data) {
    return data
  }

  const parsed = JSON.parse(data)

  if (typeof parsed !== 'object') {
    return parsed
  }

  const ret = Object.keys(parsed).reduce((m, k: string) => {
    if (typeof parsed[k] === 'string' && parsed[k].startsWith('BigVal:')) {
      m[k] = new BigVal(parsed[k].substr(7))
    } else {
      m[k] = parsed[k]
    }
    return m
  }, {} as Record<string, any>)

  return ret
}

export const extractEventData = (e: any): any => {
  const eventData = _.get(e, 'data', {})

  // if it's one of our requests (and not system-generated)
  if (eventData && eventData.id && eventData.type && eventData.data) {
    eventData.data = unserializeData(eventData.data)
  }

  return eventData
}


export const sendIpcResponse = (w: Window, res: IpcResponse) => {
  w.postMessage({ target: res.target, id: res.id, type: IPC.RESPONSE, data: serializeData(res.data), error: res.error }, '*')
}

export class IpcBase {
  protected _currentExecutionId: number = 1 // >0 so that we can do boolean checks
  protected _pendingExecutions: Record<number, PromiseResolver> = {}
  protected _ipcTargetWindow: Window
  protected _ipcTarget: IpcTarget

  constructor (ipcTargetWindow: Window, ipcTarget: IpcTarget) {
    this._ipcTargetWindow = ipcTargetWindow
    this._ipcTarget = ipcTarget
  }

  async _callIpc (type: IPC, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this._currentExecutionId++

      this._pendingExecutions[id] = { resolve, reject }

      const req: IpcRequest = {
        target: this._ipcTarget,
        id,
        type,
        data: serializeData(data),
      }

      this._ipcTargetWindow.postMessage(req, '*')
    })
  }

  _handleIpcResponse(response: IpcResponse) {
    const { id, data, error } = response

    if (this._pendingExecutions[id]) {
      if (error) {
        this._pendingExecutions[id].reject(new Error(error))
      } else if (data) {
        this._pendingExecutions[id].resolve(data)
      } 
      
      delete this._pendingExecutions[id]
    }
  }
}