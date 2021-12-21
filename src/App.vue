<template>
  <router-view />
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import SocketService from '@/services/socket-service';
import { EventListen } from '@/enums/event-listen';
import { Error } from '@/interfaces/error';

const user = namespace('User');
const errors = namespace('Errors');

@Component({ name: 'App' })
export default class App extends Vue {
  socket: typeof SocketService = SocketService;

  //Methods
  @user.Mutation
  setSocketId!: (id: string) => void;

  @errors.Mutation
  addError!: (errors: Error) => void;

  //Hooks
  created(): void {
    this.socket.connect();
    this.socket.socket.on(EventListen.CONNECT, () => {
      this.setSocketId(this.socket.socket.id);
    });

    this.socket.socket.on(EventListen.ERROR, (error: Error) => {
      this.addError(error);
      this.$router.push({ name: 'EnterName' });
    });
  }

  beforeDestroy(): void {
    this.socket.disconnect();
  }
}
</script>

<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
