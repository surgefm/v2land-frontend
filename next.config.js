const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withPWA = require('next-pwa');
const nextRuntimeDotenv = require('next-runtime-dotenv');

const withConfig = nextRuntimeDotenv({ public: ['API_URL', 'API_KEY', 'CDN_URL', 'SITE_URL'] });

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
  },
  pwa: {
    dest: 'public',
  },
};

const plugins = [[withCSS], [withSass], [withBundleAnalyzer]];
if (process.env.PWA === '1') plugins.push([withPWA]);

module.exports = withConfig(withPlugins(plugins, nextConfig));
