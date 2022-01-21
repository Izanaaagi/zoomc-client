import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import cookie from 'js-cookie';
import Peer from 'peerjs';


@Module({ namespaced: true, name: 'User' })
export class User extends VuexModule {
  public username = '' || cookie.get('username');
  public socketId!: string;

  public mediaStream?: MediaStream;
  public peer!: Peer;
  public call!: Peer.MediaConnection;
  public isPeer = false;

  @Mutation
  public setName(name: string): void {
    this.username = name;
    cookie.set('username', name, { expires: 7 });
  }

  @Mutation
  public setSocketId(id: string): void {
    this.socketId = id;
  }

  @Mutation
  public setMediaStream(mediaStream: MediaStream): void {
    this.mediaStream = mediaStream;
  }
}