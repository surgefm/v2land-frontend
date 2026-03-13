const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: ['server', 'both', 'browser'].includes(process.env.BUNDLE_ANALYZE),
});
const withPWA = require('next-pwa');

let nextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.surge.fm', 'cf-assets.www.cloudflare.com'],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/:username/:eventName/newsroom',
  //       destination: '/:username/:eventName?launch_newsroom=1',
  //       permanent: false,
  //     },
  //   ];
  // },
};

if (process.env.PWA === '1') {
  nextConfig = withPWA({
    ...nextConfig,
    pwa: {
      dest: 'public',
      exclude: [/^https:\/\/cdn\.surge\.fm\/.*/i],
    },
  });
}

module.exports = withBundleAnalyzer(nextConfig);
