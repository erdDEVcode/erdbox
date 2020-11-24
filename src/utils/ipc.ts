import { PromiseResolver } from 'elrond-data'
import { IPC, IpcRequest, IpcResponse, IpcTarget } from "../types/all"

export const sendIpcResponse = (w: Window, res: IpcResponse) => {
  w.postMessage({ target: res.target, id: res.id, type: IPC.RESPONSE, data: res.data, error: res.error }, '*')
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
        data,
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