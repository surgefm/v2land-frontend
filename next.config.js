const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withPWA = require('next-pwa');
const nextRuntimeDotenv = require('next-runtime-dotenv');

const withConfig = nextRuntimeDotenv({
  public: [
    'API_URL',
    'API_KEY',
    'CDN_URL',
    'SITE_URL',
    'ALGOLIA_ID',
    'ALGOLIA_KEY',
    'NEXT_PUBLIC_GA_ID',
    'APPLE_CLIENT_ID',
  ],
});

const nextConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  publicRuntimeConfig: {
    PROXY_MODE: process.env.PROXY_MODE,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    CDN_URL: process.env.CDN_URL,
    STATIC_PATH: process.env.STATIC_PATH,
    SITE_URL: process.env.SITE_URL,
    ALGOLIA_ID: process.env.ALGOLIA_ID,
    ALGOLIA_KEY: process.env.ALGOLIA_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  },
  pwa: {
    dest: 'public',
  },
  images: {
    domains: ['cdn.surge.fm'],
  },
  cssModules: true,
  cssLoaderOptions: { importLoaders: 1, localIdentName: '[local]___[hash:base64:5]' },
  // lessLoaderOptions: {
  //   javascriptEnabled: true,
  // },
  webpack(config) {
    config.module.rules.forEach(rule => {
      if (String(rule.test) === String(/\.css$/)) {
        rule.use.forEach(u => {
          if (u.options) {
            // eslint-disable-next-line no-param-reassign
            u.options.modules = false;
          }
        });
      }
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/:username/:eventName/newsroom',
        destination: '/:username/:eventName?launch_newsroom=1',
        permanent: false,
      },
    ];
  },
};

const plugins = [[withBundleAnalyzer]];
if (process.env.PWA === '1') plugins.push([withPWA]);

module.exports = withConfig(withPlugins(plugins, nextConfig));
