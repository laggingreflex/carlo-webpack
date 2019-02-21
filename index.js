const URL = require('url');
const Path = require('path');
const carlo = require('carlo');
const WebpackSNAPI = require('webpack-simple-node-api');
const html = require('html-webpack-plugin');

module.exports = (opts) => {
  opts.webpack = opts.webpack || {};
  opts.webpack.config = opts.webpack.config || {};
  opts.webpack.config.plugins = opts.webpack.config.plugins || [];
  opts.html = opts.html || {};
  opts.webpack.devServer = opts.webpack.devServer || {};
  opts.carlo = opts.carlo || {};
  opts.carlo.load = opts.carlo.load || {};
  opts.carlo.launch = opts.carlo.launch || {};
  opts.webpack.config.plugins.push(new html(opts.html));

  const webpack = WebpackSNAPI(opts.webpack.config);
  let uri = opts.carlo.load.uri;

  return { runDevServer, build, launch };

  /* Functions */

  async function runDevServer() {
    const devServer = await webpack.devServer(opts.webpack.devServer, opts.webpack.watcher);
    let { address, port } = devServer.address();
    if (!address || address === '0.0.0.0' || '::' === address) {
      address = 'localhost';
    }
    uri = `http://${address}:${port}`;
    return [uri, devServer];
  }

  async function build({ log = true } = {}) {
    let path;
    if (!uri) {
      let dirname, basename;
      if (opts.webpack.config.output) {
        dirname = opts.webpack.config.output.path;
      } else {
        dirname = Path.join(process.cwd(), 'dist');
      }
      if (opts.html.filename) {
        basename = opts.html.filename;
      } else {
        basename = 'index.html';
      }
      path = Path.join(dirname, basename);
      uri = URL.pathToFileURL(path);
    }
    await webpack.build({ log });
    return [uri];
  }

  async function launch(_uri = uri) {
    const app = await carlo.launch({
      // devtools: true,
      args: [
        // isDev && '--auto-open-devtools-for-tabs',
      ].filter(Boolean),
      ...opts.carlo.launch,
    });

    const params = opts.carlo.load.params || [];

    // console.log(`Loading: ${uri}`);
    await app.load(_uri, ...params);
    console.log(`Loaded: ${_uri}`);

    return app;
  }
};
