import {Module, VuexModule, Mutation} from 'vuex-module-decorators';
import cookie from 'js-cookie';


@Module({namespaced: true, name: 'User'})
export class User extends VuexModule {
    public username = '' || cookie.get('username');
    public socketId = '';

    @Mutation
    public setName(name: string): void {
        this.username = name;
        cookie.set('username', name, {expires: 7})
    }

    @Mutation setSocketId(id: string): void {
        this.socketId = id;
    }
}