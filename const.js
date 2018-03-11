const cdn = 'http://localhost:3000/';
const publicPath = cdn ? (cdn + '_nuxt/') : null;

module.exports = {
  baseUrl: 'http://localhost:3000/',
  api: 'https://api.langchao.org/',
  static: 'https://assets.v2land.net/',
  ga: 'UA-109441031-1', // Google Analytics
  typekit: 'zmq2epg',
  cdn,
  publicPath,
};
