var CACHE = 'cache-and-update-bucket';

// On install, cache some resources.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  // You can use `respondWith()` to answer immediately, without waiting for the
  // network response to reach the service worker...
  if (doNotCache(evt.request)) {
  	//console.log(evt.request);
  	evt.respondWith(fetch(evt.request))
  } else {
  	evt.respondWith(fromCache(evt.request));
  }
  // ...and `waitUntil()` to prevent the worker from being killed until the
  // cache is updated.
  evt.waitUntil(update(evt.request));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      '/bucket/index.html',
      '/bucket/settings.html',
      '/bucket/main.css',
	  '/bucket/bucket.webmanifest',
	  '/bucket/icons/icon32.png',
	  '/bucket/icons/icon64.png',
	  '/bucket/icons/icon128.png',
	  '/bucket/icons/icon512.png',
	  '/bucket/icons/logo.png',
      '/bucket/a.js',
	  '/bucket/pay.html'
    ]);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      console.log('fromcache request', request);
      return matching || Promise.reject('no-match');
    });
  });
}

// Update consists in opening the cache, performing a network request and
// storing the new response data.
function update(request) {
  if (navigator.onLine) {
  	return caches.open(CACHE).then(function (cache) {
    	return fetch(request).then(function (response) {
      		return cache.put(request, response);
    	}).catch(function(error){
    		console.log(error);
    		//do nothing
    		return new Promise(function(resolve,reject){
    			resolve();
    		});
    	});
	});
  }
}

function doNotCache(request) {
	var result = false;
	// var url = request.url;
	// var doNotCacheList = [
	// 	'https://makerwidget.com'
	// ]
	// for (var doNotCacheItem of doNotCacheList) {
	// 	if (url.indexOf(doNotCacheItem) > -1) {
	// 		result = true;
	// 	}
	// }
	// console.log(request.url, result);
	return result;
}