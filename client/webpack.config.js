const path = require('path');

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /public/, /coverage/, /\.test\.js$/],
                use: ['babel-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                exclude: [/node_modules/, /public/, /coverage/],
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public'),
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src/'),
        },
        extensions: ['.js', '.jsx'],
    },
    watchOptions: {
        aggregateTimeout: 250,
        ignored: [/node_modules/, /public/, /coverage/, /\.test\.js/],
    },
};