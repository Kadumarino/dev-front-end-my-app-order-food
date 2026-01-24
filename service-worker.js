const CACHE_NAME = 'kadu-lanches-v1';
const urlsToCache = [
  '/',
  '/visual-lanche.html',
  '/estilizacao-lanche.css',
  '/interacao-lanche.js',
  '/manifest.json'
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
      .then(response => response || fetch(event.request))
  );
});