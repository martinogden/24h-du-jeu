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
      loader: ['babel'],
      exclude: /node_modules/,
      include: __dirname,
      query: {
        "presets": [
          "es2015",
          "react"
        ]
      }
    }
    ],
  },
  devServer: {
    proxy: {
      '/api/*': 'http://localhost:8000',
      '/auth/*': 'http://localhost:8000'
    }
  },
  devtool: 'source-map'
};