import Vue from 'vue';
import Router from 'vue-router';

import DefaultPage from '../pages/Default'

// import dataConfig data.from '../dataConfig.data.json'
import dataConfig from '../config'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/login', component: DefaultPage, props: { _meta: dataConfig.data._meta, data: dataConfig.data.login.data } },
    { path: '/register', component: DefaultPage, props: { _meta: dataConfig.data._meta, data: dataConfig.data.register.data } },
    { path: '/forgot-password', component: DefaultPage, props: { _meta: dataConfig.data._meta, data: dataConfig.data.forgotPassword.data } },
    { path: '/change-password', component: DefaultPage, props: { _meta: dataConfig.data._meta, data: dataConfig.data.changePassword.data } },
    { path: '/validate', component: DefaultPage, props: { _meta: dataConfig.data._meta, data: dataConfig.data.validate.data } },

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register', '/validate', '/forgot-password', '/change-password'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})