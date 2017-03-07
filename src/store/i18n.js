import Vue from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';

Vue.use(VueI18n);

/* Configure locales */
import langEs from '../languages/es.js';
Vue.locale('es', langEs);

export default {
    set(lang) {
        moment.locale(lang);
        Vue.config.lang = lang;
    } 
};
