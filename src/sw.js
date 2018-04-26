importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js')

if (workbox) {
    workbox.precaching.precacheAndRoute([])

    workbox.routing.registerRoute(
        /(.*)\.(?:png|svg|jpg|jpeg|gif)/,
        workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60
                })
            ]
        })
    )

    const testHandler = workbox.strategies.networkFirst({
        cacheName: 'test-pages',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 10
            })
        ]
    })

    workbox.routing.registerRoute(/tests\/(.*)\.html/, args => {
        return testHandler.handle(args)
                    .then(response => {
                        if (!response) {
                            return caches.match('pages/offline.html')
                        } else if (response.status === 404) {
                            return caches.match('pages/404.html')
                        }
                        return response
                    })
    })
} else {
    console.warn('Workbox failed to load')
}