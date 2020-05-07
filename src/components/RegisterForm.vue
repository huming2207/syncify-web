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
              <ValidationObserver ref="observer">
                <v-form>
                  <ValidationProvider v-slot="{ errors }" name="Name" rules="required|min:3|max:60">
                    <v-text-field
                      v-model="username"
                      label="Username"
                      name="username"
                      :error-messages="errors"
                      prepend-icon="mdi-account"
                      type="text"
                    />
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                    <v-text-field
                      v-model="email"
                      label="Email"
                      name="email"
                      :error-messages="errors"
                      prepend-icon="mdi-mail"
                      type="email"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                    rules="required|min:8|max:20|password:@confirm"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      id="password"
                      v-model="password"
                      label="Password"
                      name="password"
                      type="password"
                      :error-messages="errors"
                      prepend-icon="mdi-key"
                    />
                  </ValidationProvider>
                  <ValidationProvider name="confirm" rules="required" v-slot="{ errors }">
                    <v-text-field
                      id="comfirm"
                      v-model="confirmation"
                      label="Repeat password"
                      name="comfirm"
                      type="password"
                      :error-messages="errors"
                      prepend-icon="mdi-key"
                    />
                  </ValidationProvider>
                </v-form>
              </ValidationObserver>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="submit()">Create account</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            {{ dialogTitle }}
          </v-card-title>

          <v-card-text>
            {{ dialogText }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import qs from "qs";
import { required, email, min, max } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";
import { AxiosEncodedFormConfig } from "../common/AxiosHelper";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "Required field"
});

extend("min", {
  ...min,
  message: "Can't be less than {length} characters"
});

extend("max", {
  ...max,
  message: "Can't be more than {length} characters"
});

extend("email", {
  ...email,
  message: "Invalid email format"
});

extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match"
});

export default Vue.extend({
  name: "RegisterForm",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    username: "",
    email: "",
    password: "",
    confirmation: "",
    dialog: false,
    dialogTitle: "",
    dialogText: ""
  }),
  methods: {
    submit() {
      this.$refs.observer.validate().then(result => {
        if (result) {
          console.log("Correct");
          axios
            .post(
              "/api/register",
              qs.stringify({
                username: this.username,
                password: this.password,
                email: this.email
              }),
              AxiosEncodedFormConfig
            )
            .then(resp => {
              this.dialogText = resp.message;
              this.dialogTitle = "Account created";
              this.dialog = true;
            })
            .catch(err => {
              this.dialogText = err.message;
              this.dialogTitle = "Something went wrong";
              this.dialog = true;
            });
        }
      });
    },
    clear() {
      this.username = "";
      this.email = "";
      this.password = "";
      this.$refs.observer.reset();
    }
  }
});
</script>
