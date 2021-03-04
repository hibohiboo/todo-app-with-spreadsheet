const { resolve } = require("path");
const webpack = require("webpack");

// https://github.com/ronanyeah/elm-webpack を参照

const { ENV } = process.env;
const publicFolder = resolve("./public");
const isProd = ENV === "production";
const webpackLoader = {
  loader: "elm-webpack-loader",
  options: {
    debug: false,
    optimize: isProd,
    cwd: __dirname,
  },
};

const webpackPlugins = isProd
  ? [webpackLoader]
  : [{ loader: "elm-hot-webpack-loader" }, webpackLoader];

const mode = isProd ? "production" : "development";

module.exports = {
  mode,
  entry: "./src/index.js",

  output: {
    publicPath: "/",
    path: publicFolder,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: webpackPlugins,
      },
    ],
  },
  devServer: {
    publicPath: "/",
    contentBase: publicFolder,
    port: 8000,
    hotOnly: true,
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },
  },

  plugins: [],
};

// config.resolve.extensions.push('.elm')
    // if (MODE === 'development') {
    //   config.module.rules.push({
    //     test: /\.elm$/,
    //     exclude: [/elm-stuff/, /node_modules/],
    //     use: [
    //       { loader: 'elm-hot-webpack-loader' },
    //       {
    //         loader: 'elm-webpack-loader',
    //         options: {
    //           // add Elm's debug overlay to output
    //           debug: withDebug,
    //         },
    //       },
    //     ],
    //   })
    // } else {
    //   config.module.rules.push({
    //     test: /\.elm$/,
    //     exclude: [/elm-stuff/, /node_modules/],
    //     use: {
    //       loader: 'elm-webpack-loader',
    //       options: {
    //         optimize: true,
    //       },
    //     },
    //   })
    // }
