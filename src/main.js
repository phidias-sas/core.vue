/* Vue :) */
import Vue from 'vue';

/* Internationalization */
import locale from './store/i18n.js';
locale.set("es");

/* Fastclick:  removes the 300ms tap delay on mobile devices */
import Fastclick from 'fastclick';
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		Fastclick.attach(document.body);
	}, false);
}

/* Muse-UI */
import MuseUI from 'muse-ui';

// de-globalized CSS
import '../static/muse/muse-ui.css';
import '../static/muse/theme-carbon.css'; // use carbon theme
Vue.use(MuseUI);

import './store/filters.js';
import './store/components.js';
import app from './store/app.js';
import router from './store/router.js';

/* Initialize the app */
app.on("load", () => {
	new Vue({
		el: '#app',
		router
	});
});

/* Clear cache on incoming notification */
app.on("notification", (data, notification) => {
	app.api.clear(`/people/${app.user.id}/threads/feed`);
	app.api.clear(`/people/${app.user.id}/threads/feed/${data.post.thread2}`);
	app.api.clear(`/people/${app.user.id}/threads/archive`);

	if (!notification.additionalData.foreground) {
		router.push({name: 'thread', params: {threadId: data.post.thread2}});
	}
});

/* Device back button */
document.addEventListener("deviceready", () => {

	/*
	ASSHOLES!  I wasted HOURS on this!  Damn you ONSEN!

	OnsenUI sets a default device backbutton handles.
	ons.disableDeviceBackButtonHandler();  does NOTHING, so the
	listener has to be set to an empty function call
	*/
	ons.setDefaultDeviceBackButtonListener(function(event) {
	});

	document.addEventListener("backbutton", (e) => {
		if (router.currentRoute.meta.exitOnBack) {
			navigator.app.exitApp();
		} else {
			router.go(-1);
		}
	}, false);

}, false);



/* serviceWoker registration */
// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('service-worker.js').then(registration => {
// 		// Registration was successful
// 		console.log('ServiceWorker registration successful with scope: ', registration.scope);
// 	}).catch(err => {
// 		// registration failed :(
// 		console.log('ServiceWorker registration failed: ', err);
// 	});
// }