import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import FileBrowser from "../views/Browser.vue";
import User from "../views/User.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    meta: { title: "Login - Syncify" },
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "Register - Syncify" },
    component: Register
  },
  {
    path: "/browser",
    name: "Browser",
    meta: { title: "File browser - Syncify" },
    component: FileBrowser
  },
  {
    path: "/user",
    name: "UserPortal",
    meta: { title: "File browser - Syncify" },
    component: User
  },
  {
    path: "/about",
    name: "About",
    meta: { title: "About - Syncify" },
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
