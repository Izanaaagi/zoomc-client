<template>
  <v-app :class='{"chatIncluded": $vuetify.breakpoint.lgAndUp}'>
    <v-navigation-drawer
      absolutes
      :value='isShowParticipantsDrawer'
      v-click-outside='{include: participantsDrawerInclude, handler: closeParticipantsDrawer}'
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class='text-h6'>
            Participants
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for='user in participants'
        :key='user.id'
      >
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ user.username }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-navigation-drawer
      right
      app
      :value='isShowChatDrawer'
      :width="$vuetify.breakpoint.mdAndUp ? '350px' : '250px'"
      v-click-outside='{include: chatDrawerInclude, handler: closeChatDrawer}'
    >
      <Chat />
    </v-navigation-drawer>
    <v-main>
      <div class='d-flex align-center justify-center flex-wrap' style='height: 100vh; padding-bottom: 5%'>
        <video
          v-for='(webcam, index) in usersList' v-bind:key='`webcam${webcam}`'
          autoplay :srcObject.prop='stream'
          :height='webcamHeight'
          :width="index === usersList.length - 1 && webcamRows % 2 !== 0? '100%' : '50%'" />
      </div>
    </v-main>
    <v-footer app>
      <v-col cols='2' class=''>
        <v-row>
          <v-col cols='6' class='d-flex justify-center'>
            <v-btn @click='toggleVoice' icon>
              <v-icon v-if='isVoiceOn'>mdi-microphone</v-icon>
              <v-icon v-else color='red'>mdi-microphone-off</v-icon>
            </v-btn>
          </v-col>
          <v-col cols='6' class='d-flex justify-center'>
            <v-btn @click='toggleCamera' icon>
              <v-icon v-if='isCameraOn'>mdi-video</v-icon>
              <v-icon v-else color='red'>mdi-video-off</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols='9' class=''>
        <v-row justify='center'>
          <v-col cols='4' md='1' class='d-flex justify-end'>
            <v-btn icon @click='toggleParticipantsDrawer' class='included'>
              <v-icon>mdi-account-group</v-icon>
            </v-btn>
          </v-col>
          <v-col cols='4' md='1' class='d-flex justify-center'>
            <v-btn icon @click='startVideo'>
              <v-icon>mdi-monitor-screenshot</v-icon>
            </v-btn>
          </v-col>
          <v-col cols='4' md='1' class='d-flex justify-start'>
            <v-btn icon @click='toggleChatDrawer' class='chatIncluded'>
              <v-icon>mdi-chat</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols='1' class='d-flex justify-end'>
        <v-btn icon @click='leaveRoom'>
          <v-icon color='red'>mdi-phone-hangup</v-icon>
        </v-btn>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import SocketService from '@/services/socket-service';
import { RoomParticipant } from '@/interfaces/room-participant';
import Chat from '@/components/Chat.vue';
import { EventListen } from '@/enums/event-listen';
import { EventEmit } from '@/enums/event-emit';

const room = namespace('Room');

@Component({ name: 'Room', components: { Chat } })
export default class Room extends Vue {
  //Data
  socket = SocketService.socket;
  roomId = this.$route.params.id;

  usersList: string[] =
    [
      'Albert', 'Jhon', 'Amur', 'Andre',
    ];

  //Computed
  @room.State
  isVoiceOn!: boolean;

  @room.State
  isCameraOn!: boolean;

  @room.State
  isShowChatDrawer!: boolean;

  @room.State
  isShowParticipantsDrawer!: boolean;

  @room.State
  participants!: Array<RoomParticipant>;

  get webcamRows(): number {
    return Math.ceil(this.usersList.length / 2);
  }

  get webcamHeight(): string {
    return `${100 / this.webcamRows}%`;
  }

  //Methods
  @room.Mutation
  toggleVoice!: () => void;

  @room.Mutation
  toggleCamera!: () => void;

  @room.Mutation
  toggleChatDrawer!: () => void;

  @room.Mutation
  toggleParticipantsDrawer!: () => void;

  @room.Mutation
  setParticipants!: (participants: Array<RoomParticipant>) => void;

  participantsDrawerInclude(): (Element | null)[] {
    return [document.querySelector('.included')];
  }

  closeParticipantsDrawer(): void {
    if (this.isShowParticipantsDrawer)
      this.toggleParticipantsDrawer();
  }

  chatDrawerInclude(): (Element | null)[] {
    return [document.querySelector('.chatIncluded')];
  }

  closeChatDrawer(): void {
    if (this.isShowChatDrawer)
      this.toggleChatDrawer();
  }

  leaveRoom(): void {
    this.$router.replace({ name: 'EnterName' });
  }

  stream: any = 'stream';

  async startVideo(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
  }

  //Hooks
  created(): void {
    this.socket.emit(EventEmit.JOIN_ROOM, { roomId: this.roomId });


    this.socket.on(EventListen.UPDATE_PARTICIPANTS,
      (participants: Array<RoomParticipant>) => {
        this.setParticipants(participants);
      });

  }

  beforeDestroy(): void {
    this.socket.emit(EventEmit.LEFT_ROOM, { roomId: this.roomId });
    this.socket.removeAllListeners();
  }
}
</script>

<style>

::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(59, 59, 59);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>