const path = require('path');

module.exports = {
     entry: './src/index.js',
     output: {
         // TODO: Make index.html go to the same dir
         path: path.resolve(__dirname, 'bin'),
         filename: 'bundle.js',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     }
 }
