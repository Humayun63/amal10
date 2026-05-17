const CACHE = "amal-v2";

// App shell — pages to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/leaderboard",
  "/insights",
  "/profile",
  "/notifications",
  "/sign-in",
  "/manifest.json",
  "/logo.png",
  "/icon-192.png",
  "/icon-72.png",
  "/icon.png",
];

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => c.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: delete caches from old versions ─────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: per-resource caching strategies ────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip: Supabase API, Google OAuth, external APIs (aladhan, youtube, etc.)
  // These fail gracefully in the app when offline — don't try to cache them.
  const isExternal = url.origin !== self.location.origin;
  const isFont =
    url.hostname === "fonts.gstatic.com" ||
    url.hostname === "fonts.googleapis.com";

  if (isExternal && !isFont) return;

  // Next.js immutable static assets (hashed filenames) — cache-first forever
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.match(request).then((cached) => cached ?? fetchAndCache(request))
    );
    return;
  }

  // Google Fonts — cache-first (they use long-lived cache headers anyway)
  if (isFont) {
    e.respondWith(
      caches.match(request).then((cached) => cached ?? fetchAndCache(request))
    );
    return;
  }

  // Static public files (images, manifest, icons) — cache-first
  if (
    url.pathname.startsWith("/_next/image") ||
    /\.(png|jpg|jpeg|webp|svg|ico|woff2?|ttf)$/.test(url.pathname)
  ) {
    e.respondWith(
      caches.match(request).then((cached) => cached ?? fetchAndCache(request))
    );
    return;
  }

  // HTML page navigations — network-first, fall back to cached shell
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          putInCache(request, res.clone());
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          // Fallback: try the dashboard shell (user data is in localStorage)
          const dash = await caches.match("/dashboard");
          return dash ?? caches.match("/");
        })
    );
    return;
  }

  // Everything else same-origin — stale-while-revalidate
  e.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetchAndCache(request).catch(() => cached);
      return cached ?? fresh;
    })
  );
});

// ── Helpers ───────────────────────────────────────────────────────────────────
async function fetchAndCache(request) {
  const res = await fetch(request);
  if (res.ok) putInCache(request, res.clone());
  return res;
}

async function putInCache(request, response) {
  const c = await caches.open(CACHE);
  await c.put(request, response);
}

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow("/dashboard");
      })
  );
});
