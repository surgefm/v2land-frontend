console.log('custom service worker!');

self.addEventListener('install', function(event) {
  console.log('install event:', event);
});
self.addEventListener('activate', function(event) {
  console.log('activate event:', event);
});
self.addEventListener('fetch', function(event) {
  console.log('fetch event', event);
});
