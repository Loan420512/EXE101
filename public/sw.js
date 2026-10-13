/**
 * ==============================================================================
 * FILE: public/sw.js
 * MỤC ĐÍCH: Service Worker hỗ trợ PWA và tra cứu ngoại tuyến (Offline Access)
 * ==============================================================================
 */

const CACHE_NAME = "ngucung-offline-v1";
const OFFLINE_URLS = [
  "/",
  "/luat-choi",
  "/ngu-hanh",
  "/choi-thu-ngay",
  "/manifest.json",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Chỉ cache các yêu cầu GET cùng domain (bỏ qua API & WebSocket)
  if (event.request.method !== "GET" || event.request.url.includes("/api/") || event.request.url.startsWith("ws")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Trả về cache và cập nhật ngầm (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline cho điều hướng HTML
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/luat-choi");
          }
        });
    })
  );
});
