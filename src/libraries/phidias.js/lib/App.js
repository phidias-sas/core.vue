/*
This class encapsulates all interactions with a configured Phidias API endpoint,
including API calls, authentication, and sessions via token.

It persists locally (through localforage -indexeddb-) and can be accessed within a service worker.

Example:

var app = new App("myApp");

// Set data manually:
app.set({
	endpoint: '... a phidias API endpoint',
	title: 'My App',
	logo: '... logo url ...',
	googleClientId: '' // to work with google auth and push notifications
});

// or, load data from rack:
app.loadCode('phidias');

// Using the App:

// basic authentication
app.login(username, password)
	.then(payload => {
		console.log("login successfull!", payload);  // payload contains the decoded token data
	});

// or authenticate with google
app.googleLogin()
	.then(payload => {
		console.log("login successfull!", payload);  // payload contains the decoded token data
	});


// now let's make API calls!
app.api.get("/people")
	.then(people => {
		console.log(people);
	});

app.api.put("/people/7", {
	firstName: "Seven"
});

app.api.delete("/people/7");

app.logout();

app.clear();

*/
import localforage from 'localforage';

import Client from './Client/Client.js';
import JWT from './JWT.js';
import Push from './Push.js';
import Navigation from './Navigation.js';

export default class App {

	constructor(name, data) {
		this.name = name;
		this.reset();
		this.retrieve()
			.then(storedData => {
				data = Object.assign(storedData, data);
				this.set(data);
				this.initialize();
				this.emit("load");
			});
	}

	reset() {
		this.data = {
			endpoint:       null,
			title:          null,
			logo:           null,
			token:          null,
			user:           null, // "user" holds the decoded token payload
			pushToken:      null,
			googleClientId: null
		};

		this.isReady    = false; // Indicates that an endpoint is set and thus the app is ready to be used
		this.api        = null;
		this.listeners  = {};
		this.navigation = new Navigation;
	}

	set(data) {
		if (!data) {
			return;
		}
		this.data = Object.assign(this.data, data);
		this.store();
	}

	/* If an enpoint is present initialize the API */
	initialize() {
		if (!this.data.endpoint) {
			return;
		}
		this.api = new Client(this.data.endpoint);
		!!this.data.token && this.setToken(this.data.token);
		this.isReady = true;
	}

	/* Persistence */
	store() {
		return localforage.setItem('app:' + this.name, this.data);
	}

	retrieve() {
		return localforage.getItem('app:' + this.name)
			.then(stored => !!stored ? stored : {})
			.then(data => Object.assign(data, this.getDataFromMetaTags()));
	}

	clear() {
		this.reset();
		return localforage.removeItem('app:' + this.name);
	}


	/* Shorthand data getters */
	get title() {
		return this.data.title;
	}

	get logo() {
		return this.data.logo;
	}

	get user() {
		return this.data.user;
	}

	/* Event handling */
	on(eventName, callback) {
		eventName = eventName.toLowerCase();
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(callback);

		if (eventName == 'load' && this.isReady) {
			callback();
		}

		return () => {
			this.listeners[eventName].splice(this.listeners[eventName].indexOf(callback), 1);
		};
	}

	emit(eventName, args = []) {
		eventName = eventName.toLowerCase();
		if (!this.listeners[eventName]) {
			return;
		}

		this.listeners[eventName].forEach(callback => {
			callback.apply(this, args);
		});
	}

	loadCode(code, rackUrl = "https://phidias.io/") {
		return new Client(rackUrl)
			.get("/code/" + code)
			.then(response => {
				this.set({
					title:    response.title,
					logo:     response.logo,
					endpoint: response.url
				});
				this.initialize();
			});
	}

	/* Authentication */
	get isAuthenticated() {
		return this.data.token != null;
	}

	setToken(tokenString) {
		this.data.user  = JWT.decode(tokenString);
		this.data.token = tokenString;
		this.store();

		this.api.setToken(this.data.token);
		this.emit("login", [this.data.user]);

		this.registerPushNotifications();

		return this.data.user;
	}

	logout() {
		this.unregisterPushNotifications();
		this.data.user  = null;
		this.data.token = null;
		this.api.setToken(null);
		this.store();
		this.emit("logout");
	}

	login(username, password) {
		return this.api.fetch("oauth/token", {
			method:  "post",
			headers: {Authorization: 'Basic ' + btoa(username + ':' + password)},
			body:    {grant_type: "client_credentials"}
		})
		.then(response => response.json())
		.then(response => this.setToken(response.access_token));
	}

	googleLogin() {
		return new Promise((resolve, reject) => {
			this.getGoogleAuthorizationCode()
				.then(googleCode => {
					this.api.post("oauth/google", {code: googleCode})
						.then(response => {
							this.setToken(response.access_token);
							resolve(this.user);
						}, reject);
				}, reject);
		});
	}

	getGoogleAuthorizationCode() {
		// https://developers.google.com/identity/protocols/OAuth2UserAgent#formingtheurl
		var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + Client.serialize({
			"redirect_uri":  "http://www.phidias.co/googlesignin.html",
			"client_id":     this.data.googleClientId,
			"scope":         "email",
			"response_type": "code",
			"prompt":        "select_account"
		});

		return new Promise(function (resolve, reject) {

			// Open the OAuth consent page in the InAppBrowser
			var authWindow = window.open(authUrl, '_blank');

			// Listen (one time) for messages sent from authWindow
			var listenMessage = function(event) {

				if (event.data.status == 'success') {
					resolve(event.data.code);
				} else {
					reject(event.data.error);
				}

				window.removeEventListener('message', listenMessage);
			}
			window.addEventListener('message', listenMessage);


			// Within phonegap, the created window will NOT have a window.opener, so
			// use this instead:
			authWindow.addEventListener('loadstart', function(e) {
				var url   = e.url;
				var code  = new RegExp(/\?code=(.+)$/).exec(url);
				var error = new RegExp(/\?error=(.+)$/).exec(url);

				var result = {};

				if (code) {
					result.status = 'success';
					result.code   = code[1];
				} else if (error) {
					result.status = 'error';
					result.error  = error[1];
				}

				if (code || error) {
					window.postMessage(result, "*");
					authWindow.close();
				}
			});

		});
	}

	getDataFromMetaTags() {

		var retval = {};

		/* Obtain data from metatags (in public/index.html) */
		var metas = document.querySelectorAll('meta');
		for (var cont = 0; cont < metas.length; cont++) {

			/* Obtain endpoint from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-endpoint") {
				retval.endpoint = metas[cont].content;
			}

			/* Obtain title from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-title") {
				retval.title = metas[cont].content;
			}

			/* Obtain logo from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-logo") {
				retval.logo = metas[cont].content;
			}

			/* Obtain googleClientId from "phi-google-client-id" metatag */
			if (metas[cont].name == "phi-google-client-id") {
				retval.googleClientId = metas[cont].content;
			}

		}

		return retval;
	}


	/* Display a notification. takes same arguments as registration.showNotification */
	displayNotification(title, options) {
		if (!'serviceWorker' in navigator) {
			console.warn("serviceworker not supported");
			return;
		}

		navigator.serviceWorker.getRegistration().then(registration => {
			registration.showNotification(title, options);
		});
	}

	registerPushNotifications() {
		window.isPhone = document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1;
		if (window.isPhone) {
			document.addEventListener("deviceready", () => this.doRegister(), false);
		} else {
			this.doRegister();
		}
	}

	doRegister() {
		/*
		PushNotification is phonegap's push notification plugin
		When it is not present, the service worker methods are used (via the encapsulating Push class)
		*/
		if (typeof PushNotification == "undefined") {

			Push.subscribe()
				.then(subscription => {

					this.set({pushToken: Push.getSubscriptionId(subscription)});

					/* Register the device with the endpoint */
					this.api.post(`people/${this.data.user.id}/devices`, {
						token:    this.data.pushToken,
						platform: "gcm",
						model:    "browser version here soon",
						uuid:     this.data.pushToken
					});

					/*
					Listen for messages from service worker
					see https://ponyfoo.com/articles/serviceworker-messagechannel-postmessage#broadcasting-from-a-serviceworker-to-every-client
					*/
					if ('serviceWorker' in navigator) {
						navigator.serviceWorker.addEventListener('message', (event) => {
							this.emit("notification", [event.data, event]);
						});
					}
				})
				.catch(err => {
					// serviceWorker not supported
				});

			return;
		}

		var senderID = this.data.googleClientId.split(".")[0];

		var push = PushNotification.init({
			android: {
				senderID: senderID
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true"
			},
			windows: {}
		});

		push.on('registration', data => {

			if (!window.device || !window.device.platform) {
				return;
			}

			this.set({pushToken: data.registrationId});

			this.api.post(`people/${this.data.user.id}/devices`, {
				token:    this.data.pushToken,
				platform: window.device.platform == 'Android' ? 'gcm' : window.device.platform,
				model:    window.device.model,
				uuid:     window.device.uuid
			});

		});

		push.on('notification', notification => {
			// notification.message,
			// notification.title,
			// notification.count,
			// notification.sound,
			// notification.image,
			// notification.additionalData
			this.emit("notification", [notification.additionalData.payload ? notification.additionalData.payload : null, notification]);
		});

		push.on('error', function(e) {
			alert(e.message);
		});
	}

	unregisterPushNotifications() {
		if (typeof PushNotification == "undefined") {
			return Push.unsubscribe().then(() => this.api.delete(`people/${this.data.user.id}/devices/${this.data.pushToken}`));
		}

		!!window.device && this.api.delete(`people/${this.data.user.id}/devices/${window.device.uuid}`);
	}

}