<template>
  <div class='container'>
    <div v-for='(participant) in participants'
         :key='`webcam${participant.peerId}`'
         class='video-container'
         :style='{"height" : webcamHeight}'>
      <video
        v-show='participant.isCameraOn'
        :ref='`${participant.peerId}`'
        :srcObject.prop='participant.mediaStream'
        autoplay
        height='100%'
        :muted='participant.peerId === peer.id || !participant.isVoiceOn'
      />
      <v-avatar
        v-show='!participant.isCameraOn'
        size='208'
        color='teal'>
        <v-icon dark size='124'>
          mdi-account-circle
        </v-icon>
      </v-avatar>
      <v-badge
        :value='!participant.isVoiceOn'
        icon='mdi-microphone-off'
        color='error'
        offset-y='24px'
        offset-x='-5px'
      >
        <span class='font-weight-medium subtitle-1'>{{ participant.username }}</span>
      </v-badge>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { RoomParticipant } from '@/interfaces/room-participant';
import Peer from 'peerjs';
import { Socket } from 'vue-socket.io-extended';

const room = namespace('Room');

@Component({ name: 'camerasDashboard' })
export default class CamerasDashboard extends Vue {

  //Computed
  @room.State
  mediaStream!: MediaStream;

  @room.State
  isVoiceOn!: boolean;

  @room.State
  isCameraOn!: boolean;

  @room.State
  isShowScreen!: boolean;

  @room.State
  isShowChatDrawer!: boolean;

  @room.State
  isShowParticipantsDrawer!: boolean;

  @room.State
  participants!: Array<RoomParticipant>;

  @room.State
  peer!: Peer;

  //Methods
  @room.Mutation
  public toggleParticipantVoice!: (peerId: string) => void;

  @room.Mutation
  public toggleParticipantCamera!: (peerId: string) => void;

  //Getters
  get webcamRows(): number {
    return Math.ceil(this.participants.length / 2);
  }

  get webcamHeight(): string {
    return this.webcamRows === 1 ? '50%' : `${80 / this.webcamRows}%`;
  }

  //Sockets
  @Socket('toggleParticipantVoice')
  onToggleParticipantVoice(peerId: string): void {
    this.toggleParticipantVoice(peerId);
  }

  @Socket('toggleParticipantCamera')
  onToggleParticipantCamera(peerId: string): void {
    this.toggleParticipantCamera(peerId);
  }

}
</script>

<style scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  flex-wrap: wrap;
  flex: 1;
}

.video-container {
  max-width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

</style>