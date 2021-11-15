
/**
 * Primary Webpack Configuration
 */
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

// Loaders.
import tsLoader from './webpack/typescript.js';
import cssLoader from './webpack/css.js';

const module = {
	mode: process.env.NODE_ENV,
  entry: {
    code: './src/code.ts',
    ui: './src/ui.tsx'
  },
  devtool: 'inline-source-map',
	mode: 'development',
  module: {
    rules: [
      tsLoader,
      cssLoader
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
  },
  output: {
    path: path.resolve('./build'),
    filename: '[name].js',
    publicPath: '/',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
      inject: 'body',
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
  ],
};

export default module;