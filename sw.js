importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);
// Immediately activate new service workere
self.skipWaiting();
workbox.core.clientsClaim();
// we are not using bundler here, so we need to modify the revision each time we have an update.
// https://developer.chrome.com/docs/workbox/modules/workbox-precaching?hl=en
workbox.precaching.precacheAndRoute(
  [
    { url: './', revision: '1' },
    { url: './index.html', revision: '1' },
    { url: './style.css', revision: '1' },
    { url: './app.js', revision: '1' },
    { url: './offline.html', revision: '1' },
    { url: './share-handler.js', revision: '1' },
    { url: './icons/circle.svg', revision: '1' },
    { url: './icons/tire.svg', revision: '1' },
    { url: './icons/wheel.svg', revision: '1' },
    { url: './favicon.ico', revision: '1' },
    { url: './screenshots/main.png', revision: '1' },
    { url: './screenshots/main-mobile.png', revision: '1' },
    { url: './screenshots/about.png', revision: '1' },
    { url: './screenshots/about-mobile.png', revision: '1' },
    // Add more files as needed
  ],
  {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
  }
);
// Listen for SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
// Notify clients about updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          message: 'A new version of Cycle Tracker is available!',
        });
      });
    })
  );
});
// 1. Navigation requests (HTML pages)
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-assets', // Use a unique cache name
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
    cacheName: 'static-assets', // Use a unique cache name
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
