// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const cacheName = 'cycletracker-v1';

// any changes to the listed files here will trigger an update message notification on the client
const precachedAssets = [
  './',
  './index.html',
  './about.html',
  './offline.html',
  './style.css',
  './app.js',
  './update-handler.js',
  './share-handler.js',
  './cycletracker.json',
  './icons/circle.svg',
  './icons/tire.svg',
  './icons/wheel.svg',
  './favicon.ico',
  './screenshots/main.png',
  './screenshots/main-mobile.png',
  './screenshots/about.png',
  './screenshots/about-mobile.png',
];

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
);

const offlineFallbackPage = 'offline.html';
//asdasd
self.addEventListener('install', (event) => {
  // Precache assets on install
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precachedAssets);
    })
  );
});

// Listen for SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
// Notify clients about updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key !== cacheName)
              .map((key) => caches.delete(key))
          )
        ),
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            message: 'A new version of Cycle Tracker is available!',
          });
        });
      }),
    ])
  );
});

// 1. Navigation requests (HTML pages)
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: cacheName,
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 50 })],
  })
);

// 2. Static assets (scripts, styles, images)
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: cacheName,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// Background sync
// use the Plugin that will automatically Queue up failed requests and retry them when future sync events are fired.
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
  'myQueueName',
  {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
  }
);

workbox.routing.registerRoute(
  /\/api\/.*\/*.json/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);
