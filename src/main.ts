import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import { Socket } from 'socket.io-client';
import { BASE_URL } from '@/api';

Vue.config.productionTip = false;

const socket: Socket = io(BASE_URL, { withCredentials: true });
Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
