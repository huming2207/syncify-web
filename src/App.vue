<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Syncify</v-toolbar-title>
    </v-app-bar>
    <router-view />
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
