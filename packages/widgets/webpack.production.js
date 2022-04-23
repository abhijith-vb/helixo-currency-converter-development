// Load global config values
const dotenv = require('dotenv').config({ path: '../server/.env' });
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cloneDeep = require('lodash/cloneDeep');
const shelljs = require('shelljs');
const { readdirSync } = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const APPS_PATH = '/apps/';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
const isDevelopment = process.env.NODE_ENV !== 'production';

// console.log(`env`, process.env);

/**
 * Build and bundle all apps
 */
// Clear out dist directory
shelljs.rm('-rf', './dist/apps/*');

const WIDGET_NAME = 'buckscc';
const INPUT_FILE = `./src/apps/widgets/${WIDGET_NAME}/index.js`;
const OUTPUT_FILE = `sdk.min.js`;

// This is a skelton for each script
const appsBundleConfigSkelton = {
    mode: 'production',
    devtool: isDevelopment && 'eval-source-map',
    entry: [],
    output: {
        path: `${__dirname}/dist/widgets/${WIDGET_NAME}`,
        filename: '',
        library: ['bucksCC', 'widget'],
        libraryTarget: 'umd',
        libraryExport: 'default',
        /**
         * Use public path otherwise dynamic imports load default from root.
         * https://webpack.js.org/guides/public-path/
         */
        publicPath: APPS_PATH
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            !isDevelopment &&
                new TerserPlugin({
                    terserOptions: {
                        parallel: true,
                        ecma: undefined,
                        warnings: false,
                        parse: {},
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                            drop_console: true
                        },
                        mangle: {
                            safari10: true
                        },
                        module: false,
                        output: {
                            ecma: 5,
                            comments: false
                        },
                        toplevel: false,
                        nameCache: null,
                        ie8: false,
                        keep_classnames: undefined,
                        keep_fnames: false,
                        safari10: true
                    }
                }),
            new OptimizeCssAssetsPlugin({})
        ].filter(Boolean)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require.sass,
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __Env__: JSON.stringify(''),
            'procss.env.API_URL': process.env.PRODUCTION_HOST
        })
    ],
    resolve: {
        extensions: ['.js', '.svg']
    },
    devServer: {
        port: 3000,
        contentBase: `${__dirname}/build`,
        inline: false
    }
};

// Creating entries for bundle

const scriptBundleConfigs = [];

// Adding main bundle to config array
const mainEntryConfig = cloneDeep(appsBundleConfigSkelton);
mainEntryConfig.entry.push(INPUT_FILE);
mainEntryConfig.output.filename = OUTPUT_FILE;
scriptBundleConfigs.push(mainEntryConfig);

/**
 * Thankyou page preview build
 */
const externalPagesScripts = {
    mode: 'production',
    devtool: isDevelopment && 'eval-source-map',
    entry: ['./src/pages/demo/index.js'],
    output: {
        path: `${__dirname}/dist/pages/demo`,
        filename: 'demo.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require.sass,
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'demo_bundle.css'
        })
    ],
    resolve: {
        extensions: ['.js', '.svg']
    }
};

// Push other script config to webpack entries config array
scriptBundleConfigs.push(...[externalPagesScripts]);

module.exports = scriptBundleConfigs;
