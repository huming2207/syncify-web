<template>
  <div class="login">
    <v-content>
      <LoginForm />
    </v-content>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "Login",
  components: {
    LoginForm
  }
};
</script>
