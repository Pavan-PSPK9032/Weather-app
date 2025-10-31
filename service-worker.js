const CACHE_NAME = 'weather-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // add your icon paths here if you include them in manifest
];

// Install: cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', event => {
  const req = event.request;
  // only handle GET
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then(res => {
      // optional: update cache for static assets
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
  );
});

// Optional: show notifications from SW (if you decide to postMessages to SW)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // focus or open app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
