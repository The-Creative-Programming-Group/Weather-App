if (!self.define) {
  let e;
  const s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        const e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[n]) return;
    const t = {};
    const r = (e) => a(e, n);
    const d = { module: { uri: n }, exports: t, require: r };
    s[n] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-8637ed29"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/bKVph76FGnBo86vwv9KdD/_buildManifest.js",
          revision: "88bf93f8a0ca8b3434ddcaff7f17bf6b",
        },
        {
          url: "/_next/static/bKVph76FGnBo86vwv9KdD/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/01e5311c.7fb425ba31fa3acd.js",
          revision: "7fb425ba31fa3acd",
        },
        {
          url: "/_next/static/chunks/04020a7d-fad95ac383da7cbf.js",
          revision: "fad95ac383da7cbf",
        },
        {
          url: "/_next/static/chunks/106-8510afa0b7f8bfc6.js",
          revision: "8510afa0b7f8bfc6",
        },
        {
          url: "/_next/static/chunks/195-3995303a3274c296.js",
          revision: "3995303a3274c296",
        },
        {
          url: "/_next/static/chunks/28ea6197-6a8e4e29c877cd13.js",
          revision: "6a8e4e29c877cd13",
        },
        {
          url: "/_next/static/chunks/317-70ec80c103bb5087.js",
          revision: "70ec80c103bb5087",
        },
        {
          url: "/_next/static/chunks/32-ac9babd05b62f779.js",
          revision: "ac9babd05b62f779",
        },
        {
          url: "/_next/static/chunks/334-737f2e798b8c4e5e.js",
          revision: "737f2e798b8c4e5e",
        },
        {
          url: "/_next/static/chunks/41f07460-9c0ccd315d6b7033.js",
          revision: "9c0ccd315d6b7033",
        },
        {
          url: "/_next/static/chunks/435-b1f560fd717f0c7f.js",
          revision: "b1f560fd717f0c7f",
        },
        {
          url: "/_next/static/chunks/492.01af8b66a0a8d4f9.js",
          revision: "01af8b66a0a8d4f9",
        },
        {
          url: "/_next/static/chunks/6c86d9ce-c6e20cd9ff1cc260.js",
          revision: "c6e20cd9ff1cc260",
        },
        {
          url: "/_next/static/chunks/75-1f0d6fc79fe0602d.js",
          revision: "1f0d6fc79fe0602d",
        },
        {
          url: "/_next/static/chunks/874-8594ba70118859fd.js",
          revision: "8594ba70118859fd",
        },
        {
          url: "/_next/static/chunks/8ab94a71-41cadbd1a53cfe54.js",
          revision: "41cadbd1a53cfe54",
        },
        {
          url: "/_next/static/chunks/d1535de0-4b6afd62900d349d.js",
          revision: "4b6afd62900d349d",
        },
        {
          url: "/_next/static/chunks/f5a6ad6d-c05e03f51ba8b81c.js",
          revision: "c05e03f51ba8b81c",
        },
        {
          url: "/_next/static/chunks/f62271c4-4667762cf4d353b3.js",
          revision: "4667762cf4d353b3",
        },
        {
          url: "/_next/static/chunks/framework-6d147d7a7a824486.js",
          revision: "6d147d7a7a824486",
        },
        {
          url: "/_next/static/chunks/main-a06aedcdcc142221.js",
          revision: "a06aedcdcc142221",
        },
        {
          url: "/_next/static/chunks/pages/_app-8c5c7df89e295e95.js",
          revision: "8c5c7df89e295e95",
        },
        {
          url: "/_next/static/chunks/pages/_error-1f1fe04050307815.js",
          revision: "1f1fe04050307815",
        },
        {
          url: "/_next/static/chunks/pages/contact-2d8e0e60d449fc2d.js",
          revision: "2d8e0e60d449fc2d",
        },
        {
          url: "/_next/static/chunks/pages/contributors-8c164e6d5e023579.js",
          revision: "8c164e6d5e023579",
        },
        {
          url: "/_next/static/chunks/pages/home-3c4ac4d7bbe78c65.js",
          revision: "3c4ac4d7bbe78c65",
        },
        {
          url: "/_next/static/chunks/pages/index-51922d1f87755498.js",
          revision: "51922d1f87755498",
        },
        {
          url: "/_next/static/chunks/pages/legal-e191181a4e36faab.js",
          revision: "e191181a4e36faab",
        },
        {
          url: "/_next/static/chunks/pages/locationsettings-0e44fdbc05744a06.js",
          revision: "0e44fdbc05744a06",
        },
        {
          url: "/_next/static/chunks/pages/search-08888849397b9ad9.js",
          revision: "08888849397b9ad9",
        },
        {
          url: "/_next/static/chunks/pages/settings-aae484246f05d118.js",
          revision: "aae484246f05d118",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-7675afb91c17a5b7.js",
          revision: "7675afb91c17a5b7",
        },
        {
          url: "/_next/static/css/431944509084d071.css",
          revision: "431944509084d071",
        },
        {
          url: "/_next/static/css/56639707b78da0b0.css",
          revision: "56639707b78da0b0",
        },
        {
          url: "/_next/static/css/63516b7b0d9e3452.css",
          revision: "63516b7b0d9e3452",
        },
        {
          url: "/_next/static/css/c9334b00fd5763bd.css",
          revision: "c9334b00fd5763bd",
        },
        {
          url: "/_next/static/media/05a31a2ca4975f99-s.woff2",
          revision: "f1b44860c66554b91f3b1c81556f73ca",
        },
        {
          url: "/_next/static/media/513657b02c5c193f-s.woff2",
          revision: "c4eb7f37bc4206c901ab08601f21f0f2",
        },
        {
          url: "/_next/static/media/51ed15f9841b9f9d-s.woff2",
          revision: "bb9d99fb9bbc695be80777ca2c1c2bee",
        },
        {
          url: "/_next/static/media/background.7454e9f4.png",
          revision: "6d7f98f0fb3db09b7861c9eb90214629",
        },
        {
          url: "/_next/static/media/c9a5bc6a7c948fb0-s.woff2",
          revision: "74c3556b9dad12fb76f84af53ba69410",
        },
        {
          url: "/_next/static/media/d6b16ce4a6175f26-s.p.woff2",
          revision: "dd930bafc6297347be3213f22cc53d3e",
        },
        {
          url: "/_next/static/media/dicsiluks-profile.7a37bad1.webp",
          revision: "b7dc4fd12e0df0cc55ba639ab7edebfc",
        },
        {
          url: "/_next/static/media/ec159349637c90ad-s.woff2",
          revision: "0e89df9522084290e01e4127495fae99",
        },
        {
          url: "/_next/static/media/fabius-profile.4044c180.jpg",
          revision: "031020eab4827a4305a682b3d8309629",
        },
        {
          url: "/_next/static/media/fd4db3eb5472fc27-s.woff2",
          revision: "71f3fcaf22131c3368d9ec28ef839831",
        },
        {
          url: "/_next/static/media/jake-profile.28a0871c.png",
          revision: "93eb5b12aef9768c141b0f7d6b145d04",
        },
        {
          url: "/_next/static/media/jakob-profile.aea41612.webp",
          revision: "77a50922ea3903621c0472beaf28be8f",
        },
        {
          url: "/_next/static/media/layers-2x.9859cd12.png",
          revision: "9859cd12",
        },
        {
          url: "/_next/static/media/layers.ef6db872.png",
          revision: "ef6db872",
        },
        {
          url: "/_next/static/media/marker-icon-2x.93fdb12c.png",
          revision: "93fdb12c",
        },
        {
          url: "/_next/static/media/marker-icon.d577052a.png",
          revision: "d577052a",
        },
        {
          url: "/_next/static/media/marker-shadow.612e3b52.png",
          revision: "612e3b52",
        },
        {
          url: "/_next/static/media/search1.511e3039.png",
          revision: "e85365c385adea18644361d84b2ef939",
        },
        {
          url: "/_next/static/media/search2.0fe129ee.png",
          revision: "9593cf5d0ad350d7f6ab04aef130631a",
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && e.type === "opaqueredirect"
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        e.headers.get("RSC") === "1" &&
        e.headers.get("Next-Router-Prefetch") === "1" &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        e.headers.get("RSC") === "1" && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
