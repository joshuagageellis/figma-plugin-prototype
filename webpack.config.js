/**
 * Primary Webpack Configuration
 */
import path from 'path';
import tsLoader from './webpack/typescript.js';

const module = {
	mode: process.env.NODE_ENV,
  entry: ['./code.ts'],
  devtool: 'inline-source-map',
	mode: 'production',
  module: {
    rules: [
      tsLoader
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    path: path.resolve('./build'),
    filename: 'code.js'
  }
};

export default module;