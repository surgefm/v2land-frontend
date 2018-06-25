const cdn = 'https://langchao.org/';
// const cdn = 'https://cdn.v2land.net/';
const publicPath = cdn ? (cdn + '_nuxt/') : null;

module.exports = {
  baseUrl: 'https://langchao.org/',
  api: 'https://langchao.org/api/',
  static: 'https://assets.v2land.net/',
  ga: 'UA-109441031-1', // Google Analytics
  typekit: 'zmq2epg',
  justfont: '54014',
  cdn,
  publicPath,
};

