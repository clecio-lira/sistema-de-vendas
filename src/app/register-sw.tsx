"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[v0] Service Worker registrado com sucesso:",
            registration.scope
          );
        })
        .catch((error) => {
          console.log("[v0] Falha ao registrar Service Worker:", error);
        });
    }
  }, []);

  return null;
}
