import path from 'path';
import { fileURLToPath } from 'url';
import ESLintPlugin from 'eslint-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";
import webpack from 'webpack';
import { glob } from 'glob';
import Dotenv from 'dotenv-webpack';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATHS = {
    src: path.join(__dirname, "src"),
};

let mode = '';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}
if (process.env.NODE_ENV === 'development') {
    mode = 'development';
}

console.log(process.env.NODE_ENV);

export default {
    entry: './src/main.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i, // Matches all SCSS/Sass files with any extension (scss or sass)
                use: [
                    mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader' // Compiles Sass/SCSS to CSS
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 4kb
                    }
                },
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.json$/,
                type: 'json',
                generator: {
                    filename: 'json/[name][ext]'
                }
            }
        ],
    },
    plugins: [
        new Dotenv(),
        new NodePolyfillPlugin({
            additionalAliases: ['process'],
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico'
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css', // Output filename for extracted CSS
            chunkFilename: 'css/[id].css' // Output filename for CSS chunks
        }),
        new CssMinimizerPlugin(),
        new ESLintPlugin({
            threads: true,
            failOnWarning: false,
            configType: 'flat'
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false',
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
        }),
        new PurgeCSSPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
            variables: true
        })
    ],
    devServer: {
        client: {
            overlay: {
                errors: true,
                warnings: false,
                runtimeErrors: true,
            },
        },
        static: {
            directory: './src'
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    optimization: {
        chunkIds: 'named',
        moduleIds: 'named'
    },
};
