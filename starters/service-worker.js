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

self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] Fetch', event.request.url);

  event.respondWith(
    caches.open(cacheName).then(cache => {
      return fetch(event.request).then(
        response => {
          console.log("Hitting network.");
          // Cache the new version of the page.
          cache.put(event.request, response.clone());
          return response;
        },
        error => {
          console.log("Hitting cache.");
          return cache.match(event.request);
        }
      );
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
