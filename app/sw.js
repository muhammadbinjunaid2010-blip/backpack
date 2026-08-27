/* ============================================================
   BACKPACK AIR — Service Worker (Offline-First)
   ============================================================ */

const CACHE_NAME = "backpack-air-v7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/store.js",
  "./js/ui.js",
  "./js/teacher.js",
  "./manifest.webmanifest",
  "./assets/brand-logo.png",
  "./assets/bahria-clg-logo.png",
  "./assets/math-10.pdf",
  "./assets/eng-10.pdf",
  "./assets/urd-10.pdf",
  "./assets/phy-10.pdf",
  "./assets/chem-10.pdf",
  "./assets/cs-10.pdf",
  "./assets/pst-part1.pdf",
  "./assets/pst-part2.pdf",
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
  // Handle both fetch and navigation requests (iframe src)
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

// Also handle navigation requests for iframe PDF loading
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate" || event.request.destination === "iframe") {
    var url = new URL(event.request.url);
    if (url.origin === self.location.origin && url.pathname.endsWith(".pdf")) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          return fetch(event.request).then(fetchResponse => {
            var responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return fetchResponse;
          });
        })
      );
    }
  }
});