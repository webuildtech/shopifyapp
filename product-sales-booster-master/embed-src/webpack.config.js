const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../extensions/sales-booster-embed/assets"),
    filename: "sales-booster-embed.js",
  },
  devServer: {
    hot: true,
    port: 3000,
    static: {
      directory: path.join(__dirname, "../extensions/sales-booster-embed/assets")
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};