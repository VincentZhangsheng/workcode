const webpack = require("webpack");

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8088,
    proxy: {
      "/api": {
        target: "http://admin-dev.winnermedical.com",
        changeOrigin: true
      }
    }
  },
  runtimeCompiler: true,
  lintOnSave: false,
  publicPath: "/",
  chainWebpack(config) {
    config.plugin("provide").use(webpack.ProvidePlugin, [
      {
        _: "lodash"
      }
    ]);
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/var.scss";`
      }
    }
  }
};
