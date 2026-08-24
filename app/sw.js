/* ============================================================
   BACKPACK AIR — Service Worker (Offline-First)
   ============================================================ */

const CACHE_NAME = "backpack-air-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/store.js",
  "./manifest.webmanifest",
  "./math-10.pdf",
  "./eng-10.pdf",
  "./urd-10.pdf",
  "./phy-10.pdf",
  "./chem-10.pdf",
  "./cs-10.pdf",
  "./pst-10.pdf",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  "https://fonts.gstatic.com/s/plusjakartasan/v12/7v9IQLJiRfAPQtfTs3kphO3KVuGF1pA.woff2"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  var url = new URL(event.request.url);

  // For cross-origin requests (fonts, CDN), use network-first
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request).then(response => {
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // For same-origin requests, use cache-first for app shell
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(fetchResponse => {
        var responseClone = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return fetchResponse;
      });
    })
  );
});