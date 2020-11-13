import Elrond from '@elrondnetwork/elrond-core-js'
import { Provider, Transaction, SignedTransaction, TransactionReceipt } from 'erdor'

import { _ } from '../utils'
import { Wallet } from '../types/all'
import { canConnectToLedger, withLedger } from './ledger'

const bip39 = require('bip39')

const validateAccount = (a: any) => {
  a.sign(new TextEncoder().encode('test message'))
}

export const generateMnemonic = (): string[] => {
  return new Elrond.account().generateMnemonic().split(' ')
}

export const deriveWalletFromMnemonic = (mnemonic: string): Wallet | null => {
  mnemonic = mnemonic.trim()

  if (!bip39.validateMnemonic(mnemonic)) {
    return null
  }

  try {
    let account = new Elrond.account()
    account.loadFromMnemonic(mnemonic)
    validateAccount(account)
    return account
  } catch (err) {
    console.warn(`Error deriving from mnemonic: ${err.message}`)
    return null
  }
}


export const deriveWalletFromJsonKeyFileString = (json: string, password: string): Wallet | null => {
  json = json.trim()

  try {
    let account = new Elrond.account()
    account.loadFromKeyFile(JSON.parse(json), password)
    validateAccount(account)
    return account
  } catch (err) {
    console.warn(`Error deriving from JSON: ${err.message}`)
  }

  return null
}

const PEM_REGEX = /-----BEGIN[^-]+-----([^-]+)-----END[^-]+/igm


export const deriveWalletFromPemFileString = (pem: string): Wallet | null => {
  try {
    const match = _.get(PEM_REGEX.exec(pem.trim()), '1', '').trim()
    if (match) {
      const bytes = Buffer.from(window.atob(match), 'hex')
      let account = new Elrond.account()
      account.loadFromPrivateKey(bytes)
      validateAccount(account)
      return account
    }
  } catch (err) {
    console.warn(`Error deriving from PEM: ${err.message}`)
  }

  return null
}


export const signTx = async (wallet: Wallet, provider: Provider, tx: Transaction): Promise<SignedTransaction> => {
  const { nonce } = await provider.getAddress(wallet.address())
  const { chainId } = await provider.getNetworkConfig()

  const t = new Elrond.transaction(
    nonce,
    wallet.address(),
    tx.receiver,
    tx.value,
    parseInt(`${tx.gasPrice!}`, 10),
    parseInt(`${tx.gasLimit!}`, 10),
    tx.data,
    chainId,
    1
  )

  const s = t.prepareForSigning()
  t.signature = await wallet.sign(s)

  const st = t.prepareForNode()
  return st
}


export const isLedgerSupported = async () => {
  return canConnectToLedger()
}


export const getLedgerWallet = async () => {
  return await withLedger(async (erdLedgerInstance: any) => {
    const { address } = await erdLedgerInstance.getAddress()
    console.log(`Ledger address: ${address}`)
    return new LedgerWallet(address)
  })
}

class LedgerWallet implements Wallet {
  _address: string

  constructor(address: string) {
    this._address = address
    const a = new Elrond.account()
  }

  get isLedger() {
    return true
  }

  address() {
    return this._address
  }

  async sign(rawTx: Buffer) {
    return await withLedger(async (erdLedgerInstance: any) => {
      const signedTx: string = await erdLedgerInstance.signTransaction(rawTx)
      return signedTx
    })
  }
}


