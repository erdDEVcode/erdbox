<p align="center">
  <img width="250" height="250" src="https://raw.githubusercontent.com/erdDEVcode/erdbox/master/assets/logo.png">
</p>

# erdbox

[![NPM module](https://badge.fury.io/js/erdbox.svg)](https://badge.fury.io/js/erdbox)
[![Join the community](https://img.shields.io/badge/Chat%20on-Telegram-brightgreen.svg?color=0088cc)](https://t.me/erdDEV)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/erd_dev)

Drop-in widget for connecting your [Elrond](https://elrond.com) dapp to user's wallets.

Live demo: [Sting wallet](https://sting.erd.dev)

* Supports all wallet types: Mnemonic/seedphrase, JSON keyfile, PEM file, Ledger hardware
* Full transaction signing (including smart contract interactions)
* Easy and simple API
* Works with any frontend framework and/or vanilla JS
* Typescript definitions.
* Full [documentation](https://erdbox.erd.dev).

## Usage

Include the following `script` tag anywhere within your HTML:

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

**Note: replace `1.8.0` in the above code with the latest version of erdbox. This can always be found by visiting the erdbox package page at [https://www.npmjs.com/package/erdbox](https://www.npmjs.com/package/erdbox)**

Then in your Javascript code:

```js
window.addEventListener('erdbox:ready', async () => {
  /*
    `window.erdbox` is now available for use!
  */

  // Example: ask user to connect a wallet
  const address = await window.erdbox.getWalletAddress({ mustLoadWallet: true });
  alert(`User wallet address: ${address}`);
}, { once: true });
```

Full documentation is available at [https://erdbox.erd.dev](https://erdbox.erd.dev).

## Contributors guide

_Note: These instructions are for developers who wish to work on erdbox itself_.

Start the dev server

```shell
yarn dev
```

The script will now be available at http://localhost:9000/erdbox.js, so replace the embed code URL with this one:

```js
g.src = 'http://localhost:9000/erdbox.js'
```

## License

AGPLv3
