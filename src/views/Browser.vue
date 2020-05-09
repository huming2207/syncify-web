<template>
  <div class="browser">
    <v-content>
      <FileBrowser :path="this.$route.query.path" :key="this.$route.query.path" />
    </v-content>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import FileBrowser from "@/components/FileBrowser.vue";

export default {
  name: "Browser",
  components: {
    FileBrowser
  }
};
</script>
