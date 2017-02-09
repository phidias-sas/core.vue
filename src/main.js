/* Fastclick:  removes the 300ms tap delay on mobile devices */
import Fastclick from 'fastclick';
Fastclick.attach(document.body);

/* Configure moment.js locale */
import moment from 'moment';
moment.locale("es");

/* Import filters */
import './filters/filters.js';

/* Vue :) */
import Vue from 'vue';
import VueRouter from 'vue-router';

/* Set up routes */
import Code from './states/Code.vue';
import Login from './states/Login.vue';

import Deck from './states/Deck.vue';
import About from './states/About.vue';
import Hidden from './states/Hidden.vue';

import Dashboard from './states/Dashboard.vue';

import PostFeed from './states/Post/Feed.vue';
import PostArchive from './states/Post/Archive.vue';

import PostContainer from './states/Post/Container.vue';
import PostContents from './states/Post/Contents.vue';
import PostThread from './states/Post/Thread.vue';
import PostAudience from './states/Post/Audience.vue';

import PostReplies from './states/Post/Replies.vue';


import ThreadFolder from './states/Thread/Folder.vue';
import ThreadRead from './states/Thread/Read.vue';
import ThreadArchive from './states/Thread/Archive.vue';

import Calendar from './states/Calendar.vue';
import Settings from './states/Settings.vue';
import Map from './states/Map.vue';

import NodeContainer from './states/Node/Container.vue';
import NodeDashboard from './states/Node/Dashboard.vue';
import NodePosts from './states/Node/Posts.vue';
import NodeCompose from './states/Node/Compose.vue';

import NodePeople from './states/Node/People.vue';
import NodeNodes from './states/Node/Nodes.vue';
import NodeImport from './states/Node/Import.vue';

import Root from './states/Root.vue';
import People from './states/People.vue';
import Person from './states/Person.vue';

// pruebas
import Test from './states/Test.vue';

import Santiago from './states/Santiago.vue';
import Sanchez from './states/Sanchez.vue';
import Leo from './states/Leo.vue';
import Sebas from './states/Sebas.vue';
import Felipe from './states/Felipe.vue';

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
		{ path: '/santiago', component: Santiago },
		{ path: '/leo', component: Leo },

		{ path: '/', redirect: '/dashboard' },
		{ path: '/code',  component: Code, name: 'code', meta: {isPublic: true, exitOnBack: true} },
		{ path: '/login', component: Login, name: 'login', meta: {isPublic: true, exitOnBack: true} },

		{ path: '/deck',  component: Deck,
			children: [
				{ path: '/hidden', component: Hidden },
				{ path: '/about', component: About, meta: {order: 1} },

				{ path: '/dashboard', component: Dashboard, meta: {order: 1, exitOnBack: true} },

				{ path: '/posts/feed', component: PostFeed, meta: {order: 2}, name: 'feed' },
				{ path: '/posts/feed/:postId', component: PostContainer, meta: {order: 13},
					children: [
						{ path: '', component: PostContents, meta: {order: 14}, name: 'post' },
						{ path: 'thread/:thread', component: PostThread, meta: {order: 15}, name: 'post-thread' },
						{ path: 'audience', component: PostAudience, meta: {order: 15}, name: 'post-audience' },
						// { path: 'replies', component: PostReplies, meta: {order: 15}, name: 'post-replies' },
					]
				},

				{ path: '/folder/:folder', component: ThreadFolder, meta: {order: 2}, name: 'folder' },
				{ path: '/read/:threadId', component: ThreadRead, meta: {order: 99}, name: 'read' },
				{ path: '/archive', component: PostArchive, meta: {order: 3, exitOnBack: true}, name: 'archive' },

				{ path: '/people', component: People, meta: {order: 10}, name: 'people' },
				{ path: '/person/:personId', component: Person, meta: {order: 11}, name: 'person' },

				{ path: '/calendar', component: Calendar, meta: {order: 12, exitOnBack: true}, name: 'calendar' },
				{ path: '/settings', component: Settings, meta: {order: 12, exitOnBack: true}, name: 'settings' },
				{ path: '/map', component: Map, meta: {order: 12, exitOnBack: true}, name: 'map' },

				{ path: '/root', component: Root,   meta: {order: 12}, name: 'root' },

				{ path: '/nodes/:nodeId', component: NodeContainer, meta: {order: 13},
					children: [
						{ path: '', component: NodeDashboard, meta: {order: 14}, name: 'node' },
						{ path: 'posts/:type', component: NodePosts, meta: {order: 15}, name: 'node-posts' },
						{ path: 'people', component: NodePeople, meta: {order: 16}, name: 'node-people' },
						{ path: 'nodes',  component: NodeNodes, meta: {order: 17}, name: 'node-nodes' },
						{ path: 'import', component: NodeImport, meta: {order: 18}, name: 'node-import' }
					]
				},

				{ path: '/nodes/:nodeId/posts/compose/:postId', component: NodeCompose, meta: {order: 20}, name: 'node-compose' },

				{ path: '/test', component: Test },
				{ path: '/sanchez', component: Sanchez },
				{ path: '/sebas', component: Sebas},
				{ path: '/felipe', component: Felipe },

			]
		},

	]
});

import app from './store/app.js';

/*
Navigation guards:
redirect to /code if app is not initialized,
redirect to /login if user is not authenticated
*/

router.beforeEach((to, from, next) => {
	if (to.name != 'code' && !app.isReady) {
		next({name: 'code'});
		return;
	}

	if (!to.meta.isPublic && !app.isAuthenticated) {
		next({name: 'login'});
		return;
	}

	next();
});

/* Initialize the app (at the Index component) */
app.on("load", () => {
	new Vue({
		el: '#app',
		router
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
		router.push({name: 'read', params: {threadId: data.post.thread}});
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