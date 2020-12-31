const cacheName = 'vanilla-notes-v1';
const contentToCache = [
	'/js/data.js',
	'/js/ui.js',
	'/css/layout.css',
	'/index.html',
	'/todos/index.html',
];

self.addEventListener('install', e => {
	console.log('[Service Worker] Install');

	e.waitUntil(
		caches.open(cacheName).then(cache => {
			console.log('[Service Worker] Caching all: app shell and content');

			// Disable for dev
			//return cache.addAll(contentToCache);
		})
	);
});
