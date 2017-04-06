var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

var Root_Path = path.resolve(__dirname);
var App_Path = path.resolve(Root_Path, './src');
var App_File = path.resolve(App_Path, 'app.js');
var Build_Path = path.resolve(__dirname, './__build__/static')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: App_File, //就是这个名字
        common: ['react', 'react-dom', 'react-router', 'react-router-transition']
    },
    output: {
        publicPath: './static/', //编译好的文件，在服务器的路径,域名会自动添加到前面
        path: Build_Path, //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[id].chunk.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /^node_modules$/,
                include: [App_Path]
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader',publicPath: './'}),
                exclude: /^node_modules$/,
                include: [App_Path]
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
                //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
                exclude: /^node_modules$/,
                include: [App_Path]
            }, {
                test: /\.jsx?$/,
                loaders: 'babel-loader',
                exclude: /^node_modules$/,
                include: [App_Path]
            }
        ]

    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'}),
        new webpack.DefinePlugin({
            'procees.env': {
                NODE_ENV: JSON.stringify('development') //定义编译环境
            }
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html', //生成的html存放路径，相对于 path
            template: './src/index.html', //html模板路径
            hash: false
        }),
        new ExtractTextPlugin('[name].css') //你已经把哪个global的css打包到这个【name】。css里了   这个name就是entry的名字
    ],
    resolve: {
        extensions: [
            '.js', '.jsx', '.less', '.scss', '.css'
        ], //后缀名自动补全
        // alias: {
        //     'react-router-transition': path.resolve(node_modules_dir,'react-router-transition/src/RouteTransition.jsx')
        //   }
    }
}
