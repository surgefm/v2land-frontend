const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: ['server', 'both', 'browser'].includes(process.env.BUNDLE_ANALYZE),
});
const withPWA = require('next-pwa');

let nextConfig = {
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

module.exports = withBundleAnalyzer(nextConfig);
