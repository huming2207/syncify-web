<template>
  <div class="fileBrowser">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="files"
        :items-per-page="10"
        class="elevation-1"
        :key="tableRenderCounter"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>File browser</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="uploadDialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">
                  <v-icon left>mdi-cloud-upload</v-icon> Upload files
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Upload new file</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <vue-dropzone
                      id="dropzone"
                      ref="dropzone"
                      @vdropzone-file-added="updateDropzoneUrl()"
                      :options="dropzoneOptions"
                    ></vue-dropzone>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="finishFileUpload()">Done</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="newDirDialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" dark class="mb-2 ml-2" v-on="on">
                  <v-icon left>mdi-folder-plus</v-icon> New directory
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Create new directory</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field
                      v-model="newDirName"
                      label="New directory name"
                      required
                    ></v-text-field>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="newDirDialog = false">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="createNewDir()">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-inline-flex">
            <v-icon medium class="mr-2" @click="openItem(item)">
              mdi-arrow-right-bold-box
            </v-icon>
            <v-edit-dialog :set="(newName = '')" @save="editItem(item, newName)">
              <v-icon medium class="mr-2">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field v-model="newName" label="Rename" single-line counter></v-text-field>
              </template>
            </v-edit-dialog>
            <v-icon medium class="mr-2" @click="copyItem(item)">
              mdi-content-copy
            </v-icon>
            <v-icon medium class="mr-2" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </div>
        </template>
        <template v-slot:item.name="{ item }">
          <a v-on:click="openItem(item)">{{ item.name }}</a>
        </template>
        <template v-slot:item.type="{ item }" @click.native="openItem(item)">{{
          item.type
        }}</template>
        <template v-slot:item.typeIcon="{ item }">
          <v-icon
            @click="openItem(item)"
            x-large
            :color="item.type === 'Directory' ? 'yellow darken-2' : 'cyan darken-2'"
          >
            {{ item.type === "Directory" ? "mdi-folder" : "mdi-file-document" }}
          </v-icon>
        </template>
      </v-data-table>
      <v-dialog v-model="errorDialog" width="500">
        <v-card>
          <v-card-title class="headline">
            {{ errorDialogTitle }}
          </v-card-title>
          <v-card-text>
            {{ errorDialogText }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeDialog()">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="msgBar" :timeout="5000">
        {{ msgBarText }}
        <v-btn color="blue" text @click="msgBar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import path from "path";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { DateTime } from "luxon";
import filesize from "filesize";
import { SyncifyApiClient } from "../common/SyncifyApiClient";

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data: () => ({
    headers: [
      { text: "", align: "center", value: "typeIcon", sortable: false },
      { text: "Name", sortable: true, value: "name" },
      { text: "Type", value: "type", sortable: true },
      { text: "Size", value: "size", sortable: true },
      { text: "Last updated at", value: "updated", sortable: true },
      { text: "Created at", value: "created", sortable: true },
      { text: "Actions", value: "actions", sortable: false }
    ],
    files: [],
    unauthorised: false,
    uploadDialog: false,
    newDirDialog: false,
    errorDialog: false,
    errorDialogTitle: "",
    errorDialogText: "",
    tableRenderCounter: 0,
    newDirName: "",
    msgBar: false,
    msgBarText: "",
    dropzoneOptions: {
      url: "/api/file",
      thumbnailWidth: 100,
      headers: { ...SyncifyApiClient.loginWithJwt().headers },
      dictDefaultMessage: "Pick a new file",
      maxFiles: 1,
      maxfilesexceeded(file) {
        this.removeAllFiles();
        this.addFile(file);
      }
    }
  }),
  props: {
    path: String
  },
  mounted() {
    this.loadTable();
  },
  methods: {
    async loadTable() {
      this.files = []; // Clear the file object list
      this.files.push({ type: "Directory", size: 0, name: ".." }); // Add the ".." (to parent directory)
      const currPath = this.path || "/";
      try {
        const resp = await this.$api.listDirectory(currPath);
        const { data } = resp.data;
        data.files.forEach(element => {
          this.files.push({
            type: element.type,
            size: filesize(element.size),
            name: element.name,
            created: DateTime.fromISO(element.created).toRelative(),
            updated: DateTime.fromISO(element.updated).toRelative(),
            // eslint-disable-next-line no-underscore-dangle
            id: element._id
          });
        });

        data.dirs.forEach(element => {
          this.files.push({
            type: "Directory",
            size: 0,
            name: element.name,
            created: DateTime.fromISO(element.created).toRelative(),
            updated: DateTime.fromISO(element.updated).toRelative(),
            // eslint-disable-next-line no-underscore-dangle
            id: element._id
          });
        });
      } catch (err) {
        this.showErrorDialog(err);
      }
    },
    showErrorDialog(err) {
      if (err.response) {
        const resp = err.response;
        this.errorDialogText =
          resp.data.message || "Unknown error, please check your Internet connection";
        this.errorDialogTitle = "Something went wrong...";
        this.errorDialog = true;
        this.unauthorised = resp.status === 401;
      } else {
        console.error(err);
        this.errorDialogText = "Unknown error, please check your Internet connection";
        this.errorDialogTitle = "Something went wrong...";
        this.errorDialog = true;
      }
    },
    closeDialog() {
      this.errorDialog = false;
      if (this.unauthorised) this.$router.push({ path: "/" });
    },
    async openItem(item) {
      const currPath = path.join(this.path || "/", item.name);
      if (item.type === "Directory") {
        this.$router
          .push({
            path: "/browser",
            query: { path: currPath }
          })
          .catch(() => {
            return true; // Suppress errors here (useless)
          });
      } else {
        try {
          await this.$api.downloadFile(currPath, item.type, item.name);
        } catch (err) {
          this.showErrorDialog(err);
        }
      }
    },
    updateDropzoneUrl() {
      this.$refs.dropzone.setOption("url", `/api/file?path=${this.path}`);
    },
    async finishFileUpload() {
      await this.loadTable();
      this.$refs.dropzone.removeAllFiles();
      this.uploadDialog = false;
    },
    async createNewDir() {
      console.log(this.newDirName);
      const currPath = path.join(this.path || "/", this.newDirName);
      try {
        const resp = await this.$api.createNewDirectory(currPath);
        this.msgBarText = resp.data.message || "Directory created";
        this.msgBar = true;
        this.newDirDialog = false;
        await this.loadTable();
      } catch (err) {
        this.showErrorDialog(err);
      }
    },
    async deleteItem(item) {
      const currPath = path.join(this.path || "/", item.name);
      try {
        const resp =
          item.type === "Directory"
            ? await this.$api.deleteDirectory(currPath)
            : await this.$api.deleteFile(currPath);
        this.msgBarText = resp.data.message || "Item deleted";
        this.msgBar = true;
        this.newDirDialog = false;
        await this.loadTable();
      } catch (err) {
        this.showErrorDialog(err);
      }
    },
    async editItem(item, newName) {
      const destPath = path.join(this.path || "/", newName);
      const origPath = path.join(this.path || "/", item.name);
      try {
        let resp = null;
        if (item.type !== "Directory") {
          resp = await this.$api.moveFile(origPath, destPath);
        } else {
          resp = await this.$api.moveDirectory(origPath, destPath);
        }
        this.msgBarText = resp.data.message || "Item renamed";
        this.msgBar = true;
        this.newDirDialog = false;
        await this.loadTable();
      } catch (err) {
        this.showErrorDialog(err);
      }
    }
    // copyItem(item) {},
  }
};
</script>
