<template>
  <v-app
    :class='{"chatIncluded": $vuetify.breakpoint.lgAndUp}'>
    <div v-if='mediaStream.active'>
      <v-navigation-drawer
        absolute
        :value='isShowParticipantsDrawer'
        v-click-outside='{include: participantsDrawerInclude, handler: closeParticipantsDrawer}'
      >
        <participants-drawer></participants-drawer>
      </v-navigation-drawer>
      <v-navigation-drawer
        right
        app
        :value='isShowChatDrawer'
        :width="$vuetify.breakpoint.mdAndUp ? '350px' : '250px'"
        v-click-outside='{include: chatDrawerInclude, handler: closeChatDrawer}'
      >
        <chat />
      </v-navigation-drawer>
      <v-main>
        <cameras-dashboard key='childKey'></cameras-dashboard>
      </v-main>
      <v-footer v-if='mediaStream.active' app>
        <room-toolbar></room-toolbar>
      </v-footer>
    </div>
    <v-container
      v-else
      style='height: 100%'
      class='d-flex justify-center align-center'
    >
      <v-progress-circular
        size='150'
        width='5'
        indeterminate
        color='primary'
      ></v-progress-circular>
    </v-container>
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { RoomParticipant } from '@/interfaces/room-participant';
import Chat from '@/components/Chat.vue';
import { EventEmit } from '@/enums/event-emit';
import ParticipantsDrawer from '@/components/ParticipantsDrawer.vue';
import { Socket } from 'vue-socket.io-extended';
import RoomToolbar from '@/components/RoomToolbar.vue';
import CamerasDashboard from '@/components/CamerasDashboard.vue';
import Peer from 'peerjs';
import * as freeice from 'freeice';
import userConnectedSound from '@/assets/sounds/user-connected.mp3';
import userDisconnectedSound from '@/assets/sounds/user-disconnected.mp3';

const room = namespace('Room');
const user = namespace('User');

@Component({ name: 'Room', components: { Chat, ParticipantsDrawer, RoomToolbar, CamerasDashboard } })
export default class Room extends Vue {

  //Data
  userConnectedSound: HTMLAudioElement = new Audio(userConnectedSound);
  userDisconnectedSound: HTMLAudioElement = new Audio(userDisconnectedSound);

  //Computed
  @room.State
  roomId!: string;

  @room.State
  isVoiceOn!: boolean;

  @room.State
  isCameraOn!: boolean;

  @room.State
  isShowChatDrawer!: boolean;

  @room.State
  participants!: Array<RoomParticipant>;

  @room.State
  isShowParticipantsDrawer!: boolean;

  @room.State
  mediaStream!: MediaStream;

  @room.State
  peer!: Peer;

  @room.State
  call!: Peer.MediaConnection;

  @user.State
  socketId!: string;

  @user.State
  username!: string;

  //Methods
  @room.Mutation
  toggleChatDrawer!: () => void;

  @room.Mutation
  toggleParticipantsDrawer!: () => void;

  @room.Mutation
  setParticipants!: (participants: Array<RoomParticipant>) => void;

  @room.Mutation
  setRoomId!: (roomId: string) => void;

  @room.Mutation
  addParticipant!: (addedParticipant: RoomParticipant) => void;

  @room.Mutation
  removeParticipant!: (id: string) => void;

  @room.Mutation
  addStreamToParticipant!: (payload: Pick<RoomParticipant, 'mediaStream' | 'peerId'>) => void;

  @room.Mutation
  setMediaStream!: (mediaStream: MediaStream) => void;

  @room.Mutation
  setPeer!: (peer: Peer) => void;

  @room.Mutation
  setCall!: (call: Peer.MediaConnection) => void;

  @room.Mutation
  resetRoom!: () => void;

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

  initPeer(): void {
    this.setPeer(new Peer({ config: { iceServers: freeice() } }));

    this.peer.on('open', (id) => {
      const me: RoomParticipant = {
        peerId: this.peer.id,
        username: this.username,
        mediaStream: this.mediaStream,
        isVoiceOn: this.isVoiceOn,
        isCameraOn: this.isCameraOn,
      };
      this.addParticipant(me);
      this.$socket.client.emit(EventEmit.JOIN_ROOM, {
        roomId: this.roomId,
        peerId: id,
        isVoiceOn: this.isVoiceOn,
        isCameraOn: this.isCameraOn,
      });

      this.peer.on('call', (call) => {
        call.answer(this.mediaStream);
        call.on('stream', (remoteStream) => {
          this.addStreamToParticipant({ peerId: call.peer, mediaStream: remoteStream });
        });
      });
    });
  }


  @Socket('user-connected')
  onConnected(participant: RoomParticipant): void {
    this.setCall(this.peer.call(participant.peerId, this.mediaStream));
    this.addParticipant(participant);
    this.userConnectedSound.play();
    this.$socket.client.emit('answer', {
      id: participant.socketId,
      peerId: this.peer.id,
      isVoiceOn: this.isVoiceOn,
      isCameraOn: this.isCameraOn,
    });
    this.call.on('stream', (remoteStream): void => {
      this.addStreamToParticipant({ peerId: participant.peerId, mediaStream: remoteStream });
    });
  }

  //Sockets
  @Socket('answer')
  onAnswer(participant: RoomParticipant): void {
    this.addParticipant(participant);
  }

  @Socket('user-disconnected')
  onDisconnect(id: string): void {
    this.removeParticipant(id);
    this.userDisconnectedSound.play();
  }

  //Hooks
  async created(): Promise<void> {
    document.title = 'ZoomC | Room';

    this.setRoomId(this.$route.params.id);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: this.isVoiceOn, video: this.isCameraOn });
      this.setMediaStream(mediaStream);
      this.initPeer();

    } catch (e) {
      console.log(e);
    }
  }

  beforeDestroy(): void {
    this.$socket.client.emit(EventEmit.LEFT_ROOM, { roomId: this.roomId, peerId: this.peer.id });
    this.resetRoom();
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