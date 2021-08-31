const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack/webpack.common.js');
const dev = require('./webpack/webpack.dev.js');
const prod = require('./webpack/webpack.prod.js');
const modify = require('./webpack/manifest-loader.js');

module.exports = (env) => {
  return merge(!!env.production ? prod : dev, {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: './public/manifest.json',
            to: './',
            transform(content, path) {
              return modify(content, !!env.production, env.platform);
            },
          },
        ],
      }),
    ],
  });
};
