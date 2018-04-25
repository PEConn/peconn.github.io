var cacheName = 'starterPWA-v2';
var files = [
  '/',
  '/favicon.ico',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/bulbasaur.png',
  '/images/charmander.png',
  '/images/squirtle.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching')
      cache.addAll(files);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
