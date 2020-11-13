import TransportWebUsb from '@ledgerhq/hw-transport-webusb'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import ElrondLedgerApp from '@elrondnetwork/hw-app-elrond'

const webUsbSupported = !!TransportWebUsb.isSupported()
const u2fSupported = !!TransportWebUsb.isSupported()

export const canConnectToLedger = () => {
  return webUsbSupported || u2fSupported
}

export const withLedger = async (fn: Function) => {
  try {
    console.log('Creating Ledger transport ...')

    const ledgerTransport = await new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Cannot write to Ledger transport'))
      }, 2000)

      let t: any

      try {
        if (webUsbSupported) {
          console.log('Creating Ledger WebUSB transport ...')
          t = await TransportWebUsb.create()
        } else if (u2fSupported) {
          console.log('Creating Ledger U2F transport ...')
          t = await TransportU2F.create()
        } else {
          throw new Error('No transport supported')
        }
      } catch (err) {
        console.warn(`Transport failed: ${err.message}`)
        reject(err)
      } finally {
        if (t) {
          clearTimeout(timer)
          resolve(t)
        }
      }
    })

    console.log('Using Elrond Ledger app ...')

    return await fn(new ElrondLedgerApp(ledgerTransport))
  } catch (err) {
    console.warn(err)
    console.warn(err.message, typeof err.message)

    // const msg = err.message.toLowerCase()

    // const notOpenError =
    //   msg.includes('cannot write')
    //   || msg.includes('cannot open')
    //   || msg.includes('is busy')
    //   || msg.includes('0x6e')

    // if (notOpenError) {
    //   throw new Error('Please ensure that your Ledger is connected and that the Elrond app is open')
    // } else if (msg.includes('0x6985')) {
    //   throw new Error('The transaction was rejected on the Ledger')
    // } else {
      throw err
    // }
  }
}
