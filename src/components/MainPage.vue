<template>
  <v-app>
    <v-app-bar app>
      <v-icon>fas fa-video</v-icon>
      <v-app-bar-title class="ml-2">
        <div>
          ZoomC
        </div>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';


@Component({name: 'MainPage'})
export default class MainPage extends Vue {

}
</script>

<style>
</style>
