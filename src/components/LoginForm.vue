<template>
  <div class="loginForm">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <ValidationObserver ref="observer">
                <v-form>
                  <ValidationProvider v-slot="{ errors }" rules="required|min:3|max:60">
                    <v-text-field
                      label="Login"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                      :error-messages="errors"
                      v-model="username"
                    />
                  </ValidationProvider>
                  <ValidationProvider rules="required|min:8|max:20" v-slot="{ errors }">
                    <v-text-field
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      prepend-icon="mdi-key"
                      :error-messages="errors"
                      v-model="password"
                    />
                  </ValidationProvider>
                </v-form>
              </ValidationObserver>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline">
            {{ dialogTitle }}
          </v-card-title>

          <v-card-text>
            {{ dialogText }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeDialog()">
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
import { AxiosEncodedFormConfig, loginWithJwt } from "../common/AxiosHelper";
import { LOCAL_STORAGE_JWT } from "../common/constant";

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
  name: "LoginForm",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    username: "",
    password: "",
    dialog: false,
    dialogTitle: "",
    dialogText: ""
  }),
  methods: {
    performLogin() {
      axios
        .post(
          "/api/auth/register",
          qs.stringify({
            username: this.username,
            password: this.password
          }),
          { ...AxiosEncodedFormConfig }
        )
        .then(resp => {
          if (!resp.data.data || !resp.data.data.token) {
            this.dialogText = resp.data.message;
            this.dialogTitle = "Something went wrong...";
            this.dialog = true;
          } else {
            const { token } = resp.data.data;
            console.log(token);
            localStorage.setItem(LOCAL_STORAGE_JWT, token);
            this.$router.push({ path: "/" });
          }
        })
        .catch(err => {
          if (err && err.response) {
            const resp = err.response;
            this.dialogText = resp.data.message;
            this.dialogTitle = "Something went wrong...";
            this.dialog = true;
          } else {
            this.dialogText = "Unknown error, please check your Internet connection";
            this.dialogTitle = "Something went wrong...";
            this.dialog = true;
          }
        });
    },
    closeDialog() {
      this.dialog = false;
    }
  }
});
</script>
