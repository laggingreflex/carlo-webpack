# carlo-webpack

Simple Node API for [Carlo] + [Webpack]

## Install

```sh
npm i carlo-webpack
```

## Usage

```js
const carloWebpack = require('carlo-webpack')
const config = require('./webpack.config.js')
const { runDevServer, build, launch } = await carloWebpack({
  webpack: { config },
})

await build() // OR
await runDevServer()
// then
const app = await launch();
```

### API

```js
carloWebpack(opts)
```

* **`opts`**

  * **`dev`** `[boolean]` Whether to run WebpackDevServer (with Hot Reload) or build (or use previously built) bundle

  * **`cache`** `[boolean=true]` Use previously built bundle

  * **`webpack`**

    * **`config`** Webpack config (`webpack.config.js`)
    * **`devServer`** Options passed to [WebpackDevServer]
    * **`watcher`** Watcher function called every time WebpackDevServer re-compiles

  * **`html`** `[object]` Options for [html-webpack-plugin]

  * **`carlo`**

    * **`launch`** `[object]` Options passed to [carlo.launch]

    * **`load`**

      * **`uri`** `[string]` URI for Carlo's `app.load(uri)`. Default = automatically chosen
      * **`params`** `[array]` Params for Carlo's `app.load(uri, ...params)`

[carlo]: https://github.com/GoogleChromeLabs/carlo
[Carlo's RPC API]: https://github.com/GoogleChromeLabs/carlo/blob/master/rpc/rpc.md
[webpack]: http://webpack.js.org
[carlo-rpc-simple]: https://github.com/laggingreflex/carlo-rpc-simple
[carlo.launch]: https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#carlolaunchoptions
[html-webpack-plugin]: https://github.com/jantimon/html-webpack-plugin
[WebpackDevServer]: https://webpack.js.org/configuration/dev-server

