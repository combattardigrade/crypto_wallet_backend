const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
// react webpack express babel
// https://levelup.gitconnected.com/how-to-setup-environment-using-react-webpack-express-babel-d5f1b572b678
// nodemon and webpack dev server
// https://itnext.io/auto-reload-a-full-stack-javascript-project-using-nodemon-and-webpack-dev-server-together-a636b271c4e

module.exports = {
    entry: {
        app: path.join(__dirname, 'app_src', 'index.js'),
        //admin: path.join(__dirname, 'admin_src','index.js')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'public', 'js'),
        publicPath: '/js',
        filename: '[name].js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv()
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        host: 'localhost',
        port: 8000,
        contentBase: path.join(__dirname, '/public'),
        watchContentBase: true,
        proxy: [
            {
                context: ['^/api/*', '^/*'],
                target: 'http://localhost:3000/',
                secure: false
            }
        ],
        overlay: {
            warnings: false,
            errors: true
        }
    },
}