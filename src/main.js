/*!

=========================================================
* BootstrapVue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';
// import ClassicEditor from '../public/custom-ckeditor/ckeditor.js';
import App from './App.vue';
import CKEditor from 'ckeditor4-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Swal from 'sweetalert2';
// router setup
import router from './routes/router';
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(CKEditor);
Vue.use(VueAxios,axios);

// Setup axios response interceptor to handle DUPLICATED_RESOURCE error
axios.interceptors.response.use(
  response => response,
  error => {
    // Check for HTTP status 400 and error_code = DUPLICATED_RESOURCE
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data &&
      error.response.data.error_code === 'DUPLICATED_RESOURCE'
    ) {
      // Show alert with error_message from API response
      const errorMessage = error.response.data.error_message || 'Resource already exists';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
    // Return the error to allow component-level error handling
    return Promise.reject(error);
  }
);

// Vue.prototype.$axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
});
