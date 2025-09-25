const CACHE_NAME = 'scrum-quiz-v4';
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

// Install Event
console.log('Service Worker geladen');
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app resources');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event - HIER WAR DER FEHLER!
self.addEventListener('fetch', event => {
  console.log('Fetching: ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});