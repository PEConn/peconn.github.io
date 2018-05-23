var cacheName = 'starterPWA-v2';
var dir = '/starters';
var files = [
  '',
  'favicon.ico',
  'index.html',
  'scripts/app.js',
  'styles/inline.css',
  'images/bulbasaur.png',
  'images/charmander.png',
  'images/squirtle.png',
  'math-worker.js'
]

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching')
      return cache.addAll(files);
    })
  );
  console.log('[ServiceWorker] Cached');
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://peconn.github.io/starters/')
  );
});
