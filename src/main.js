import Vue from 'vue'
import App from './app/App';
import axios from 'axios'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)


import { router } from './_helpers';

Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});