import Vue from "vue";
import Router from "vue-router";

import DefaultPage from "../pages/Default";

// import dataConfig data.from '../dataConfig.data.json'
import dataConfig from "../config";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/api/users.js",
    },
    {
      path: "/login",
      component: DefaultPage,
      props: {
        _meta: dataConfig.data._meta,
        initialData: dataConfig.data.login.data,
        successHandle: { type: "redirect", url: "/login" },
      },
    },
    {
      path: "/register",
      component: DefaultPage,
      props: {
        _meta: dataConfig.data._meta,
        initialData: dataConfig.data.register.data,
        successHandle: { type: "message" },
      },
    },
    {
      path: "/forgot-password",
      component: DefaultPage,
      props: {
        _meta: dataConfig.data._meta,
        initialData: dataConfig.data.forgotPassword.data,
        successHandle: { type: "message" },
      },
    },
    {
      path: "/change-password",
      component: DefaultPage,
      props: {
        _meta: dataConfig.data._meta,
        initialData: dataConfig.data.changePassword.data,
        successHandle: { type: "message" },
      },
    },
    {
      path: "/validate",
      component: DefaultPage,
      props: {
        _meta: dataConfig.data._meta,
        initialData: dataConfig.data.validate.data,
      },
    },

    // otherwise redirect to home
    { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = [
    "/api/users.js",
    "/login",
    "/register",
    "/validate",
    "/forgot-password",
    "/change-password",
  ];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});
