var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                        plugins: [
                            'transform-object-assign',
                            'transform-object-rest-spread',
                            'transform-class-properties'
                        ]
                    }
                }
            },
            /* TODO: turn this on */
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loaders: {
            //         loader: 'eslint-loader',
            //         options: {
            //             quiet: true
            //         }
            //     }
            // },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, '../node_modules/panda-session')],
                loaders: ['babel-loader']
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?sourceMap!sass-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?sourceMap'
                }),
                exclude: /flexboxgrid/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                include: /flexboxgrid/
            },
            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                loader: 'url-loader?mimetype=application/font-woff&limit=10000'
            },
            {
                test: /\.(ttf|eot|svg|gif|png)(\?v=[0-9].[0-9].[0-9])?$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss'],
        alias: {
            actions: path.resolve(__dirname, '../public/js/actions/'),
            components: path.resolve(__dirname, '../public/js/components/'),
            containers: path.resolve(__dirname, '../public/js/containers/'),
            reducers: path.resolve(__dirname, '../public/js/reducers/'),
            services: path.resolve(__dirname, '../public/js/services/'),
            utils: path.resolve(__dirname, '../public/js/utils/'),
            helpers: path.resolve(__dirname, '../public/js/helpers/')
        }
    },

    plugins: [new ExtractTextPlugin('main.css')]
};
