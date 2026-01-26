const CACHE_NAME = 'kadu-lanches-v14';
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
  '/js/notification.js',
  '/src/scripts/models/MenuItem.js',
  '/src/scripts/models/CartItem.js',
  '/src/scripts/models/User.js',
  '/src/scripts/models/Payment.js',
  '/src/scripts/services/MenuAPI.js',
  '/src/scripts/services/Store.js'
];

// Arquivos críticos que devem sempre buscar da rede primeiro
const networkFirstUrls = [
  '/js/shared.js',
  '/src/scripts/app.js',
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
  const url = new URL(event.request.url);
  
  // Network-first para arquivos críticos (sempre busca da rede)
  if (networkFirstUrls.some(path => url.pathname.endsWith(path))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Salva no cache após buscar
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se falhar, tenta do cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first para outros arquivos (busca do cache primeiro)
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});