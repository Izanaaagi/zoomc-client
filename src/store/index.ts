import Vue from 'vue';
import Vuex from 'vuex';
import {Room} from '@/store/modules/room';
import {getModule} from 'vuex-module-decorators';
import {User} from '@/store/modules/user';
import {Chat} from '@/store/modules/chat';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {Room, User, Chat}
});

export default store;
export const RoomModule = getModule(Room, store);
export const UserModule = getModule(User, store);
export const ChatModule = getModule(Chat, store);