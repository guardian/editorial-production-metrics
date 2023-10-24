const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    devtool: "source-map",
    output: {
        filename: 'app.js',
        path:  path.resolve(__dirname,  '../public/build')
    },
    entry: path.resolve(__dirname, '../', 'public/js/index.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "eslint-loader",
                    options: {
                        quiet: true,
                    },
                },
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "../node_modules/panda-session"),
                ],
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
                exclude: /flexboxgrid/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                include: /flexboxgrid/,
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|gif|png)(\?v=[0-9].[0-9].[0-9])?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        url: false,
                        name: "[name].[ext]",
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".scss"],
        alias: {
            actions: path.resolve(__dirname, "../public/js/actions/"),
            components: path.resolve(__dirname, "../public/js/components/"),
            containers: path.resolve(__dirname, "../public/js/containers/"),
            reducers: path.resolve(__dirname, "../public/js/reducers/"),
            services: path.resolve(__dirname, "../public/js/services/"),
            utils: path.resolve(__dirname, "../public/js/utils/"),
            helpers: path.resolve(__dirname, "../public/js/helpers/"),
        },
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "main.css"
    })],
};
