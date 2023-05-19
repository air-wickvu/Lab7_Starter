// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

// List of URLs to cache
const RECIPE_URLS = [
    'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
    'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
    'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
    'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
  ];


// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Add all of the URLs from RECIPE_URLs to the cache when the ServiceWorker is installed
      return cache.addAll(RECIPE_URLs);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // Respond to the event by opening the cache using the name we gave above (CACHE_NAME)
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      // Check if the request is in the cache
      return cache.match(event.request).then(function (response) {
        // If the request is found in the cache, return the cached version
        if (response) {
          return response;
        }
        
        // If the request is not in the cache, fetch the resource
        return fetch(event.request).then(function (networkResponse) {
          // Clone the response to use it both in the cache and to return the network response
          var clonedResponse = networkResponse.clone();
          
          // Add the fetched resource to the cache
          cache.put(event.request, clonedResponse);
          
          // Return the network response
          return networkResponse;
        });
      });
    })
  );
});

