const CACHE_NAME = 'smeltzer-cache-v1';
const PREFETCH_URLS = [
    '/',
    '/css/styles.css'
];

self.addEventListener('install', function(event) {
    console.log('install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("Opened cache");
                return cache.addAll(PREFETCH_URLS);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});