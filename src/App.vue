<template>
  <v-app>
    <v-app-bar app absolute color="primary" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>PumGall Tool</v-app-bar-title>

      <v-spacer></v-spacer>

      <template v-slot:extension>
        <v-tabs>
          <v-tab to="/">Main</v-tab>
          <v-tab to="/songlist">Song List</v-tab>
          <v-tab to="/ucslist">UCS List</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-footer class="justify-center">
      <a
        class="text-right"
        href="https://gall.dcinside.com/board/lists/?id=pumpitup"
        target="_blank"
        >Pump It Up Gallery</a
      >
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
// import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: "App",

  components: {
    // HelloWorld,
  },

  data: () => ({
    //
  }),
});
</script>
