self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const rootWorkboxSuffix = `-${self.registration.scope}`;

    await Promise.all(
      cacheNames
        .filter((cacheName) => (
          cacheName.startsWith('workbox-') &&
          cacheName.endsWith(rootWorkboxSuffix)
        ))
        .map((cacheName) => caches.delete(cacheName))
    );

    await self.registration.unregister();

    const clients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: 'window',
    });

    await Promise.all(
      clients.map((client) => (
        'navigate' in client ? client.navigate(client.url) : undefined
      ))
    );
  })());
});
