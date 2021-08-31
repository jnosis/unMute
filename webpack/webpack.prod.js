const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { exec } = require('child_process');
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
          },
        },
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './image/icons/prod', to: './icons' }],
    }),

    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('RunZipJS', (compilation) => {
          exec('node zip.js', (err, stdout, stderr) => {
            if (err) {
              console.error(`exec error: ${err}`);
              return;
            }

            console.log('\nRun zip.js');
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      },
    },
  ],
});
