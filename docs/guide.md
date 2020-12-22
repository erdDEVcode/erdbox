## Introduction

**erdbox** is a drop-in widget that enables Dapps to create and load [Elrond](https://elrond.com) wallets and use them to sign transactions. Some of its features:

* Supports all wallet types: Mnemonic/seedphrase, JSON keyfile, PEM file, Ledger hardware
* Full transaction signing (including smart contract interactions)
* Easy and simple API
* Works with any frontend framework and/or vanilla JS
* Typescript definitions.

**Please note, erdbox is designed to work hand-in-hand with the [elrondjs](https://elrondjs.erd.dev) SDK. Alternative Javascript SDKs for Elrond are not currently supported.**

## Getting started

Add a `script` tag to asynchronously load the erdbox library:

```html
<script type="text/javascript">
  const g = window.document.createElement('script');
  g.id = 'erdboxScript';
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = 'https://cdn.jsdelivr.net/npm/erdbox@1.8.0/dist/erdbox.js';
  window.document.body.appendChild(g);
</script>
```

_Note: replace `1.8.0` in the above code with the latest version of erdbox. This can always be found by visiting the erdbox package page at [https://www.npmjs.com/package/erdbox](https://www.npmjs.com/package/erdbox)_

In your Javascript code enter the following code to enable [claiming rewards](https://elrond.com/blog/egold-delegation-waiting-list-guide/) from the Mainnet delegation contract:

```js
import { Contract, ProxyProvider, BasicWallet } from 'elrondjs'

window.addEventListener('erdbox:ready', async () => {
  // create network connection
  const provider = new ProxyProvider('https://gateway.elrond.com')
  window.erdbox.setProvider(provider)

  // load wallet
  const address = await window.erdbox.getWalletAddress()

  if (address) {
    // create interface to delegation contract
    const c = await Contract.at('erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt', {
      provider,
      signer: window.erdbox.getSigner(),
      sender: address,
    })

    // make the claim
    const txReceipt = await c.invoke('claimRewards', [], { gasLimit: 250000000 })

    // wait for transaction to complete
    await provider.waitForTransaction(txReceipt.hash)
  }
})
```

## How it works

When you add the initial `script` tag to your page to load the `erdbox.js` library here is what happens:

1. The library detects that it's running in the parent page, so it creates an `iframe` in the parent page and loads the `erdbox` library code (i.e. itself) within the `iframe`.
1. _The parent page library instance is now known as the **proxy**._
1. The library instance loaded within the newly created `iframe` and detects that it is running within the `iframe`, so it initializes the widget UI.
1. _The `iframe` library instance is now known as the **widget**._
1. The **widget** sends a [message](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to the **proxy** once it has initialized fully.
1. The **proxy** emits the `erdbox:ready` event on the `window` object so that the parent page can detect and respond to this. The **proxy** also creates the `window.erdbox` object.
1. The parent page can now call available methods on `window.erdbox` and the **proxy** will translate and forward these calls onto the **widget**.

## Supported wallets

erdbox supports loading the following wallets:

* Mnemonic/seedphrase
* PEM and JSON keyfiles
* Ledger hardware wallet - _some older browsers may not be able to support using a Ledger wallet_

A user can also create a new menmonic-based wallet on-the-fly with erdbox. 

## window.erdbox

Once the library is loaded the `erdbox:ready` event will be emitted. Furthermore, the `window.erdbox` object will be available - this is the sole interface through which interaction with erdbox is possible. This object is an instance of `ErdBox` (see [API docs](/docs/api)) and provides the following methods:

* `setProvider` - set an [elrondjs](https://elrondjs.erd.dev) `Provider` instance to use for accessing chain information. The signing mechanism uses this to lookup the latest account nonce, etc. This method **must** be called prior to any transaction signing since the widget needs to be able to query the Elrond network in order to sign transaction.
* `getProvider` - get the elrondjs `Provider` instance that is currently set.
* `getSigner` - get an elrondjs `Signer` instance to use for signing transactions. Using this instance to sign a transaction will automatically invoke the erdbox signing interface to show.
* `getWalletAddress` - get the user's wallet address. If no wallet is set then the user will be prompted with an interface to create/load a wallet.
* `closeWallet` - close the currently loaded wallet, to allow the user to load a different wallet via `getWalletAddress()`.

Let's reconsider the code example from earlier for claiming rewards from the Mainnet delegation contract:

```js
import { Contract, ProxyProvider, BasicWallet } from 'elrondjs'

window.addEventListener('erdbox:ready', async () => {
  // create network connection
  const provider = new ProxyProvider('https://gateway.elrond.com')
  window.erdbox.setProvider(provider)

  // load wallet
  const address = await window.erdbox.getWalletAddress()

  if (address) {
    // create interface to delegation contract
    const c = await Contract.at('erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt', {
      provider,
      signer: window.erdbox.getSigner(),
      sender: address,
    })

    // make the claim
    const txReceipt = await c.invoke('claimRewards', [], { gasLimit: 250000000 })

    // wait for transaction to complete
    await provider.waitForTransaction(txReceipt.hash)
  }
})
```

The `invoke()` call above will create and sign a transaction to send to the network. The signing part will trigger the erdbox signing modal to show, which looks something like this:

![Signing](https://raw.githubusercontent.com/erdDEVcode/erdbox/master/docs/signTransaction.png "Signing a transaction")

If the user closes this modal without completing the process then the transaction is autoamtically cancelled and the `invoke()` call will throw an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). If the user completes the signing process the modal will auto-close and the signed transaction will be broadcast to the network.

_Note: If you try to sign a transaction without having first loaded the user's wallet then the wallet loading 
modal will automatically get shown first_.

## Frontend integration

The erdbox UI shows as a modal that overlays everything else on the page. The modal is rendered within an `iframe` and thus its layout and styling is not at all affected by the layout and/or styling used for the parent page. This is also why erdbox is compatible with any front-end framework and will not interfere with the other page elements.

This makes integrating erdbox into your existing Dapp very easy and secure.

