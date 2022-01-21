<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class='text-h6'>
          Participants
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item
      v-for='user in participants'
      :key='user.id'
    >
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ user.username }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang='ts'>
import Component from 'vue-class-component';
import Vue from 'vue';
import { namespace } from 'vuex-class';
import { RoomParticipant } from '@/interfaces/room-participant';

const room = namespace('Room');

@Component({ name: 'ParticipantsDrawer' })
export default class ParticipantsDrawer extends Vue {

  //Computed
  @room.State
  participants!: Array<RoomParticipant>;
}

</script>

<style scoped>

</style>