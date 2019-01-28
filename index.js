const fs = require('fs');
const Path = require('path');
const URL = require('url');
const carlo = require('carlo');
const WebpackSNAPI = require('webpack-simple-node-api');
const html = require('html-webpack-plugin');

module.exports = async (opts) => {
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

  if (opts.dev) {
    const devServer = await webpack.devServer(opts.webpack.devServer, opts.webpack.watcher);
    let { address, port } = devServer.address();
    if (!address || address === '0.0.0.0' || '::' === address) {
      address = 'localhost';
    }
    uri = `http://${address}:${port}`;
  } else {
    let path;
    if (!uri) {
      let dirname, basename;
      if (opts.webpack.config.output) {
        dirname = opts.webpack.config.output.path;
      } else {
        dirname = Path.join(process.cwd, 'dist');
      }
      if (opts.html.filename) {
        basename = opts.html.filename;
      } else {
        basename = 'index.html';
      }
      path = Path.join(dirname, basename);
      uri = URL.pathToFileURL(path);
    }
    if (!fs.existsSync(path) || opts.cache === false) {
      await webpack.run({ log: true });
    }
  }

  const app = await carlo.launch({
    // devtools: true,
    args: [
      // isDev && '--auto-open-devtools-for-tabs',
    ].filter(Boolean),
    ...opts.carlo.launch,
  });

  const params = opts.carlo.load.params || [];

  // console.log(`Loading: ${uri}`);
  await app.load(uri, ...params);
  console.log(`Loaded: ${uri}`);

  return app;
};
