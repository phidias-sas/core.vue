/* Vue :) */
import Vue from 'vue';

/* Internationalization */
import locale from './store/i18n.js';
locale.set("es");

/* Store */
import './store/filters.js';
import app from './store/app.js';

/* Add components */
import PhiDrawer from './components/Phi/Drawer.vue';
import PhiPersonRelevancePicker from './components/Phi/Person/Relevance/Picker.vue';
import PhiPostEditor from './components/Phi/Post/Editor.vue';

Vue.component('PhiDrawer', PhiDrawer);
Vue.component('PhiPersonRelevancePicker', PhiPersonRelevancePicker);
Vue.component('PhiPostEditor', PhiPostEditor);

module.exports = {
    Vue,
    app
};