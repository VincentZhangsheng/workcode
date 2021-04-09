module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/": {
        target: "http://192.168.220.163/material-management-service/",
        changeOrigin: true,
      },
    },
  },
  
  
  chainWebpack(config) {
    // set svg-sprite-loader
    // const oneOfsMap = config.module.rule('scss').oneOfs.store;
    // oneOfsMap.forEach(item => {
    //   item
    //     .use('sass-resources-loader')
    //     .loader('sass-resources-loader')
    //     .options({
    //       resources: ['./src/assets/styles/var.scss']
    //     })
    //     .end()
    // })
  }
};
