var cacheName = 'home-page';
var filesToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/favicon.ico',
  '/main.bundle.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }).then(() => {
      console.log('[ServiceWorker] Skip waiting on install');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Claiming clients for current page');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] SW is serving the asset: ' + event.request.url);
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(event.request).then(function (matching) {
        return matching || Promise.reject('no-match');
      });
    }).catch(fetch(event.request).then(function (response) {
      return response
    }))
  );
  event.waitUntil(caches.open(cacheName).then(function (cache) {
    return fetch(event.request).then(function (response) {
      return cache.put(event.request, response);
    });
  }));
});