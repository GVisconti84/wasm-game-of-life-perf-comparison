const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './bootstrap.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bootstrap.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }, {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'  // compiles Less to CSS
        ]
      },
    ],
  },
  resolve: {
    // IMPORTANT! This is the list of extensions webpack will try to match when
    // importing from ts files. We need to add '.wasm' because of the "wasm_game_of_life_bg" import!
    extensions: [ '.tsx', '.ts', '.js', '.wasm' ],
  },
  plugins: [
    new CopyWebpackPlugin(['index.html'])
  ],
};
