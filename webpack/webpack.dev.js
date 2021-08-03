const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './image/icons/dev', to: './icons' }],
    }),
  ],
});
