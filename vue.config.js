module.exports = {
  devServer: {
    public: 'localhost:8080',
  },
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "PumGall Tool";
        return args;
      });
    config
      .plugin('copy')
      .tap(([options]) => {
        options[0].ignore.push('assets/.git/**/*', 'assets/.gitattributes');
        return [options]
      });
  }
}
