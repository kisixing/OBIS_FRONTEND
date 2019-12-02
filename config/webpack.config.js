const path = require("path");
const dir = path.join.bind(path, __dirname, '../');
const isProd = process.env.NODE_ENV === "production";

const webpack = require("webpack");
const merge = require("webpack-merge");
const HappyPack = require("happypack");
const Es3ifyPlugin = require("es3ify-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const {debugIE,chunkStats,bundleAnalyzerPlugin} = require("./my-dev-config");
const currentConfig = require(isProd ? "./webpack.cfg" : "./webpack.cfg.dev");
const fileHash = isProd ? "[chunkhash:5]" : "[hash:5]";

const commonConfig = {
    devtool: 'source-map',
    entry: {
        index: dir("src/app/index.js"),
        shim: [
            "es5-shim", // 支持 IE8 所必须,且顺序在babel-polyfill前
            "es5-shim/es5-sham",
            "html5shiv",
            "console-polyfill",
            "babel-polyfill",
            "media-match", // 支持 antd 所必须
        ]
    },
    output: {
        path: dir("dist"),
        filename: "assets/js/[name]." + fileHash + ".js",
        // 用import()按需加载 https://doc.webpack-china.org/api/module-methods/#import-
        chunkFilename: "assets/js/[name]." + fileHash + ".js",
        //生成的js/css文件的公共路径前缀，以应对形如：127.0.0.1:8888/xxxx（多了公共子路径xxxx）
        //若地址是127.0.0.1:8888/xxxx/ 则用./即可
        publicPath: "./",
    },
    module: {
        noParse: /node_modules\/(jquey|moment|chart\.js)/,
        postLoaders: (debugIE || isProd) ? [{
            test: /\.jsx?$/i,
            loader: "happypack/loader?cacheDirectory=true&id=pre",
        }] : null,
        loaders: [
            {
                test: /\.jsx?$/i,
                loader: "happypack/loader?cacheDirectory=true&id=jsx",
                include: dir("src"),
                exclude: path => !!path.match(/node_modules|src\/assets/),
            },
            {
                test: /\.(jpe?g|png|gif|bmp|ico)(\?.*)?$/i,
                loader: "url-loader?limit=8048&name=assets/url-img/[name].[hash:5].[ext]&publicPath=../../",
            },
            {
                test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
                loader: "url-loader?limit=2048&name=font/[name].[hash:5].[ext]",
                exclude: path => !!path.match(/node_modules|src\/assets/),
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], { 
            root: path.resolve(__dirname, '..'),
            dry: false // 启用删除文件
        }),
        //本地打包分析配置
        !!bundleAnalyzerPlugin?new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: '9998',
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: false,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            logLevel: 'info'
        }):()=>{},
        new webpack.BannerPlugin('auth_ma_chao'),
        (debugIE || isProd) ? new HappyPack({
            id: "pre",
            threads: 4,
            loaders: [{
                loader: "export-from-ie8/loader",
                options: {
                    cacheDirectory: true,
                },
            }],
        }):()=>{},
        new HappyPack({
            id: "jsx",
            threads: 4,
            loaders: [{
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                },
            }],
        }),
        new CopyWebpackPlugin([
            {
                from: "src/assets/static",
                to: "assets/static",
            },
            {
                from: "src/assets/static-img",
                to: "assets/static-img",
            },
            {
                from: "src/assets/mock",
                to: "assets/mock",
            }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: "antd",
            minChunks: 2,
            chunks: ["fuzhen", "shouzhen"]
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: 2,
            chunks: ["antd", "index"]
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "runtime",
            minChunks: Infinity,
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: dir("src/index.html"),
            title: "中山大学附属第一医院",
            chunks: ["runtime", "shim", "antd", "vendor", "index"],
            chunksSortMode: "manual",
            inject: true,
            xhtml: true,
            hash: true,
            //模板文件index.html静态资源路径前缀,暂时无用
            staticPath: '/peas',
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/i, /moment$/i),
        (debugIE || isProd) ? new Es3ifyPlugin():()=>{},
        !!chunkStats?function () {
            this.plugin("done", function (stats) {
                const fs = require('fs');
                fs.writeFile(path.join(__dirname, "stats_inner.json"), "", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                fs.writeFileSync(
                    path.join(__dirname, "stats_inner.json"),
                    JSON.stringify(stats.toJson()));

            });
        }:()=>{}
    ],
    resolve: {
        alias: {},
        root: path.resolve('src'),
        modulesDirectories: ['node_modules'],
        extensions: ["", ".js", ".jsx", ".json"],
    },
    performance: {
        hints: false,
    }
};

module.exports = merge(commonConfig, currentConfig);
