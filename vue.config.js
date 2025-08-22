const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: '/me-just-me-blog/',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Me, Just Me';
      return args;
    });
  },
});
