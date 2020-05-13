import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { SyncifyApiClient } from "./common/SyncifyApiClient";

Vue.config.productionTip = false;
Vue.prototype.$api = new SyncifyApiClient();

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
