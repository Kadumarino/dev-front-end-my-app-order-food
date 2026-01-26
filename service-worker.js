const CACHE_NAME = 'kadu-lanches-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/entrega.html',
  '/pagamento.html',
  '/manifest.json',
  '/data/menu.json',
  '/src/styles/main.css',
  '/js/config.js',
  '/js/security.js',
  '/js/shared.js',
  '/js/notification.js',
  '/src/scripts/app.js',
  '/src/scripts/models/MenuItem.js',
  '/src/scripts/models/CartItem.js',
  '/src/scripts/models/User.js',
  '/src/scripts/models/Payment.js',
  '/src/scripts/services/MenuAPI.js',
  '/src/scripts/services/Store.js',
  '/src/scripts/controllers/MenuController.js',
  '/src/scripts/controllers/CartController.js'
];

self.addEventListener('install', event => {
  // Força ativação imediata do novo service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Remove caches antigos
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});