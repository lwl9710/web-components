const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolvePath(pathname) {
  return path.resolve(__dirname, pathname);
}

module.exports = function(env) {
  const isProduction = env.mode === "production";
  const publicPath = "./";
  return {
    mode: env.mode || "development",
    entry: "./src/index.ts",
    target: [ "web", "es6" ],
    devtool: isProduction ? false : "inline-source-map",
    output: {
      publicPath,
      clean: true,
      filename: "index.js",
      chunkFilename: "js/[name].[contenthash].chunk.js",
      path: resolvePath("dist")
    },
    resolve: {
      extensions: [ ".js", ".ts", ".tsx" ],
      alias: {
        "@": resolvePath("src")
      }
    },
    devServer: {
      open: true,
      port: 8888,
      compress: true,
      devMiddleware: {
        publicPath: "/"
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader"
        },
        {
          test: /\.css$/,
          use: [ "style-loader", "css-loader" ]
        },
        {
          test: /\.(jpg|jpeg|png|gif|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name].[contenthash].[ext]"
          }
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: "body",
        scriptLoading: "blocking",
        template: resolvePath("public/index.html")
      })
    ]
  }
}
