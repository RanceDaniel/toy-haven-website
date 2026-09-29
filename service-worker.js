const CACHE_NAME = "toy-haven-simple-v4";

const APP_FILES = [
  "./",
  "./index.html",
  "./products.html",
  "./cart.html",
  "./checkout.html",
  "./wishlist.html",
  "./support.html",
  "./css/style.css",
  "./js/products.js",
  "./js/app.js",
  "./manifest.json",
  "./assets/favicon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/figurine-hero.jpg",
  "./assets/figurine-collection.jpg",
  "./assets/figurine-display.jpg",
  "./assets/toy-blocks-orange.jpg",
  "./assets/toy-blocks-colour.jpg",
  "./assets/toy-blocks-child.jpg",
  "./assets/board-dice.jpg",
  "./assets/board-strategy.jpg",
  "./assets/board-pawns.jpg",
  "./assets/car-beach.jpg",
  "./assets/car-classic.jpg",
  "./assets/car-offroad.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (savedResponse) {
      if (savedResponse) {
        return savedResponse;
      }

      return fetch(event.request).then(function (networkResponse) {
        const responseCopy = networkResponse.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseCopy);
        });

        return networkResponse;
      });
    })
  );
});
