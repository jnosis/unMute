const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const { exec } = require('child_process');
const dev = require('./webpack/webpack.dev.js');
const prod = require('./webpack/webpack.prod.js');
const modify = require('./webpack/manifest-loader.js');
const path = require('path');
const loader = path.join(__dirname, `webpack/api-loader.js`);
const api = path.join(__dirname, 'src/Api/platform.ts');

module.exports = (env) => {
  return merge(!!env.production ? prod(env.platform) : dev(env.platform), {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader,
            options: {
              platform: env.platform,
            },
          },
          resource: api,
        },
      ],
    },
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

      {
        apply: (compiler) => {
          env.production &&
            compiler.hooks.afterEmit.tap('RunZipJS', (compilation) => {
              exec(`node zip.js ${env.platform}`, (err, stdout, stderr) => {
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
};
