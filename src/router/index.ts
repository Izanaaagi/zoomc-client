import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import EnterName from '../components/EnterName.vue';
import JoinRoom from '../components/JoinRoom.vue';
import Room from '../components/Room.vue';
import cookie from 'js-cookie';
import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'MainLayout',
    component: MainPage,
    redirect: '/enterName',
    children:
      [
        {
          path: '/enterName',
          name: 'EnterName',
          component: EnterName,
        },
        {
          path: '/joinRoom',
          name: 'JoinRoom',
          component: JoinRoom,
          meta: { requireName: true },
        },
      ],
  },

  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
    meta: { requireName: true, isLegitRoom: true },
  },
];

const router: VueRouter = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  const isHaveName = !!cookie.get('username');
  if (to.matched.some(record => record.meta.requireName)) {
    if (!isHaveName) {
      next({
        name: 'EnterName',
      });
      store.commit('Errors/addError', { text: 'Invalid username' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
