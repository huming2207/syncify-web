<template>
  <div class="userPortal">
    <v-container>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>User info</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <p class="display-1 text--primary">Hello, {{ this.username }}!</p>
          <div class="text--primary">ID: {{ this.id }}</div>
          <div class="text--primary">Email: {{ this.email }}</div>
        </v-card-text>
      </v-card>
      <v-card class="mt-2">
        <v-toolbar color="secondary" dark flat>
          <v-toolbar-title>Update password</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <ValidationObserver ref="observer">
            <v-form>
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
          <v-btn large color="primary" @click="submit()">Update password</v-btn>
        </v-card-actions>
      </v-card>
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
            <v-btn large color="primary" @click="closeDialog()">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
import { required, email, min, max } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";

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

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    dialog: false,
    dialogTitle: "",
    dialogText: "",
    username: "",
    email: "",
    id: ""
  }),
  mounted: () => {
    this.$nextTick(async () => {
      try {
        const resp = await this.$api.loginUser(this.username, this.password);
        if (!resp.data.data || !resp.data.data.token) {
          this.dialogText = resp.data.message;
          this.dialogTitle = "Something went wrong...";
          this.dialog = true;
        } else {
          this.username = resp.data.username;
          this.email = resp.data.email;
          this.id = resp.data.id;
        }
      } catch (err) {
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
      }
    });
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.dialogTitle = "";
      this.dialogText = "";
    }
  }
};
</script>
