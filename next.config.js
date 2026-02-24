const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: ['server', 'both', 'browser'].includes(process.env.BUNDLE_ANALYZE),
});
const withPWA = require('next-pwa');
const nextRuntimeDotenv = require('next-runtime-dotenv');

const withConfig = nextRuntimeDotenv({
  public: [
    'API_URL',
    'API_KEY',
    'CDN_URL',
    'SITE_URL',
    'SHORT_URL',
    'ALGOLIA_ID',
    'ALGOLIA_KEY',
    'NEXT_PUBLIC_GA_ID',
    'APPLE_CLIENT_ID',
    'VAPID_PUBLIC_KEY',
    'PWA',
  ],
});

let nextConfig = {
  serverRuntimeConfig: {
    API_URL_INTERNAL: process.env.API_URL_INTERNAL,
  },
  publicRuntimeConfig: {
    PROXY_MODE: process.env.PROXY_MODE,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    CDN_URL: process.env.CDN_URL,
    STATIC_PATH: process.env.STATIC_PATH,
    SITE_URL: process.env.SITE_URL,
    SHORT_URL: process.env.SHORT_URL,
    ALGOLIA_ID: process.env.ALGOLIA_ID,
    ALGOLIA_KEY: process.env.ALGOLIA_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.surge.fm'],
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

if (process.env.PWA === '1') {
  nextConfig = withPWA({
    ...nextConfig,
    pwa: { dest: 'public' },
  });
}

module.exports = withConfig(withBundleAnalyzer(nextConfig));
