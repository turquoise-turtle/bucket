if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/bucket/service-worker.js')
		.then(function (reg){
			console.log('sw registered:', reg);
		}, /*catch*/ function(error) {
			console.log('Service worker registration failed:', error);
		});
	});
}