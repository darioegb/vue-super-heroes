/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';

const DAY_IN_MINUTES = 60 * 24;
const DAY_IN_SECONDS = DAY_IN_MINUTES * 60;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 30;
const YEAR_IN_SECONDS = DAY_IN_SECONDS * 365;
const API_REGEXP = /(https:\/\/|http:\/\/localhost)?([^\/\s]+\/)api\/.*/;

self.__WB_DISABLE_DEV_LOGS = true;

// Claiming control to start runtime caching asap
clientsClaim();

// Use to update the app after user triggered refresh
self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: YEAR_IN_SECONDS,
      }),
    ],
  }),
);

// You might want to use a stale-while-revalidate
// strategy for resources files that aren't precached.
registerRoute(
  /^https:\/\/firebasestorage\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: MONTH_IN_SECONDS,
        purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded.
      }),
    ],
  }),
);

// API with networkFirst strategy
registerRoute(API_REGEXP, new NetworkFirst());

// BACKGROUND SYNC
const bgSyncPlugin = new BackgroundSyncPlugin('superheroes', {
  maxRetentionTime: DAY_IN_MINUTES, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  API_REGEXP,
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST',
);

registerRoute(
  API_REGEXP,
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'DELETE',
);

registerRoute(
  API_REGEXP,
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'PUT',
);
