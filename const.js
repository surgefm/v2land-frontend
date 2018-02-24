module.exports = {
  baseUrl: process.env.BASE_URL || 'https://langchao.co/',
  api: process.env.API || 'https://a.langchao.co/',
  static: process.env.STATIC || 'https://assets.v2land.net/',
  ga: process.env.GA || 'UA-109441031-1', // Google Analytics
  typekit: 'zmq2epg',
  publicPath: process.env.PUBLIC_PATH
}
