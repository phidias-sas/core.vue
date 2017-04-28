import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import app from './app.js';

/* Set up routes */
import Code from '../states/Code.vue';
import Login from '../states/Login.vue';

import Deck from '../states/Deck.vue';
import About from '../states/About.vue';
import Id from '../states/Id.vue';
import Hidden from '../states/Hidden.vue';

import Dashboard from '../states/Dashboard.vue';

import ThreadFeed from '../states/Thread/Feed.vue';
import Thread from '../states/Thread/Thread.vue';

// import PostFeed from '../states/Post/Feed.vue';  DEPRECATED


import PostContainer from '../states/Post/Container.vue';
import PostContents from '../states/Post/Contents.vue';
import PostThread from '../states/Post/Thread.vue';
import PostAudience from '../states/Post/Audience.vue';

import PostReplies from '../states/Post/Replies.vue';

import Calendar from '../states/Calendar.vue';
import Settings from '../states/Settings.vue';
import Map from '../states/Map.vue';


import Nodes from '../states/Nodes.vue';

import NodeContainer from '../states/Node/Container.vue';
import NodeDashboard from '../states/Node/Dashboard.vue';
import NodePosts from '../states/Node/Posts.vue';
import NodeCompose from '../states/Node/Compose.vue';

import NodePeople from '../states/Node/People.vue';
import NodeNodes from '../states/Node/Nodes.vue';
import NodeImport from '../states/Node/Import.vue';


import People from '../states/People.vue';
import Person from '../states/Person.vue';

// Attendance
import AttendanceAdmin from '../states/Attendance/Admin.vue';
import AttendanceCheckpoint from '../states/Attendance/Checkpoint.vue';


// geolocation
import GeoTargets from '../states/Geo/Targets.vue';
import GeoTracker from '../states/Geo/Tracker.vue';
import GeoFeed from '../states/Geo/Feed.vue';

// pruebas
import Test from '../states/Test.vue';

import Santiago from '../states/Santiago.vue';
import Leo from '../states/Leo.vue';
import Reko from '../states/Rekognition.vue';
import Sebas from '../states/Sebas.vue';
import Felipe from '../states/Felipe.vue';


// Billing (sebastian)
import Billing from '../states/Billing/Billing.vue';
import BillingDebits from '../states/Billing/Debits.vue';
import BillingDetails from '../states/Billing/Details.vue';

import Credits from '../states/Billing/Credits.vue';
import CreditDetails from '../states/Billing/CreditDetails.vue';

var router = new VueRouter({
    routes: [
        { path: '/santiago', component: Santiago },

        { path: '/', redirect: '/dashboard' },
        { path: '/code', component: Code, name: 'code', meta: { isPublic: true, exitOnBack: true } },
        { path: '/login', component: Login, name: 'login', meta: { isPublic: true, exitOnBack: true } },

        {
            path: '/deck', component: Deck,
            children: [
                { path: '/hidden', component: Hidden },
                { path: '/about', component: About, meta: { order: 1 } },
                { path: '/id', component: Id, meta: { order: 1 } },

                { path: '/dashboard', component: Dashboard, meta: { order: 1, exitOnBack: true } },

                { path: '/threads/feed', component: ThreadFeed, meta: { endpoint: 'feed', order: 2 }, name: 'feed' },
                { path: '/threads/feed/:threadId', component: Thread, meta: { order: 3 }, name: 'thread' },
                { path: '/archive', component: ThreadFeed, meta: { endpoint: 'archive', order: 3, exitOnBack: true }, name: 'archive' },
                { path: '/trash', component: ThreadFeed, meta: { endpoint: 'trash', order: 3, exitOnBack: true }, name: 'trash' },

                { path: '/billing/:personId', component: Billing, name: 'billing', meta: {order: 1}},

                { path: '/people', component: People, meta: { order: 10 }, name: 'people' },
                { path: '/person/:personId', component: Person, meta: { order: 11 }, name: 'person' },

                { path: '/calendar', component: Calendar, meta: { order: 12, exitOnBack: true }, name: 'calendar' },
                { path: '/settings', component: Settings, meta: { order: 12, exitOnBack: true }, name: 'settings' },
                { path: '/map', component: Map, meta: { order: 12, exitOnBack: true }, name: 'map' },

                // Attendance
                { path: '/attendance/admin', component: AttendanceAdmin, meta: { order: 10, exitOnBack: true }, name: 'attendance-admin' },
                { path: '/attendance/checkpoint/:nodeId', component: AttendanceCheckpoint, meta: { order: 20 }, name: 'attendance-checkpoint' },

                // Geolocation
                { path: '/tracker/:targetId', component: GeoTracker, meta: { order: 1, exitOnBack: true }, name: 'geo-tracker' },


                // Nodes
                { path: '/nodes', component: Nodes, meta: { order: 1, exitOnBack: true }, name: 'nodes' },
                {
                    path: '/nodes/:nodeId', component: NodeContainer, meta: { order: 13 },
                    children: [
                        { path: '', component: NodeDashboard, meta: { order: 14 }, name: 'node' },
                        { path: 'posts/:type', component: NodePosts, meta: { order: 15 }, name: 'node-posts' },
                        { path: 'people', component: NodePeople, meta: { order: 16 }, name: 'node-people' },
                        { path: 'nodes', component: NodeNodes, meta: { order: 17 }, name: 'node-nodes' },
                        { path: 'import', component: NodeImport, meta: { order: 18 }, name: 'node-import' }
                    ]
                },

                { path: '/nodes/:nodeId/posts/compose/:postId', component: NodeCompose, meta: { order: 20 }, name: 'node-compose' },

                { path: '/test', component: Test },
                { path: '/sebas', component: Sebas, name: 'Sebas' },
                { path: '/felipe', component: Felipe },
                { path: '/leo', component: Leo },
                { path: '/reko', component: Reko },
                { path: '/geofeed', component: GeoFeed },
                { path: '/geotargets', component: GeoTargets },
                
                // billing (sebastian)
                { path: '/billing/debits', component: BillingDebits},
                { path: '/billing/debits/:debitId', component: BillingDetails, name: 'billing-debit-debitId', meta: {order: 2} },

                // billing (esteban)
                { path: '/billing/credits', component: Credits },
                { path: '/billing/credits/:creditId', component: CreditDetails, name: 'billing-credit-creditId', meta: {order: 2} },

            ]
        },

    ]
});


/*
Navigation guards:
redirect to /code if app is not initialized,
redirect to /login if user is not authenticated
*/

router.beforeEach((to, from, next) => {
    if (to.name != 'code' && !app.isReady) {
        next({ name: 'code' });
        return;
    }

    if (!to.meta.isPublic && !app.isAuthenticated) {
        next({ name: 'login' });
        return;
    }

    next();
});

router.afterEach((to, from) => {
   router.previousRoute = from;
})


export default router;
