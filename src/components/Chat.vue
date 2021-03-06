<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class='text-h6'>
          Chat
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-container>
      <v-row class='fill-height pb-14' align='end'>
        <v-col>
          <div v-for='message in messages' :key='message.id'
               :class="['d-flex flex-row align-center my-2', message.user.id === socketId ? 'justify-end': null]">
            <span v-if='message.user.id === socketId' class='mr-3'>{{ message.text }}</span>
            <v-avatar :color="message.user.id === socketId ? 'indigo': 'red'" size='36'>
              <span class='white--text'>{{ message.user.username[0] }}</span>
            </v-avatar>
            <span v-if='message.user.id !== socketId' class='ml-3'>{{ message.text }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-footer fixed padless>
      <v-row class='d-flex align-center pr-4'>
        <v-col md='11' cols='10'>
          <v-text-field
            :value='messageText'
            solo
            hide-details
            @input.native='changeMessage'
            @keypress.enter='sendMessage'
          ></v-text-field>
        </v-col>
        <v-col cols='2' md='1' class='d-flex justify-center'>
          <v-btn
            @click='sendMessage'
            icon>
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { Message } from '@/interfaces/message';
import { EventEmit } from '@/enums/event-emit';
import { EventListen } from '@/enums/event-listen';
import { Socket } from 'vue-socket.io-extended';
import messageSound from '@/assets/sounds/message.mp3';

const chat = namespace('Chat');
const user = namespace('User');

@Component({ name: 'Chat' })
export default class Chat extends Vue {
  //Data
  roomId = this.$route.params.id;
  messageSound: HTMLAudioElement = new Audio(messageSound);

  //Computed
  @chat.State
  messages!: Array<Message>;

  @chat.State
  messageText!: string;

  @user.State
  socketId!: string;

  //Methods
  @chat.Mutation
  addMessage!: (message: Message) => void;

  @chat.Mutation
  clearChat!: () => void;

  @chat.Mutation
  setMessage!: (text: string) => void;

  @user.Mutation
  setSocketId!: (id: string) => void;

  changeMessage(e: Event): void {
    const el = e.target as HTMLInputElement;
    this.setMessage(el.value);
  }

  sendMessage(): void {
    if (this.messageText !== '') {
      this.$socket.client.emit(EventEmit.SEND_MESSAGE, { roomId: this.roomId, text: this.messageText });
      this.setMessage('');
    }
  }

  //Sockets
  @Socket(EventListen.RECEIVE_MESSAGE)
  onReceiveMessage(message: Message): void {
    this.addMessage(message);
    this.messageSound.play();
  }

  beforeDestroy(): void {
    this.clearChat();
  }
}
</script>

<style scoped>

</style>