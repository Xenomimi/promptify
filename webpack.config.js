const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = (env, argv) => {

  const envConfig = dotenv.config({ path: path.resolve(__dirname, '.env.local') }).parsed || {};

  const envKeys = Object.keys(envConfig).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envConfig[next]);
    return prev;
  }, {});

  return {
    mode: argv.mode === 'production' ? 'production' : 'development',

    devtool: argv.mode === 'production' ? false : 'inline-source-map',

    entry: {
      code: './src/code.ts',
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
      extensions: ['.ts', '.js'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
      new webpack.DefinePlugin(envKeys)
    ],
  };
};
