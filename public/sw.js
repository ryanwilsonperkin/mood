/// Service Worker for Mood PWA
/// Handles: offline caching for the app shell

const CACHE_NAME = 'mood-v1';

function getBasePath() {
  const pathname = new URL(self.registration.scope).pathname;
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function asset(path) {
  const base = getBasePath();
  return `${base}${path}`;
}

function getAssets() {
  return [
    asset('/'),
    asset('/index.html'),
    asset('/icon.svg'),
    asset('/icon-192.svg'),
    asset('/icon-512.svg'),
    asset('/manifest.json'),
  ];
}

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(getAssets())));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match(asset('/index.html'))));
    return;
  }

  e.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
