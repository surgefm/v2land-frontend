const OptimizeCSSClassnamesPlugin = require('optimize-css-classnames-plugin')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '浪潮 - 渴望重回土地',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
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
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: [
      'postman-url-encoder',
      'cookie',
      '~/plugins/axios'
    ]
  },

  css: [
    '~/assets/common.scss',
    '~/assets/EventAction.scss',
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
    '~/static/element/checkbox.css',
    '~/static/element/checkbox-button.css',
    '~/static/element/checkbox-group.css',
    '~/static/element/radio.css',
    '~/static/element/radio-button.css',
    '~/static/element/radio-group.css',
    '~/static/element/button.css',
    '~/static/element/button-group.css',
    '~/static/element/date-picker.css',
    '~/static/element/time-picker.css',
    '~/static/element/time-select.css',
    '~/static/element/spinner.css',
    '~/static/element/scrollbar.css',
    '~/static/element/message.css',
    '~/static/element/step.css',
    '~/static/element/steps.css'
  ],

  plugins: [
    '~/plugins/element.js',
    '~/plugins/components.js'
  ],

  router: {
    middleware: 'auth',
    linkExactActiveClass: 'exact-active-link'
  }
}
