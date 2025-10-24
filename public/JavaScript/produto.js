function onStartupFinished() {
	try {
		console.log('onStartupFinished called');
		// initialization logic can go here
	} catch (err) { console.error(err); }
}
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	setTimeout(onStartupFinished, 0);
} else {
	window.addEventListener('DOMContentLoaded', onStartupFinished);
}

// gallery behavior
document.addEventListener('click', function (e) {
	if (e.target.matches('.thumbs img')) {
		const large = e.target.getAttribute('data-large');
		const mainImg = document.querySelector('#mainImg img');
		if (mainImg && large) mainImg.src = large;
	}
});