const CACHE_NAME = 'v1';


self.addEventListener('install', e => {
    console.log('installed');
});

self.addEventListener('activate', e => {
    console.log('registered');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache != CACHE_NAME){
                        console.log('clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
        .then(response => {
            const responseClone = response.clone();
            caches
            .open(CACHE_NAME)
            .then(cache =>{
                cache.put(e.request, responseClone);
            });
            return response;
        }).catch(err => caches.match(e.request).then(response => response))
    );
});