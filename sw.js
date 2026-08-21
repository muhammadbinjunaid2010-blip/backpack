/* ============================================================
   BACKPACK AIR — Root Service Worker
   Makes the marketing site installable as the Backpack Air PWA
   (launches into /app/). Caches the marketing shell AND the app
   shell so the installed app works offline.
   NOTE: scope "/" takes over /app/, so the app's own sw.js no
   longer controls those pages — this worker provides their caching.
   ============================================================ */

const CACHE_NAME = "backpack-air-site-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/main.js",
  "./manifest.webmanifest",
  "./app/",
  "./app/index.html",
  "./app/css/style.css",
  "./app/js/app.js",
  "./app/manifest.webmanifest",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  "https://fonts.gstatic.com/s/plusjakartasan/v12/7v9IQLJiRfAPQtfTs3kphO3KVuGF1pA.woff2"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })))
  );
  self.clients.claim();
});

function networkFirst(req) {
  return fetch(req).then(function (res) {
    var clone = res.clone();
    caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
    return res;
  }).catch(function () {
    return caches.match(req).then(function (m) { return m || caches.match("./index.html"); });
  });
}

function staleWhileRevalidate(req) {
  return caches.match(req).then(function (cached) {
    var fetched = fetch(req).then(function (res) {
      var clone = res.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
      return res;
    }).catch(function () { return cached; });
    return cached || fetched;
  });
}

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);

  // Cross-origin (fonts, CDNs): network-first, fall back to cache.
  if (url.origin !== self.location.origin) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Pages + app navigations: network-first so new deploys show immediately.
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Same-origin assets (css/js/icons/pdf): stale-while-revalidate.
  event.respondWith(staleWhileRevalidate(event.request));
});
