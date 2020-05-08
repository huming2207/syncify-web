<template>
  <div class="browser">
    <v-content>
      <FileBrowser />
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
