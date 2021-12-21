<template>
  <div class='d-flex flex-column justify-center align-center'>
    <v-card outlined max-width='450px' class='mt-16 self'>
      <v-row md='6' class='mx-auto d-flex justify-center' justify='center'>
        <v-col class='pa-8' algn>
          <v-alert
            v-if='errors.length > 0'
            color='red'
            dismissible
            elevation='8'
            outlined
            text>
            <v-list-item>
              <v-list-item-content v-for='error in errors' v-bind:key='error.text'>
                <v-list-item-title>
                  {{ error.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-alert>
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
import { Error } from '@/interfaces/error';

const room = namespace('Room');
const user = namespace('User');
const errors = namespace('Errors');

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

  @errors.State
  errors!: Array<Error>;

  //Methods
  @room.Action
  createRoom!: () => Promise<Axios | void>;

  @user.Mutation
  setName!: (name: string) => void;

  @errors.Mutation
  clearErrors!: () => void;

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
  beforeDestroy(): void {
    this.clearErrors();
  }
}
</script>

<style scoped>
</style>