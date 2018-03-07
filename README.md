# CoinImp

Mine cryptocurrencies [Monero (XMR)](https://getmonero.org/) and [Electroneum (ETN)](http://electroneum.com/) using [CoinImp](https://coinimp.com/) from node.js

This Project is a fork of [CoinHive](https://github.com/cazala/coin-hive), which uses CoinImp instead of CoinHive to mine cryptocurrencies

**New:** Now you can [run this miner on any stratum based pool](https://github.com/immrmonero/coin-imp#faq).

**New:** Now you can [mine Electroneum (ETN)](https://github.com/immrmonero/coin-imp#can-i-mine-other-cryptocurrency-than-monero-xmr).

**Need a proxy?** check [web-socket-proxy](https://github.com/immrmonero/web-socket-proxy).

## Install

```
npm install -g coin-imp
```

## Usage

```js
const CoinImp = require('coin-imp');

(async () => {
  // Create miner
  const miner = await CoinImp('7591494ad1e56601bc8358580d567b319753bc773de35ce1f0d53bb8e4b97186'); // CoinImp's Site Key

  // Start miner
  await miner.start();

  // Listen on events
  miner.on('found', () => console.log('Found!'));
  miner.on('accepted', () => console.log('Accepted!'));
  miner.on('update', data =>
    console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `)
  );

  // Stop miner
  setTimeout(async () => await miner.stop(), 60000);
})();
```

## CLI

Usage:

```
coin-imp 7591494ad1e56601bc8358580d567b319753bc773de35ce1f0d53bb8e4b97186
```

Options:

```
  --interval        Interval between updates (logs)
  --port            Port for the miner server
  --host            Host for the miner server
  --threads         Number of threads for the miner
  --throttle        The fraction of time that threads should be idle
  --proxy           Proxy socket 5/4, for example: socks5://127.0.0.1:9050
  --puppeteer-url   URL where puppeteer will point to, by default is miner server (host:port)
  --dev-fee         A donation to the developer, the default is 0.001 (0.1%)
  --pool-host       A custom stratum pool host, it must be used in combination with --pool-port
  --pool-port       A custom stratum pool port, it must be used in combination with --pool-host
  --pool-pass       A custom stratum pool password, if not provided the default one is 'x'
```

## API

* `CoinImp(siteKey[, options])`: Returns a promise of a `Miner` instance. It requires a [CoinImp Site Key](https://coinimp.com/dashboard). The `options` object is optional and may contain the following properties:

  * `interval`: Interval between `update` events in ms. Default is `1000`.

  * `port`: Port for the miner server. Default is `3002`.

  * `host`: Host for the miner server. Default is `localhost`.

  * `threads`: Number of threads. Default is `navigator.hardwareConcurrency` (number of CPU cores).

  * `throttle`: The fraction of time that threads should be idle. Default is `0`.

  * `proxy`: Puppeteer's proxy socket 5/4 (ie: `socks5://cryptominer.now.sh`).

  * `launch`: The options that will be passed to `puppeteer.launch(options)`. See [Puppeteer Docs](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).

  * `pool`: This allows you to use a different pool. It has to be an [Stratum](https://en.bitcoin.it/wiki/Stratum_mining_protocol) based pool. This object must contain the following properties:

    * `host`: The pool's host.

    * `port`: The pool's port.

    * `pass`: The pool's password. If not provided the default one is `"x"`.

  * `devFee`: A donation to send to the developer. Default is `0.001` (0.1%).

* `miner.start()`: Connect to the pool and start mining. Returns a promise that will resolve once the miner is started.

* `miner.stop()`: Stop mining and disconnect from the pool. Returns a promise that will resolve once the miner is stopped.

* `miner.kill()`: Stop mining, disconnect from the pool, shutdown the server and close the headless browser. Returns a promise that will resolve once the miner is dead.

* `miner.on(event, callback)`: Specify a callback for an event. The event types are:

  * `update`: Informs `hashesPerSecond`, `totalHashes` and `acceptedHashes`.

  * `open`: The connection to our mining pool was opened. Usually happens shortly after miner.start() was called.

  * `authed`: The miner successfully authed with the mining pool and the siteKey was verified. Usually happens right after open.

  * `close`: The connection to the pool was closed. Usually happens when miner.stop() was called.

  * `error`: An error occured. In case of a connection error, the miner will automatically try to reconnect to the pool.

  * `job`: A new mining job was received from the pool.

  * `found`: A hash meeting the pool's difficulty (currently 256) was found and will be send to the pool.

  * `accepted`: A hash that was sent to the pool was accepted.


## Environment Variables

All the following environment variables can be used to configure the miner from the outside:

* `COINIMP_SITE_KEY`: CoinImp's Site Key

* `COINIMP_INTERVAL`: The interval on which the miner reports an update

* `COINIMP_THREADS`: Number of threads

* `COINIMP_THROTTLE`: The fraction of time that threads should be idle

* `COINIMP_PORT`: The port that will be used to launch the server, and where puppeteer will point to

* `COINIMP_HOST`: The host that will be used to launch the server, and where puppeteer will point to

* `COINIMP_PUPPETEER_URL`: In case you don't want to point puppeteer to the local server, you can use this to make it point somewhere else where the miner is served (ie: `COINIMP_PUPPETEER_URL=https://cryptominer.now.sh`)

* `COINIMP_PROXY`: Puppeteer's proxy socket 5/4 (ie: `COINIMP_PROXY=socks5://cryptominer.now.sh`)

* `COINIMP_DEV_FEE`: A donation to the developer, the default is 0.001 (0.1%).

* `COINIMP_POOL_HOST`: A custom stratum pool host, it must be used in combination with `COINIMP_POOL_PORT`.

* `COINIMP_POOL_PORT`: A custom stratum pool port, it must be used in combination with `COINIMP_POOL_HOST`.

* `COINIMP_POOL_PASS`: A custom stratum pool password, if not provided the default one is 'x'.


## FAQ

#### Can I run this on a different pool than CoinImp's?

Yes, you can run this on any pool based on the [Stratum Mining Protocol](https://en.bitcoin.it/wiki/Stratum_mining_protocol).

```js
const CoinImp = require('coin-imp');
(async () => {
  const miner = await CoinImp('<YOUR-MONERO-ADDRESS>', {
    pool: {
      host: 'la01.supportxmr.com',
      port: 3333,
      pass: '<YOUR-PASSWORD-FOR-POOL>' // default 'x' if not provided
    }
  });
  await miner.start();
  miner.on('found', () => console.log('Found!'));
  miner.on('accepted', () => console.log('Accepted!'));
  miner.on('update', data =>
    console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `)
  );
})();
```

Now your CoinImp miner would be mining on `supportXMR.com` pool, using your monero address.

You can also do this using the CLI:

```
coin-imp <YOUR-MONERO-ADDRESS> --pool-host=la01.supportxmr.com --pool-port=3333 --pool-pass=<YOUR-PASSWORD-FOR-POOL>
```



#### Can I mine other cryptocurrency than Monero (XMR)?

Yes, you can also mine [Electroneum (ETN)](https://electroneum.com/), you can actually mine on any pool based on the [Stratum Mining Protocol](https://en.bitcoin.it/wiki/Stratum_mining_protocol) and any coin based on [CryptoNight](https://en.bitcoin.it/wiki/CryptoNight).

You can go get you ETN wallet from [electroneum.com](https://electroneum.com) if you don't have one.

```js
const CoinImp = require('coin-imp');
const miner = await CoinImp('<YOUR-ELECTRONEUM-ADDRESS>', {
  pool: {
    host: 'etn-pool.proxpool.com',
    port: 3333
  }
});
miner.start();
```

Now your CoinImp miner would be mining on `etn.proxpool.com` pool, using your electroneum address.

You can also do this using the CLI:

```
coin-imp <YOUR-ELECTRONEUM-ADDRESS> --pool-host=etn-pool.proxpool.com --pool-port=3333
```

#### Which version of Node.js do I need?

Node v8+

## Troubleshooting

#### I'm having errors on Ubuntu/Debian

Install these dependencies:

```
sudo apt-get -y install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libxext6
```

#### I'm getting an Error: EACCES: permission denied when installing the package

Try installing the package using this:

```
sudo npm i -g coin-imp --unsafe-perm=true --allow-root
```

#### An error occured Failed to launch chrome!

Try changing chromium's executable path to `/usr/bin/chromium-browser`, like this:

```js
const miner = await CoinImp('site-key', {
  launch: {
    executablePath: '/usr/bin/chromium-browser',
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  }
});
```

This project is not endorsed by or affiliated with `coinimp.com` in any way.

## Support

This project is pre-configured for a 0.1% donation. This can be easily toggled off programatically, from the CLI, or via environment variables.

<3
