<template>
  <router-view />
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import SocketService from '@/services/socket-service';
import { EventListen } from '@/enums/event-listen';

const user = namespace('User');

@Component({ name: 'App' })
export default class App extends Vue {
  socket: typeof SocketService = SocketService;

  //Methods
  @user.Mutation
  setSocketId!: (id: string) => void;

  //Hooks
  created(): void {
    this.socket.connect();
    this.socket.socket.on(EventListen.CONNECT, () => {
      this.setSocketId(this.socket.socket.id);
    });

    this.socket.socket.on(EventListen.ERROR, (error: string) => {
      this.$router.replace({ name: 'EnterName' });
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
