import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import CKEditor from 'ckeditor4-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './routes/router';

Vue.use(DashboardPlugin);
Vue.use(CKEditor);
Vue.use(VueAxios, axios);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (router.currentRoute.name !== 'login') {
        router.push({ name: 'login' });
      }
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data &&
      error.response.data.error_code === 'DUPLICATED_RESOURCE'
    ) {
      const errorMessage = error.response.data.error_message || 'Resource already exists';
      const toastEl = document.createElement('div');
      toastEl.id = 'global-toast-target';
      const vm = new Vue({
        render: h => h('div'),
        mounted() {
          this.$bvToast.toast(errorMessage, {
            title: 'Error',
            variant: 'danger',
            solid: true,
            autoHideDelay: 5000,
            toaster: 'b-toaster-top-right'
          });
        }
      });
      vm.$mount(toastEl);
      setTimeout(() => vm.$destroy(), 6000);
    }

    return Promise.reject(error);
  }
);

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
