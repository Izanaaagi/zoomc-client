import { RoomParticipant } from './room-participant';

export interface Message {
    id: string;
    text: string;
    user: RoomParticipant;
}
