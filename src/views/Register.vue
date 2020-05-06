<template>
  <div class="register">
    <v-content>
      <RegisterForm />
    </v-content>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "Register",
  components: {
    RegisterForm
  }
};
</script>
