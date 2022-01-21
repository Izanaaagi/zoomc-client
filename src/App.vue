<template>
  <router-view />
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { EventListen } from '@/enums/event-listen';
import { Error } from '@/interfaces/error';
import { Socket } from 'vue-socket.io-extended';

const user = namespace('User');
const errors = namespace('Errors');

@Component({ name: 'App' })
export default class App extends Vue {

  //Methods
  @user.Mutation
  setSocketId!: (id: string) => void;

  @errors.Mutation
  addError!: (errors: Error) => void;

  //Sockets
  @Socket(EventListen.CONNECT)
  onConnect(): void {
    this.setSocketId(this.$socket.client.id);
  }

  @Socket(EventListen.ERROR)
  onError(error: Error): void {
    this.addError(error);
    this.$router.push({ name: 'EnterName' });
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
