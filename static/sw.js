importScripts('https://cdn.v2land.net/_nuxt/workbox.476439e0.js', 'custom-sw.js');

const workboxSW = new self.WorkboxSW({
  'cacheId': 'v2land-frontend',
  'clientsClaim': true,
  'directoryIndex': '/',
});

workboxSW.precache([
  {
    'url': 'https://cdn.v2land.net/_nuxt/app.986fd780ca4ce9e90a37.js',
    'revision': 'fdce68c09815b03b71e512962d249b0e',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/layouts/default.6ff0447bdc9efc8c4551.js',
    'revision': '4daf2b625464aa7c98b24733ad2aaf11',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/manifest.84e1fa8d317352c67aaf.js',
    'revision': 'ddff355418306715d6f5bbf96c49cecf',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/_name/admit.e023d3916f1c0e303a45.js',
    'revision': '28777f44ddc8e9eaae634c87e33cf14c',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/_name/edit/_id.d6224ad4abc8d30d0c0e.js',
    'revision': 'b463a6d9cb3c0965d939ef4bb9075ed9',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/_name/edit/image.f2339b90f4b490e96aa1.js',
    'revision': '4f51c0dfdb48154f1a1d94d6322030ba',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/_name/edit/index.6c2757625d62f61f9ca9.js',
    'revision': 'ecd93bcadaa02468bdfacb5667505c03',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/_name/index.93a718483bde11923f74.js',
    'revision': '9f6091b15b286d8dc7dbf1b1bd951c74',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/_name/post.0280fbb6a92296f304a2.js',
    'revision': '99d6a9b35ee9b0ca99e713fe74fb09be',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/about.3f18d54e7050e68377fc.js',
    'revision': '38af81adfd4dd801541a9abea87e8958',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/admin/event.d78b1a2749d846c0d2ba.js',
    'revision': 'f1b32098a039e38180f184bb67bf70fc',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/index.e39de5e3e4d617c6e59c.js',
    'revision': 'a79280db8ca90abf38c96d94d5120970',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/login/auth.af62d0bdfbb2596c4313.js',
    'revision': 'c59dc6d734e11bc3669475f62be35f4a',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/login/email.1a9a035a0ce4301455fc.js',
    'revision': '3178efc723d63ca93a3067de1e2de061',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/login/index.5c86c0776cbdc16ee721.js',
    'revision': '1a7d903d2239f1b7a826d6f59f66ce88',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/me.ae7734496e503bcd9045.js',
    'revision': '6d3ef44b1bfedc30f5c0336c68b88946',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/new.5b28f14befc1ecbfaec6.js',
    'revision': '9aa92892393042ac7844bf8736239a75',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/register.e39a3b10bb9dc03d566f.js',
    'revision': '2938d2b3ce309af9e7af81171732ebc1',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/pages/subscription.772d48f5030f583d21f9.js',
    'revision': '445e731ecf3c78ef559849bc63c1e026',
  },
  {
    'url': 'https://cdn.v2land.net/_nuxt/vendor.73d96c14750728b271a9.js',
    'revision': 'f1772e6f5ad307d64e29462d74b60b6f',
  },
]);


workboxSW.router.registerRoute(new RegExp('https://cdn.v2land.net/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET');

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET');

workboxSW.router.registerRoute(new RegExp('https://assets.v2land.net/.*'), workboxSW.strategies.cacheFirst({}), 'GET');

workboxSW.router.registerRoute(new RegExp('https://cdn.v2land.net/.*'), workboxSW.strategies.cacheFirst({}), 'GET');

