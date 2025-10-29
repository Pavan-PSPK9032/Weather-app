self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('weather-cache').then(cache => {
      return cache.addAll(['./', './index.html', './manifest.json']);
    })
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Don't cache API requests — fetch them fresh
  if (url.includes('api.openweathermap.org')) {
    e.respondWith(fetch(e.request).catch(() => new Response('')));
    return;
  }

  // Cache all other assets
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
