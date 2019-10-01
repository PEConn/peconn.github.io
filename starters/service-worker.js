var cacheName = 'starterPWA-v2';
var dir = '/starters';
var files = [
  '',
  'favicon.ico',
  'index.html',
  'scripts/app.js',
  'scripts/material.min.js',
  'styles/inline.css',
  'styles/material.light_blue-blue.min.css',
  'images/bulbasaur.png',
  'images/charmander.png',
  'images/squirtle.png',
  'math-worker.js',
]


  // <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.light_blue-blue.min.css" />
  // <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

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

self.addEventListener('fetch', async function(event) {
  console.log('[ServiceWorker] Fetching ', event.request.url);

  event.respondWith(async function() {

    const cachePromise = caches.open(cacheName);
    const responsePromise = fetch(event.request);

    const cache = await cachePromise;
    try {
      const response = await responsePromise;
      console.log("[ServiceWorker] Fetch successful.");
      cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      console.log("[ServiceWorker] Fetch failed, returning cached response.");
      // Could not connect to the internet.
      // Return cached response.
      const cached = await cache.match(event.request);
      if (cached == undefined) {
        // What can we do - 404!
        console.log("Not in cache :-(");
        return Promise.reject("Not cached.");
      }
      console.log("In cache!");
      return cached;
      // console.log(error);
    }
  }());
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked.');
  event.notification.close();

  const target =
    new URL(event.notification.data.url);

  event.waitUntil(async function() {
    const clientWindows = await clients.matchAll({type: 'window'});

    for (const client of clientWindows) {
      const current = new URL(client.url);

      if (!client.focus) continue;

      if (target.pathname !== current.pathname) continue;

      console.log('[Service Worker] Focusing.');
      // Does getting the new client matter?
      const newClient = await client.focus();

      if (target.toString() !== current.toString()) {
        console.log('[Service Worker] Navigating.');
        await newClient.navigate(target.toString());
      }

      return;
    }

    if (clients.openWindow) {
      console.log("[Service Worker] Opening Window.");
      await clients.openWindow(target.toString());
    }
  }());
});
