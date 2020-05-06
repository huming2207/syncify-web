<template>
  <div class="registerForm">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Register</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Register"
                  name="register"
                  prepend-icon="mdi-account"
                  type="text"
                />
                <v-text-field label="Email" name="email" prepend-icon="mdi-mail" type="email" />
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  prepend-icon="mdi-key"
                />
                <v-text-field
                  id="repeat_password"
                  label="Repeat password"
                  name="repeat_password"
                  type="password"
                  prepend-icon="mdi-key"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary">Create account</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
  name: "RegisterForm"
});
</script>
