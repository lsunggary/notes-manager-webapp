module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: '/'
  // chainWebpack: config => {
  //   config.module
  //     .rule('zepto')
  //     .test(require.resolve('zepto'))
  //     .use('exports-loader?window.Zepto!script-loader')
  //       .loader('exports-loader?window.Zepto!script-loader')
  //       .end()
  // }
}
