import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { api } from '@/api';
import { Axios } from 'axios';
import { RoomParticipant } from '@/interfaces/room-participant';
import Peer from 'peerjs';
import Vue from 'vue';

@Module({ namespaced: true, name: 'Room' })
export class Room extends VuexModule {
  public roomId = '';
  public availableRooms: Array<string> = [];

  public participants: Array<RoomParticipant> = [];

  public mediaStream: MediaStream = new MediaStream();
  public peer!: Peer;
  public call!: Peer.MediaConnection;

  public isVoiceOn = true;
  public isCameraOn = true;
  public isShowChatDrawer = false;
  public isShowParticipantsDrawer = false;

  @Mutation
  public toggleVoice(): void {
    this.isVoiceOn = !this.isVoiceOn;
    const myIndex = this.participants.findIndex((participant) => participant.peerId === this.peer.id);
    this.participants[myIndex].isVoiceOn = this.isVoiceOn;
  }

  @Mutation
  public toggleCamera(): void {
    this.isCameraOn = !this.isCameraOn;
    const myIndex = this.participants.findIndex((participant) => participant.peerId === this.peer.id);
    this.participants[myIndex].isCameraOn = this.isCameraOn;
  }

  @Mutation
  public toggleParticipantVoice(peerId: string): void {
    const participantIndex = this.participants.findIndex((participant) => participant.peerId === peerId);
    const participant = this.participants[participantIndex];
    Vue.set(this.participants, participantIndex, { ...participant, isVoiceOn: !participant.isVoiceOn });
  }

  @Mutation
  public toggleParticipantCamera(peerId: string): void {
    const participantIndex = this.participants.findIndex((participant) => participant.peerId === peerId);
    const participant = this.participants[participantIndex];
    Vue.set(this.participants, participantIndex, { ...participant, isCameraOn: !participant.isCameraOn });
  }


  @Mutation
  public toggleChatDrawer(): void {
    this.isShowChatDrawer = !this.isShowChatDrawer;
  }

  @Mutation
  public toggleParticipantsDrawer(): void {
    this.isShowParticipantsDrawer = !this.isShowParticipantsDrawer;
  }

  @Mutation
  public setRoomId(roomId: string): void {
    this.roomId = roomId;
  }

  @Mutation
  setParticipants(participants: Array<RoomParticipant>): void {
    this.participants = participants;
  }

  @Mutation
  addParticipant(addedParticipant: RoomParticipant): void {
    this.participants.push(addedParticipant);
  }

  @Mutation
  removeParticipant(id: string): void {
    this.participants = this.participants.filter(participant => {
      return participant.peerId !== id;
    });
  }

  @Mutation
  addStreamToParticipant(payload: Pick<RoomParticipant, 'mediaStream' | 'peerId'>): void {
    const participantIndex = this.participants.findIndex((participant) => participant.peerId === payload.peerId);
    const participant = this.participants[participantIndex];
    const isStreamExist = participant.mediaStream !== undefined;
    isStreamExist || Vue.set(this.participants, participantIndex, { ...participant, mediaStream: payload.mediaStream });

  }

  @Mutation
  setAvailableRooms(availableRooms: Array<string>): void {
    this.availableRooms = availableRooms;
  }

  @Mutation
  setMediaStream(mediaStream: MediaStream): void {
    this.mediaStream = mediaStream;
  }

  @Mutation
  addTrackToStream(mediaTrack: MediaStreamTrack): void {
    this.mediaStream.addTrack(mediaTrack);
  }

  @Mutation
  setPeer(peer: Peer): void {
    this.peer = peer;
  }

  @Mutation
  setCall(call: Peer.MediaConnection): void {
    this.call = call;
  }

  @Mutation
  replaceVideoTracks(newTrack: MediaStreamTrack): void {
    const [oldTrack] = this.mediaStream.getVideoTracks();
    oldTrack.stop();
    this.mediaStream.removeTrack(oldTrack);
    this.mediaStream.addTrack(newTrack);
  }

  @Mutation
  resetRoom(): void {
    stopAllTracks(this.mediaStream);
    this.roomId = '';
    this.mediaStream = new MediaStream();
    this.availableRooms = [];
    this.participants = [];
    this.isVoiceOn = true;
    this.isCameraOn = true;
    this.isShowChatDrawer = false;
    this.isShowParticipantsDrawer = false;
  }

  @Action({ rawError: true })
  public createRoom(): Promise<Axios | void> {
    return api.post('/rooms', {}, { withCredentials: true })
      .then(response => {
        const roomId = response.data.roomId;
        this.context.commit('setRoomId', roomId);
      });
  }

}

function stopAllTracks(mediaStream: MediaStream): void {
  mediaStream.getTracks().forEach((track) => track.stop());
}