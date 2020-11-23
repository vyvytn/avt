// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// bootstrap
// eslint-disable-next-line import/first,import/no-duplicates
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// eslint-disable-next-line import/first
import 'bootstrap/dist/css/bootstrap.css';

// eslint-disable-next-line import/first
import 'bootstrap-vue/dist/bootstrap-vue.css';

// audiwave
// eslint-disable-next-line import/first
import VueWaveSurfer from 'vue-wave-surfer';

// eslint-disable-next-line import/first
import Router from 'vue-router';

// eslint-disable-next-line import/first,import/no-duplicates
import BootstrapVueIcons from 'bootstrap-vue';


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Router);
Vue.use(VueWaveSurfer);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
