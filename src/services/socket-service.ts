import {Socket} from 'socket.io-client';
import {io} from 'socket.io-client';

class SocketService {
    public socket: Socket;

    constructor() {
        this.socket = io({withCredentials: true});
    }

    public connect(): void {
        this.socket = io('http://localhost:5000', {withCredentials: true});
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}

export default new SocketService();