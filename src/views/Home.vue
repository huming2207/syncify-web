<template>
  <div class="home">
    <v-content>
      <Login />
    </v-content>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Login from '@/components/Login.vue';

export default {
  name: 'Home',
  components: {
    Login,
  },
};
</script>
