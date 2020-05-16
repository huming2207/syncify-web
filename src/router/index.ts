import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FileBrowser from "../views/Browser.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    meta: { title: "Login - Syncify" },
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "Register - Syncify" },
    component: () => import(/* webpackChunkName: "register" */ "../views/Register.vue")
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
    component: () => import(/* webpackChunkName: "user" */ "../views/User.vue")
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
