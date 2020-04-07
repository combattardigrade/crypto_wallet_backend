const path = require('path')
const Dotenv = require('dotenv-webpack')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/assets')
    },
    plugins: [
        new Dotenv(),
        new NodemonPlugin(), 
    ],
    mode: 'development',
    devServer: { contentBase: path.resolve(__dirname, 'public'), compress: true,  }
}