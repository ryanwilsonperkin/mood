/// Service Worker for Mood PWA
/// Handles: offline caching, daily notification reminders

const CACHE_NAME = 'mood-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  '/manifest.json',
];

// Install: cache shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
  } else {
    e.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

// Notification scheduling via messages from the app
let notificationTimer = null;

function scheduleNotification(hour, minute) {
  if (notificationTimer) clearTimeout(notificationTimer);

  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  // If the time already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  notificationTimer = setTimeout(() => {
    self.registration.showNotification('Mood Check-in', {
      body: 'How are you feeling today? Tap to log your mood.',
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag: 'mood-reminder',
      renotify: true,
      actions: [{ action: 'log', title: 'Log Mood' }],
    });
    // Reschedule for tomorrow
    scheduleNotification(hour, minute);
  }, delay);
}

self.addEventListener('message', (e) => {
  const { type, hour, minute } = e.data || {};
  if (type === 'SCHEDULE_NOTIFICATION') {
    scheduleNotification(hour, minute);
  }
  if (type === 'CANCEL_NOTIFICATION') {
    if (notificationTimer) clearTimeout(notificationTimer);
    notificationTimer = null;
  }
});

// Handle notification click
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('/') && 'focus' in client) {
          client.navigate('/#/today');
          return client.focus();
        }
      }
      return self.clients.openWindow('/#/today');
    })
  );
});
