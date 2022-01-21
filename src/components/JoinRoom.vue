<template>
  <div class='d-flex justify-center'>
    <v-card outlined max-width='450px' class='mt-16 self'>
      <v-row md='6' class='mx-auto d-flex justify-center' justify='center'>
        <v-col class='pa-8' algn>
          <p class='text-h4 flex-column text-center'>
            Enter room key
          </p>
          <v-row class='d-flex justify-center'>
            <v-text-field
              v-model='UUID'
              label='Key'
              outlined
              ref='UUIDField'
              :rules='[rules.required, rules.isUUID, isRoomAvailable]'
            ></v-text-field>
          </v-row>
          <v-row justify='center'>
            <v-col cols='6' class='d-flex justify-center'>
              <v-btn :to="{name: 'EnterName'}" large color='error'>Back</v-btn>
            </v-col>
            <v-col cols='6' class='d-flex justify-center'>
              <v-btn @click='joinRoomHandler' large color='success'>Join room</v-btn>
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
import { EventListen } from '@/enums/event-listen';
import { EventEmit } from '@/enums/event-emit';
import { Socket } from 'vue-socket.io-extended';

const room = namespace('Room');

@Component({ name: 'JoinRoom' })
export default class JoinRoom extends Vue {
  //Data
  $refs!: {
    UUIDField: Vue & { validate: (value) => boolean }
  };

  rules = {
    required: (value: string): string | boolean => !!value || 'Required',
    isUUID: (value: string): string | boolean =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value) || 'Incorrect key',
  };
  UUID = '';

  //Computed
  @room.State
  availableRooms!: Array<string>;

  //Methods
  @room.Mutation
  setAvailableRooms!: (availableRooms: Array<string>) => void;

  isRoomAvailable(value: string): string | boolean {
    return this.availableRooms.includes(value) || 'Room doesn\'t exist';
  }

  joinRoomHandler(): void {
    const isUUIDValid: boolean = this.validateUUID();
    if (isUUIDValid) {
      this.$router.push({ name: 'Room', params: { id: this.UUID } });
    }
  }

  validateUUID(): boolean {
    return this.$refs.UUIDField.validate(true);
  }

  //Sockets
  @Socket(EventListen.UPDATE_AVAILABLE_ROOMS)
  onUpdateRooms(availableRooms: Array<string>): void {
    this.setAvailableRooms(availableRooms);
  }

  //Hooks
  created(): void {
    this.$socket.client.emit(EventEmit.REQUEST_ROOMS, (availableRooms: Array<string>) => {
      this.setAvailableRooms(availableRooms);
    });
  }

}
</script>

<style scoped>

</style>