const CACHE_NAME = 'scrum-quiz-v4'; // Version erhöhen
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // IMMER vom Netzwerk fetchen und Cache updaten
        const fetchRequest = fetch(event.request).then(networkResponse => {
          // Cache mit neuer Response updaten
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });

        // Fallback: Cache wenn Netzwerk fehlschlägt
        return response || fetchRequest;
      })
  );
});

// Cache bei Aktivierung löschen
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