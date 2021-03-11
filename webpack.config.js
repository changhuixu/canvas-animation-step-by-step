const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              tsConfigFile: 'tsconfig.json',
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/style.css',
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: 'src/browserconfig.xml',
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: 'src/manifest.json',
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: 'assets/*',
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: 'src/sw.js',
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
