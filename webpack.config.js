const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const path = require('path');

const config = {
  entry: path.join(__dirname, './src/main.ts'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist')
  },
  devtool: false, // To be changed based on `argv.mode`. See `module.exports` function.
  module: {
    rules: [
      {
        test: /\.(gltf|glb|png|bin)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({
                  'browsers': ['> 1%', 'last 2 versions']
                }),
              ]
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              emitErrors: true,
              failOnHint: true,
              typeCheck: true,
              tsConfigFile: path.join(__dirname, './tsconfig.json'),
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(__dirname, './dist')
    ]),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      filename: path.join(__dirname, './dist/index.html'),
      template: path.join(__dirname, './src/index.html'),
      favicon: path.join(__dirname, './src/img/favicon.ico'),
      title: 'Test client for BBZFC project',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0, shrink-to-fit=no',
        description: 'Test client for BBZFC project'
      }
    }),
    new webpack.HotModuleReplacementPlugin({
      // Options...
    })
  ],
  devServer: {
    hot: true
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  } else {
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    };
  }

  return config;
};
