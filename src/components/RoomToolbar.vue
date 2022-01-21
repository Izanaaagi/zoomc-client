<template>
  <v-row class='py-3'>
    <v-col cols='2' class=''>
      <v-row justify='center'>
        <v-col cols='6' class='d-flex justify-center'>
          <v-btn @click='changeVoiceHandler' icon>
            <v-icon v-if='isVoiceOn'>mdi-microphone</v-icon>
            <v-icon v-else color='red'>mdi-microphone-off</v-icon>
          </v-btn>
        </v-col>
        <v-col cols='6' class='d-flex justify-center'>
          <v-btn @click='changeWebcamHandler' icon>
            <v-icon v-if='isCameraOn'>mdi-video</v-icon>
            <v-icon v-else color='red'>mdi-video-off</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols='8' class=''>
      <v-row justify='center'>
        <v-col cols='6' md='1' class='d-flex justify-end'>
          <v-btn icon @click='toggleParticipantsDrawer' class='included'>
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
        </v-col>
        <v-col cols='6' md='1' class='d-flex justify-start'>
          <v-btn icon @click='toggleChatDrawer' class='chatIncluded'>
            <v-icon>mdi-chat</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols='2' class='d-flex justify-end'>
      <v-btn icon @click='leaveRoom'>
        <v-icon color='red'>mdi-phone-hangup</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import Peer from 'peerjs';

const room = namespace('Room');

@Component({ name: 'RoomToolbar' })
export default class RoomToolbar extends Vue {

  //Computed
  @room.State
  peer!: Peer;

  @room.State
  mediaStream!: MediaStream;

  @room.State
  isVoiceOn!: boolean;

  @room.State
  isCameraOn!: boolean;

  @room.State
  isShowChatDrawer!: boolean;

  @room.State
  isShowParticipantsDrawer!: boolean;

  //Methods
  @room.Mutation
  toggleVoice!: () => void;

  @room.Mutation
  toggleCamera!: () => void;

  @room.Mutation
  toggleScreenDemonstration!: () => void;

  @room.Mutation
  toggleChatDrawer!: () => void;

  @room.Mutation
  toggleParticipantsDrawer!: () => void;

  @room.Mutation
  setMediaStream!: (mediaStream: MediaStream) => void;

  @room.Mutation
  addTrackToStream!: (mediaTrack: MediaStreamTrack) => void;

  @room.Mutation
  replaceVideoTracks!: (newTrack: MediaStreamTrack) => void;

  changeWebcamHandler(): void {
    this.toggleCamera();
    const [webcam] = this.mediaStream.getVideoTracks();
    webcam.enabled = this.isCameraOn;
    this.$socket.client.emit('toggleParticipantCamera', { peerId: this.peer.id });
  }

  changeVoiceHandler(): void {
    this.toggleVoice();
    const [microphone] = this.mediaStream.getAudioTracks();
    microphone.enabled = this.isVoiceOn;
    this.$socket.client.emit('toggleParticipantVoice', { peerId: this.peer.id });
  }

  leaveRoom(): void {
    this.$router.replace({ name: 'EnterName' });
  }

}
</script>

<style scoped>

</style>