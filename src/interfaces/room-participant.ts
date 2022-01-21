export interface RoomParticipant {
  peerId: string;
  username: string;
  mediaStream?: MediaStream;
  socketId?: string;
  isVoiceOn: boolean;
  isCameraOn: boolean;
}