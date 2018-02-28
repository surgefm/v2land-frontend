const config = require('./const');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '浪潮 - 你的社会事件追踪工具',
    meta: [
      { charset: 'utf-8' },
      { 'name': 'viewport', 'content': 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no', 'user-scalable': 'no' },
      { name: 'lang', property: 'lang', content: 'zh-hans' },
      { name: 'keywords', content: '浪潮,社会事件,事件,中国,追踪,社会,关注' },
      { hid: 'description', name: 'description', content: '浪潮是一个社会事件追踪工具。我们帮助你跟进社会事件的最新动态。你也可参与到信息整合的过程中，与社区成员一起添加社会事件与相关资讯，协助他人追踪事件进展。' },
      { hid: 't:card', name: 'twitter:card', content: 'summary' },
      { hid: 't:site', name: 'twitter:site', content: '@Wave2Land' },
      { hid: 't:title', name: 'twitter:title', content: '浪潮 - 渴望重回土地' },
      { hid: 't:description', name: 'twitter:description', content: '浪潮是一个社会事件追踪工具。我们帮助你跟进社会事件的最新动态。你也可参与到信息整合的过程中，与社区成员一起添加社会事件与相关资讯，协助他人追踪事件进展。' },
      { hid: 't:image', name: 'twitter:image', content: 'https://assets.v2land.net/twitter-icon.png' },
      { hid: 'og:title', property: 'og:title', content: '浪潮 - 渴望重回土地' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:description', property: 'og:description', content: '浪潮是一个社会事件追踪工具。我们帮助你跟进社会事件的最新动态。你也可参与到信息整合的过程中，与社区成员一起添加社会事件与相关资讯，协助他人追踪事件进展。' },
      { hid: 'og:image', name: 'og:image', content: 'https://assets.v2land.net/twitter-icon.png' },
      { hid: 'og:site_name', name: 'og:site_name', content: '浪潮' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#19B5FE' },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
    vendor: [
      'postman-url-encoder',
      'js-cookie',
      '~/const',
    ],
    publicPath: config.publicPath,
  },

  css: [
    '~/assets/common.scss',
    '~/assets/EventAction.scss',
    '~/assets/editor.scss',
    '~/assets/icon.css',
    '~/static/element/tooltip.css',
    '~/static/element/base.css',
    '~/static/element/icon.css',
    '~/static/element/form.css',
    '~/static/element/form-item.css',
    '~/static/element/col.css',
    '~/static/element/input.css',
    '~/static/element/input-number.css',
    '~/static/element/select.css',
    '~/static/element/select-dropdown.css',
    '~/static/element/button.css',
    '~/static/element/button-group.css',
    '~/static/element/date-picker.css',
    '~/static/element/time-picker.css',
    '~/static/element/time-select.css',
    '~/static/element/spinner.css',
    '~/static/element/scrollbar.css',
    '~/static/element/message.css',
    '~/static/element/upload.css',
    '~/static/element/checkbox.css',
    '~/static/element/checkbox-group.css',
    '~/static/element/popover.css',
    '~/static/element/dropdown.css',
    '~/static/element/dropdown-menu.css',
    '~/static/element/dropdown-item.css',
    '~/static/element/dialog.css',
    '~/static/element/loading.css',
  ],

  plugins: [
    '~/plugins/element.js',
    '~/plugins/components.js',
    '~/plugins/clipboard.js',
    { src: '~/plugins/statusHandler', ssr: false },
    { src: '~/plugins/ga', ssr: false },
    { src: '~/plugins/typekit', ssr: false },
  ],

  router: {
    middleware: ['auth', 'permission'],
    linkExactActiveClass: 'exact-active-link',
  },

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: config.api,
    credentials: true,
  },
};
