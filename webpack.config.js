const Dotenv = require("dotenv-webpack");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Yallhands',
      hash: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["babel-plugin-transform-object-rest-spread", new Dotenv()]
          }
        }
      }
    ],
    loaders: [{
      test: /\.css$/,
      loaders: [
        'style', 'css'
      ]
    }]
  }
};
