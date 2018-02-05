const config = require('./const')

module.exports = {
  srcDir: __dirname,
  dev: true,
  /*
   ** Headers of the page
   */
  head: {
    title: '浪潮 - 渴望重回土地',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no', 'user-scalable': 'no' },
      { hid: 'description', name: 'description', content: '回想一下，你曾关注的社会事件中，有多少得到了妥善的解决？' },
      { hid: 't:card', name: 'twitter:card', content: 'summary' },
      { hid: 't:site', name: 'twitter:site', content: '@Wave2Land' },
      { hid: 't:title', name: 'twitter:title', content: '浪潮 - 渴望重回土地' },
      { hid: 't:description', name: 'twitter:description', content: '回想一下，你曾关注的社会事件中，有多少得到了妥善的解决？' },
      { hid: 't:image', name: 'twitter:image', content: 'https://assets.v2land.net/twitter-icon.png' },
      { hid: 'og:title', property: 'og:title', content: '浪潮 - 渴望重回土地' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:description', property: 'og:description', content: '回想一下，你曾关注的社会事件中，有多少得到了妥善的解决？' },
      { hid: 'og:image', name: 'og:image', content: 'https://assets.v2land.net/twitter-icon.png' },
      { hid: 'og:site_name', name: 'og:site_name', content: '浪潮' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    publicPath: config.publicPath
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
      '~/plugins/axios',
      '~/const'
    ]
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
    '~/static/element/step.css',
    '~/static/element/steps.css',
    '~/static/element/upload.css',
    '~/static/element/checkbox.css',
    '~/static/element/checkbox-group.css',
    '~/static/element/popover.css'
  ],

  plugins: [
    '~/plugins/element.js',
    '~/plugins/components.js',
    '~/plugins/clipboard.js',
    { src: '~/plugins/typekit', ssr: false }
  ],

  router: {
    middleware: 'auth',
    linkExactActiveClass: 'exact-active-link'
  },

  modules: [
    ['@nuxtjs/google-analytics', {
      id: config.ga
    }],
    '@nuxtjs/pwa'
  ],
  manifest: {
    name: '浪潮',
    short_name: '浪潮',
    lang: 'zh-CN',
    description: '浪潮 - 渴望重回土地',
    start_url: '/',
    background_color: '#1e8bc3',
    theme_color: '#1e8bc3',
    display: 'standalone',
    icons: [
      {
        src: '/icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
        density: '0.75'
      },
      {
        src: '/icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
        density: '1.0'
      },
      {
        src: '/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        density: '1.5'
      },
      {
        src: '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        density: '2.0'
      },
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        density: '3.0'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        density: '4.0'
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        density: '5.0'
      }
    ],
    version: {
      name: '0.0.1',
      code: '1'
    },
    plus: {
      distribute: {
        orientation: ['portrait-primary', 'portrait-secondary'],
        icons: {
          ios: {
            prerendered: true,
            auto: '512x512',
            iphone: {
              normal: '72x72',
              retina: '144x144',
              retina7: '144x144',
              retina8: '192x192'
            },
            ipad: {
              normal: '72x72',
              retina: '144x144',
              normal7: '72x72',
              retina7: '192x192'
            }
          },
          android: {
            mdpi: '48x48',
            ldpi: '48x48',
            hdpi: '72x72',
            xhdpi: '96x96',
            xxhdpi: '144x144'
          }
        }
      }
    }
  },
  workbox: {
    dev: process.env.NODE_ENV === 'development',
    importScripts: [
      'custom-sw.js'
    ],
    runtimeCaching: [{
      urlPattern: 'https://assets.v2land.net/.*',
      handler: 'cacheFirst',
      method: 'GET'
    }, {
      urlPattern: 'https://static.v2land.net/.*',
      handler: 'cacheFirst',
      method: 'GET'
    }]
  }
}
