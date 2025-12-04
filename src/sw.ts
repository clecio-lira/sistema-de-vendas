/// <reference lib="webworker" />

import { Serwist, NetworkFirst } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: any;
};

/* -------------------
   PRECACHE
--------------------- */
const serwist = new Serwist({
  precacheEntries: [
    ...(self.__SW_MANIFEST || []),
    { url: "/", revision: "1" },
    { url: "/historico", revision: "1" },
  ],
  skipWaiting: true,
  clientsClaim: true,
});

serwist.addEventListeners();

/* ---------------------------
   FALLBACK PARA OFFLINE
----------------------------- */
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // tenta carregar normalmente
          return await fetch(event.request);
        } catch {
          // tenta pegar offline.html no cache
          const cached = await caches.match("/offline.html");

          if (cached) return cached;

          // fallback FINAL que SEMPRE retorna uma Response válida
          return new Response("<h1>Offline</h1>", {
            headers: { "Content-Type": "text/html" },
          });
        }
      })()
    );
  }
});
