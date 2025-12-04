const CACHE_NAME = "vendas-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/historico",
  "/manifest.json",
  "/icon-light-32x32.png",
  "/icon-dark-32x32.png",
  "/icon.svg",
  "/apple-icon.png",
];

// Instala o service worker e faz cache dos assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa o service worker e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições e serve do cache quando offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se disponível
      if (response) {
        return response;
      }

      // Tenta buscar da rede
      return fetch(event.request)
        .then((response) => {
          // Não faz cache de requisições inválidas
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }

          // Clona a resposta
          const responseToCache = response.clone();

          // Adiciona ao cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Se falhar, retorna página offline para navegação
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
    })
  );
});
