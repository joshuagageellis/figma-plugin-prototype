
/**
 * Primary Webpack Configuration
 */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

// Loaders.
import tsLoader from './webpack/typescript.js';
import cssLoader from './webpack/css.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const module = {
	mode: process.env.NODE_ENV,
  entry: {
    code: './src/code.ts',
    ui: './src/ui.tsx'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    port: 9000,
    hot: false,
  },
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
    clean: {
      keep: 'index.html'
    }
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