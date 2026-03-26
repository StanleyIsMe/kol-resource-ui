<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'ni ni-tv-2',
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Tags',
            path: '/tags',
            icon: 'ni ni-tag',
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Email',
            icon: 'ni ni-email-83',
          }"
          :menu="true">
          <sidebar-item
            :link="{
              name: 'Send Email',
              path: '/email',
              icon: 'ni ni-email-83',
            }">
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Email Senders',
              path: '/email-senders',
              icon: 'ni ni-send',
            }">
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Email Jobs',
              path: '/email-jobs',
              icon: 'ni ni-bullet-list-67',
            }">
          </sidebar-item>
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'KOL',
            path: '/kols',
            icon: 'ni ni-single-02',
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Products',
            path: '/products',
            icon: 'ni ni-bag-17',
          }">
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar></dashboard-navbar>
      <div class="gcp-page-content" @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition
    }
  };
</script>
<style lang="scss">
.wrapper {
  background-color: #f1f3f4;
  min-height: 100vh;
}

.main-content {
  background-color: #f1f3f4;
  min-height: 100vh;
}

.gcp-page-content {
  padding: 24px;
}
</style>
