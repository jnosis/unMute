const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');
const modify = require('./manifest-loader.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './image/icons/prod', to: './icons' },
        {
          from: './public/manifest.json',
          to: './',
          transform(content, path) {
            return modify(content);
          },
        },
      ],
    }),
  ],
});
