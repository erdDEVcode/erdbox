import React from 'react'
import { Provider, Transaction } from 'elrondjs'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'emotion-theming'
import { loadFonts, setFonts } from 'emotion-styled-utils'

import { _ } from './utils'
import { setupThemes } from './themes'
import { GlobalProvider, ChainProvider } from './contexts'
import GlobalStyles from './components/GlobalStyles'
import ReactModal from 'react-modal'
import SignModal from './components/SignModal'
import AddWalletModal from './components/AddWalletModal'
import { GetWalletAddressOptions } from './types/all'

const themes = setupThemes({
  width: {
    desktop: '700px',
  },
  height: {
    tall: '800px',
  }  
})

loadFonts({
  body: {
    name: 'Open Sans',
    weights: {
      light: 100,
      regular: 400,
      semiBold: 600,
      bold: 700,
    },
    style: {
      normal: '',
      italic: 'italic',
    }
  },
  header: {
    name: 'Raleway',
    weights: {
      light: 100,
      regular: 400,
      bold: 700,
    },
    style: {
      normal: '',
    }
  },
}, window.document)

setFonts({
  data: {
    name: 'Courier',
    weights: {
      light: 100,
      regular: 400,
      bold: 700,
    },
    style: {
      normal: '',
    }
  }
})


interface AppState {
  provider?: Provider,
}

class App extends React.Component {
  globalProvider: any
  signer: any
  walletAdder: any
  state: AppState = {}

  render () {
    const { provider } = this.state
    
    return (      
      <GlobalProvider ref={this._onGlobalProviderRef}>
        <ChainProvider provider={provider}>
          <ThemeProvider theme={themes.get('light')}>
            <GlobalStyles />
            <AddWalletModal ref={this._onWalletAdderRef} />
            <SignModal ref={this._onSignerRef} />
          </ThemeProvider>
        </ChainProvider>
      </GlobalProvider>
    )
  }

  _onGlobalProviderRef = (e: any) => {
    this.globalProvider = e
  }

  _onSignerRef = (e: any) => {
    this.signer = e
  }

  _onWalletAdderRef = (e: any) => {
    this.walletAdder = e
  }

  getWalletAddress = async (options?: GetWalletAddressOptions) => {
    const wallet = this.globalProvider.getActiveWallet()

    if (wallet) {
      return wallet.address()
    } else {
      return new Promise(async (resolve, reject) => {
        try {
          await this.walletAdder.show(options?.mustLoadWallet)
          resolve(this.globalProvider.getActiveWallet().address())
        } catch (err) {
          reject(err)
        }
      })
    }
  }

  closeWallet = async () => {
    this.globalProvider.closeActiveWallet()
  }

  signTransaction = async (tx: Transaction) => {
    // load wallet first if not already done so!
    const address = await this.getWalletAddress()

    if (!address) {
      throw new Error('Wallet not loaded')
    }

    if (this.signer) {
      return this.signer.sign(tx)
    }
  }

  getProvider = () => {
    return this.state.provider
  }

  setProvider = (provider: Provider) => {
    this.setState({ provider })
  }
}

let appPromise: Promise<App>

export const onceAppReady = (): Promise<App> => {
  if (!appPromise) {
    appPromise = new Promise<App>(async (resolve, reject) => {
      try {
        // create div
        const div = document.createElement('div')
        document.body.appendChild(div)
        ReactModal.setAppElement(div)
        // create ref
        const ref = React.createRef()
        // render
        ReactDOM.render(
          <React.StrictMode>
            <App ref={e => resolve(e as App)} />
          </React.StrictMode>,
          div
        )
      } catch (err) {
        reject(err)
      }
    })  
  }
  
  return appPromise
}