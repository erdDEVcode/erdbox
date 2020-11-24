[![NPM module](https://badge.fury.io/js/erdbox.svg)](https://badge.fury.io/js/erdbox)
[![Join the community](https://img.shields.io/badge/Chat%20on-Telegram-brightgreen.svg?color=0088cc)](https://t.me/erdDEV)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/erd_dev)

# erdbox

Drop-in widget for connecting your [Elrond](https://elrond.com) dapp to user's wallets.

* Supports all wallet types: Mnemonic/seedphrase, JSON keyfile, PEM file, Ledger hardware
* Full transaction signing (including smart contract interactions)
* Easy and simple API
* Works with any frontend framework and/or vanilla JS
* Typescript definitions.
* Full documentation coming soon!

## Usage

Include the following `script` tag anywhere within your HTML:

```html
<script type="text/javascript">
  const g = window.document.createElement('script');
  g.id = 'erdboxScript';
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = 'https://cdn.jsdelivr.net/npm/erdbox@1.6.0/dist/erdbox.js';
  window.document.body.appendChild(g);
</script>
```

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

Full documentation coming soon!

## How it works

_Coming soon!_

## Development

_Note: These instructions are for developers who wish to work on Vilya itself_.

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