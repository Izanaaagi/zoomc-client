import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {api} from '@/api';
import {Axios} from 'axios';
import {RoomParticipant} from '@/interfaces/room-participant';

@Module({namespaced: true, name: 'Room'})
export class Room extends VuexModule {
    public roomId = '';
    public availableRooms: Array<string> = [];
    public participants: Array<RoomParticipant> = [];
    public isVoiceOn = false;
    public isCameraOn = false;
    public isShowScreen = false;
    public isShowChatDrawer = false;
    public isShowParticipantsDrawer = false;

    @Mutation
    public toggleVoice(): void {
        this.isVoiceOn = !this.isVoiceOn;
    }

    @Mutation
    public toggleCamera(): void {
        this.isCameraOn = !this.isCameraOn;
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
    public toggleScreenDemonstration(): void {
        this.isShowScreen = !this.isShowScreen;
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
    setAvailableRooms(availableRooms: Array<string>): void {
        this.availableRooms = availableRooms;
    }

    @Action({rawError: true})
    public createRoom(): Promise<Axios | void> {
        return api.post('/rooms', {}, {withCredentials: true})
            .then(response => {
                const roomId = response.data.roomId
                this.context.commit('setRoomId', roomId)
            })
    }

}