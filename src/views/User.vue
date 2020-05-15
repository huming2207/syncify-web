<template>
  <div class="user">
    <v-content>
      <UserPortal />
    </v-content>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import UserPortal from "@/components/UserPortal.vue";

export default {
  name: "User",
  components: {
    UserPortal
  }
};
</script>
