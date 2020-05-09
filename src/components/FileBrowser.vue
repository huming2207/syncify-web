<template>
  <div class="fileBrowser">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="files"
        :items-per-page="10"
        class="elevation-1"
        :key="tableRenderCounter"
        @load="loadTable"
        @click:row="handleItemClick"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-4" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon medium class="mr-3" @click="copyItem(item)">
            mdi-content-copy
          </v-icon>
          <v-icon medium @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.typeIcon="{ item }">
          <v-icon x-large :color="item.type === 'Directory' ? 'yellow darken-2' : 'cyan darken-2'">
            {{ item.type === "Directory" ? "mdi-folder" : "mdi-file-document" }}
          </v-icon>
        </template>
      </v-data-table>
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
import axios from "axios";
import path from "path";
import { loginWithJwt } from "../common/AxiosHelper";

export default {
  data: () => ({
    headers: [
      { text: "", value: "typeIcon", sortable: false },
      { text: "Name", align: "start", sortable: true, value: "name" },
      { text: "Type", value: "type", sortable: true },
      { text: "Size", value: "size", sortable: true },
      { text: "Actions", value: "actions", sortable: false }
    ],
    files: [],
    dialog: false,
    unauthorised: false,
    dialogTitle: "",
    dialogText: "",
    tableRenderCounter: 0
  }),
  props: {
    path: String
  },
  mounted() {
    this.loadTable();
  },
  methods: {
    loadTable() {
      const currPath = this.path || "/";
      axios
        .get("/api/path", {
          params: {
            path: currPath
          },
          ...loginWithJwt()
        })
        .then(resp => {
          console.log(resp);
          if (!resp.data.data) {
            this.dialogText = "Please check your internet connection";
            this.dialogTitle = "Something went wrong...";
            this.dialog = true;
          }

          const { data } = resp.data;
          data.files.forEach(element => {
            this.files.push({ type: element.type, size: element.size, name: element.name });
          });

          data.dirs.forEach(element => {
            this.files.push({ type: "Directory", size: 0, name: element.name });
          });
        })
        .catch(err => {
          if (err && err.response) {
            const resp = err.response;
            this.dialogText = resp.data.message;
            this.dialogTitle = "Something went wrong...";
            this.dialog = true;
            this.unauthorised = resp.status === 401;
          } else {
            console.log(err);
            this.dialogText = "Unknown error, please check your Internet connection";
            this.dialogTitle = "Something went wrong...";
            this.dialog = true;
          }
        });
    },
    closeDialog() {
      this.dialog = false;
      if (this.unauthorised) this.$router.push({ path: "/" });
    },
    handleItemClick(item) {
      const currPath = path.join(this.path || "/", item.name);
      if (item.type === "Directory") {
        this.$router.push({
          path: "/browser",
          query: { path: currPath }
        });
      }
    }
    // editItem(item) {},
    // copyItem(item) {},
    // deleteItem(item) {}
  }
};
</script>
