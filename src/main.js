/* Vue :) */
import Vue from 'vue';

/* Internationalization */
import locale from './store/i18n.js';
locale.set("es");

/* Fastclick:  removes the 300ms tap delay on mobile devices */
import Fastclick from 'fastclick';
Fastclick.attach(document.body);

/* Muse-UI */
// import MuseUI from 'muse-ui';
// import 'muse-ui/dist/muse-ui.css';
// import 'muse-ui/dist/theme-carbon.css'; // use carbon theme
// Vue.use(MuseUI);

import './store/filters.js';
import app from './store/app.js';
import router from './store/router.js';

/* Initialize the app */
app.on("load", () => {
	new Vue({
		el: '#app',
		router,
		// store
	});
});

/* Clear cache on incoming notification */
app.on("notification", (data, notification) => {
	app.api.clear(`people/${app.user.id}/posts/types`);
	app.api.clear(`people/${app.user.id}/posts/inbox`);
	app.api.clear(`/people/${app.user.id}/threads/inbox`);
	app.api.clear(`/people/${app.user.id}/threads/archive`);
	app.api.clear(`/people/${app.user.id}/threads/inbox/${data.post.thread}`);

	if (!notification.additionalData.foreground) {
		if (data.post.replyTo) {
			router.push({name: 'post-thread', params: {postId: data.post.replyTo, thread: data.post.thread}});
		} else {
			router.push({name: 'post', params: {postId: data.post.id}});
		}
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