import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname
    }
    ],
  },
  devServer: {
    proxy: {
      '/api/*': 'http://localhost:5000',
      '/auth': 'http://localhost:5000'
    }
  },
  devtool: 'source-map'
};