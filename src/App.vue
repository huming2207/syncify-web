<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <a href="/browser" class="white--text font-weight-bold" style="text-decoration: none;">
          Syncify
        </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <router-view />
    <v-footer absolute class="primary white--text">
      <v-spacer></v-spacer>
      <a href="/about" class="white--text font-weight-regular" style="text-decoration: none;">
        <v-icon class="primary white--text">mdi-information</v-icon>
      </a>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data: () => ({
    //
  })
});
</script>
