// Service Worker otimizado para melhor performance do site
const CACHE_NAME = "baltazar-parra-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/App.css",
  "/src/index.css",
  "/smile.glb",
  "/icons/favicon.svg",
  "/og.jpg"
];

// Instalação e pré-cache dos recursos essenciais
self.addEventListener("install", (event) => {
  // Force waiting service worker to become active
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching essential resources");
      return cache.addAll(urlsToCache);
    })
  );
});

// Estratégia de cache: Network First com fallback para cache
self.addEventListener("fetch", (event) => {
  // Apenas interceptar requisições HTTP/HTTPS
  if (!event.request.url.startsWith("http")) return;

  // Requisições de API não são cacheadas
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a resposta da rede for válida, atualiza o cache
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          // Clone a resposta para poder usá-la e armazená-la no cache
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      })
      .catch(() => {
        // Se falhar a requisição de rede, tenta buscar do cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // Se não encontrar no cache e for uma página HTML, retorna a página inicial
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/");
          }

          // Se não for uma página HTML e não estiver no cache, lança um erro
          return new Response("Offline - Conteúdo não disponível", {
            status: 503,
            statusText: "Service Unavailable"
          });
        });
      })
  );
});

// Limpeza de caches antigos e notificação ao cliente
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  // Torna o service worker ativo em todas as abas abertas sem necessidade de recarregar
  self.clients.claim();

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Notifica todas as páginas abertas que o site foi atualizado
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "CACHE_UPDATED",
              message: "Site atualizado para a versão mais recente!"
            });
          });
        });
      })
  );
});
