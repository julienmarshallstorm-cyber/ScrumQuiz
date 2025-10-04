const CACHE_NAME = 'scrum-quiz-v5'; // Version erhöhen
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/quiz-data.js',
  './js/quiz-ui.js',
  './js/quiz-controller.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './manifest.json',
  './quiz-data/scrum-quiz.json'
];

// Install: Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: Cache first, dann Update im Hintergrund
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(error => {
        console.log('Netzwerk fehlgeschlagen, bleibe bei Cache:', error);
        return cachedResponse;
      });

      // Sofort Cache liefern, während Netzwerk läuft
      return cachedResponse || fetchPromise;
    })
  );
});

// Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
