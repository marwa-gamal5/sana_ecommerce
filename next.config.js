const webpack = require("webpack");

const path = require('path');

module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      loader: 'file-loader',
      options: {
        publicPath: `/_next/static/videos/`,
        outputPath: `${options.isServer ? '../' : ''}static/videos/`,
        name: '[name].[hash].[ext]',
        esModule: false,
      },
    });

    config.plugins.push(
      new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
   }))

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

