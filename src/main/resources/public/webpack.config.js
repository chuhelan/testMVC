// 引入一个包
const path = require('path');

//引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin');

//引入clean插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// webpack中的所有的配置信息都应该写在module.exports中
module.exports = {

    //这个模式下输出文件不会被压缩 适用于开发环境
    mode: "development",
    // mode: "production",

    //指定入口文件
    entry: "./ts/index.ts",

    //指定打包文件所在目录
    output: {
        //指定打包文件的目录
        path: path.resolve(__dirname, 'dist'),
        //打包后文件的名字
        filename: "bundle.js",
        //告诉webpack不使用箭头函数
        environment: {
            arrowFunction: false
        }
    },

    //指定webpack打包时要使用的模块
    module: {
        //指定要加载的规则
        rules: [
            {
                //test指定的是规则生效的文件
                test: /\.ts$/,
                //要使用的loader
                use: [
                    //配置babel
                    {
                        //指定加载器
                        loader: "babel-loader",
                        //设置babel
                        options: {
                            //设置预定义的环境
                            presets: [
                                [
                                    //指定环境的插件
                                    "@babel/preset-env",
                                    //配置信息
                                    {
                                        //要兼容的目标浏览器
                                        targets: {
                                            "chrome": "80"
                                        }
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'
                ],
                //要排除的文件夹
                exclude: /node-modules/
            }
        ]
    },

    //配置webpack插件
    plugins: [
        new CleanWebpackPlugin()
    ],

    //用来设置引用模块
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            "crypto": false
        },
        alias: {
            '@utils': path.resolve(__dirname, 'utils')
        }
    }
};