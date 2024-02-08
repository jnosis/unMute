const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');
const loader = path.join(__dirname, 'dev-code-disabler.js');
const background = path.join(__dirname, '..', 'src/background.ts');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: loader,
        resource: background,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            passes: 3,
          },
        },
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './image/icons/prod', to: './icons' }],
    }),
  ],
});
