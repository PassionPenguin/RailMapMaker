const CACHE_NAME = 'railmapmaker-cache-v1';
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/assets/mipmap/icon@192.png',
    '/assets/mipmap/icon@512.png',
    '/assets/mipmap/icon@1024.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    event.respondWith(
        caches
            .match(request, { ignoreSearch: true })
            .then((cached) => cached || fetch(request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                return response;
            }))
            .catch(() => caches.match('/index.html'))
    );
});