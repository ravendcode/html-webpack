const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  isProduction: process.env.NODE_ENV === 'production',
  // pug or njk
  template: 'pug',
  temlatePlugin: []
};

if (config.template === 'pug') {
  config.temlatePlugin = [
    ...glob.sync('./src/*.pug').map(pugFile => {
      return new HtmlWebpackPlugin({
        inject: 'head',
        filename: path.basename(pugFile, '.pug') + '.html',
        template: path.basename(pugFile),
      });
    })
  ];
} else if (config.template === 'njk') {
  config.temlatePlugin = [
    ...glob.sync('./src/*.njk').map(njkFile => {
      return new HtmlWebpackPlugin({
        inject: 'head',
        filename: path.basename(njkFile, '.njk') + '.html',
        template: path.basename(njkFile),
      });
    })
  ];
}

module.exports = {
  mode: config.isProduction ? 'production' : 'development',
  target: config.isProduction ? 'browserslist' : 'web',
  context: path.resolve(__dirname, 'src'),
  entry: {
    bundle: [
      './js/index.js',
      './scss/index.scss',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].js',
    // filename: (pathData) => {
    //   if (config.isProduction && pathData.chunk.name === 'bundle') {
    //    return 'js/[name].[contenthash].min.js';
    //   } else {
    //     return 'js/[name].[contenthash].js';
    //   }
    // },
    // chunkFilename: 'js/vendor.[chunkhash].js',
    // assetModuleFilename: '[path][name].[hash][ext][query]',
    assetModuleFilename: '[path][name][ext]',
    // publicPath: '',
    clean: true,
  },
  devServer: {
    static: [
      // {
      //   directory: path.resolve(__dirname, 'dist'),
      //   watch: true
      // },
      {
        directory: path.resolve(__dirname, 'src'),
        watch: true
      }
    ],
    open: true,
    hot: true,
    compress: true,
    port: 8080
  },
  devtool: config.isProduction ? false : 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    minimize: config.isProduction,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo"
              ],
            ],
          },
        },
      }),
      new TerserPlugin(),
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './index.html'
    // }),
    ...config.temlatePlugin,
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img/favicon.ico'),
          to: path.resolve(__dirname, 'dist/img/favicon.ico'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.pug$/i,
        exclude: /node_modules/,
        use: {
          loader: 'pug-loader',
          // options: {
          //   pretty: !config.isProduction
          // }
        }
      },
      {
        test: /\.njk$/,
        use: {
          loader: 'nunjucks-render-loader',
          options: {
            path: path.resolve(__dirname, 'src')
          }
        }
      },
      {
        test: /\.s?css$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        // generator: {
        //   filename: '[path][name].[hash][ext][query]',
        // },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        // generator: {
        //   filename: '[path][name].[hash][ext][query]',
        // },
      },
      {
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
};
