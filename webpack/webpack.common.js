const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
  entry: {
    // popup: path.join(srcDir, 'popup.ts'),
    options: path.join(srcDir, 'options.ts'),
    changelog: path.join(srcDir, 'changelog.ts'),
    background: path.join(srcDir, 'background.ts'),
    // content_script: path.join(srcDir, 'content_script.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './public', to: './' }],
    }),
  ],
};
