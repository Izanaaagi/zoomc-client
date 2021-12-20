import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {Message} from '@/interfaces/message';


@Module({namespaced: true, name: 'Сhat'})
export class Chat extends VuexModule {
    public messages: Array<Message> = [];
    public messageText = '';

    @Mutation
    public addMessage(message: Message): void {
        this.messages.push(message);
    }

    @Mutation
    public clearChat(): void {
        this.messages = [];
    }

    @Mutation
    public setMessage(text: string): void {
        this.messageText = text;
    }
}