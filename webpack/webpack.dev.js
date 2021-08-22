const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');
const loader = path.join(__dirname, 'dev-code-loader.js');
const background = path.join(__dirname, '..', 'src/background.ts');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: loader,
        resource: background,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './image/icons/dev', to: './icons' },
        { from: './public/manifest.json', to: './' },
      ],
    }),
  ],
});
