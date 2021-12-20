<template>
  <div class='d-flex justify-center'>
    <v-card outlined max-width='450px' class='mt-16 self'>
      <v-row md='6' class='mx-auto d-flex justify-center' justify='center'>
        <v-col class='pa-8' algn>
          <p class='text-h4 flex-column text-center'>
            Enter your name
          </p>
          <v-row class='d-flex justify-center'>
            <v-text-field
              :value='username'
              @input.native='changeName'
              label='Name'
              outlined
              ref='nameField'
              :rules='[rules.required]'
            ></v-text-field>
          </v-row>
          <v-row justify='center'>
            <v-col cols='6' class='d-flex justify-center'>
              <v-btn large color='primary' @click='createNewRoom'>Create room</v-btn>
            </v-col>
            <v-col cols='6' class='d-flex justify-center'>
              <v-btn large color='success' @click='joinRoom'>Join Room</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { Axios } from 'axios';
import SocketService from '@/services/socket-service';

const room = namespace('Room');
const user = namespace('User');
@Component({ name: 'EnterName' })
export default class EnterName extends Vue {
  //Data
  $refs!: {
    nameField: Vue & { validate: (value) => boolean }
  };
  socket = SocketService.socket;
  rules = {
    required: (value: string): string | boolean => !!value || 'Required',
  };

  //Computed
  @room.State
  roomId!: string;

  @user.State
  username!: string;

  //Methods
  @room.Action
  createRoom!: () => Promise<Axios | void>;

  @user.Mutation
  setName!: (name: string) => void;

  changeName(e: Event): void {
    const el = e.target as HTMLInputElement;
    this.setName(el.value);
    if (this.socket.io.engine) {
      this.socket.io.engine.close();
    }
  }

  joinRoom(): void {
    if (this.username) {
      this.$router.replace({ name: 'JoinRoom' });
    } else {
      this.validateName();
    }
  }

  createNewRoom(): void {
    if (this.username) {
      this.createRoom().then(() => {
        this.$router.replace({ name: 'Room', params: { id: this.roomId } });
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.validateName();
    }
  }

  validateName(): void {
    this.$refs.nameField.validate(true);
  }

  //Hooks
  beforeRouteEnter(to, from, next) {
    console.log('enter');
    if (to.query.redirectFrom) {
      next(vm => {
        vm.alert = 'Sorry, you have to login first!';
      });
    } else {
      next();
    }
  }

}
</script>

<style scoped>

</style>