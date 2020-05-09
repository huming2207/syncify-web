<template>
  <div class="fileBrowser">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="files"
        :items-per-page="10"
        class="elevation-1"
        :key="tableRenderCounter"
        @click:row="handleItemClick"
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
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import path from "path";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { loginWithJwt } from "../common/AxiosHelper";

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data: () => ({
    headers: [
      { text: "", value: "typeIcon", sortable: false },
      { text: "Name", align: "start", sortable: true, value: "name" },
      { text: "Type", value: "type", sortable: true },
      { text: "Size", value: "size", sortable: true },
      { text: "Actions", value: "actions", sortable: false }
    ],
    files: [],
    errorDialog: false,
    unauthorised: false,
    errorDialogTitle: "",
    errorDialogText: "",
    tableRenderCounter: 0,
    uploadDialog: false,
    newDirDialog: false,
    chosenFile: null,
    newDirName: "",
    dropzoneOptions: {
      url: "/api/file",
      thumbnailWidth: 100,
      headers: { ...loginWithJwt().headers },
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
        const resp = await axios.get("/api/path", {
          params: {
            path: currPath
          },
          ...loginWithJwt()
        });

        if (!resp.data.data) {
          this.errorDialogText = "Please check your internet connection";
          this.errorDialogTitle = "Something went wrong...";
          this.errorDialog = true;
        }

        const { data } = resp.data;
        data.files.forEach(element => {
          this.files.push({ type: element.type, size: element.size, name: element.name });
        });

        data.dirs.forEach(element => {
          this.files.push({ type: "Directory", size: 0, name: element.name });
        });
      } catch (err) {
        if (err.response) {
          const resp = err.response;
          this.errorDialogText = resp.data.message;
          this.errorDialogTitle = "Something went wrong...";
          this.errorDialog = true;
          this.unauthorised = resp.status === 401;
        } else {
          console.error(err);
          this.errorDialogText = "Unknown error, please check your Internet connection";
          this.errorDialogTitle = "Something went wrong...";
          this.errorDialog = true;
        }
      }
    },
    closeDialog() {
      this.errorDialog = false;
      if (this.unauthorised) this.$router.push({ path: "/" });
    },
    handleItemClick(item) {
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
      }
    },
    updateDropzoneUrl() {
      this.$refs.dropzone.setOption("url", `/api/file?path=${this.path}`);
    },
    async finishFileUpload() {
      await this.loadTable();
      this.$refs.dropzone.removeAllFiles();
      this.uploadDialog = false;
      this.tableRenderCounter += 1;
    },
    createNewDir() {
      console.log(this.chosenFile);
    }
    // editItem(item) {},
    // copyItem(item) {},
    // deleteItem(item) {}
  }
};
</script>
