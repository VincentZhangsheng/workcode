const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/index.js'
    },
    output: {
        filename: './[name].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: ['file-loader?limit=4096&name=images/[hash:6].[name].[ext]']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(csv|tsv)$/,
                use: ['csv-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            }
        ]
    },
    devServer: {
        contentBase: './build'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 源模板文件
            filename: 'index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
            showErrors: true,
            inject: 'head',
            hash: true,
            minify: {  //压缩HTML文件
                removeComments: true,  //移除HTML中的注释
                collapseWhitespace: false  //删除空白符与换行符
            }
        }),
        new CleanWebpackPlugin(['build'])
    ]
}