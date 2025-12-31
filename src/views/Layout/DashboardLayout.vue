<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'ni ni-tv-2 text-primary',
          }"
        >
        </sidebar-item>

        <!-- <sidebar-item
            :link="{
              name: 'Icons',
              path: '/icons',
              icon: 'ni ni-planet text-blue'
              }"
            >
        </sidebar-item>

        <sidebar-item
              :link="{
                name: 'Maps',
                path: '/maps',
                icon: 'ni ni-pin-3 text-orange'
              }">
        </sidebar-item>

        <sidebar-item
              :link="{
                name: 'User Profile',
                path: '/profile',
                icon: 'ni ni-single-02 text-yellow'
                }">
        </sidebar-item>

        <sidebar-item
                :link="{
                  name: 'Tables',
                  path: '/tables',
                  icon: 'ni ni-bullet-list-67 text-red'
                }">
        </sidebar-item> -->

        <sidebar-item
                :link="{
                  name: 'Tags',
                  path: '/tags',
                  icon: 'ni ni-tag text-black'
                }">
        </sidebar-item>

        <sidebar-item
                :link="{
                  name: 'Email',
                  path: '/email',
                  icon: 'ni ni-email-83 text-red'
                }">
        </sidebar-item>

        <sidebar-item
                :link="{
                  name: 'Email Sender',
                  path: '/email-senders',
                  icon: 'ni ni-send text-orange'
                }">
        </sidebar-item>

        <sidebar-item
                :link="{
                  name: 'KOL',
                  path: '/kols',
                  icon: 'ni ni-user-run text-red'
                }">
        </sidebar-item>

        <!-- <sidebar-item
                :link="{
                  name: 'KOL-Edit',
                  path: '/kols-edit',
                  icon: 'ni ni-user-run text-red'
                }">
        </sidebar-item> -->

        <sidebar-item
                :link="{
                  name: 'Products',
                  path: '/products',
                  icon: 'ni ni-bag-17 text-red'
                }">
        </sidebar-item>

        <!-- <sidebar-item
                :link="{
                  name: 'Products-Edit',
                  path: '/products-edit',
                  icon: 'ni ni-bag-17 text-red'
                }">
        </sidebar-item> -->

        <sidebar-item
                  :link="{
                    name: 'Login',
                    path: '/login',
                    icon: 'ni ni-key-25 text-info'
                  }">
        </sidebar-item>
        <sidebar-item
                  :link="{
                    name: 'Register',
                    path: '/register',
                    icon: 'ni ni-circle-08 text-pink'
                  }">
        </sidebar-item>
      </template>

      <!-- <template slot="links-after">
        <hr class="my-3">
        <h6 class="navbar-heading p-0 text-muted">Documentation</h6>

        <b-nav class="navbar-nav mb-md-3">
          <b-nav-item
               href="https://www.creative-tim.com/learning-lab/bootstrap-vue/quick-start/argon-dashboard"
               >
              <i class="ni ni-spaceship"></i>
              <b-nav-text class="p-0">Getting started</b-nav-text>
          </b-nav-item>
          <b-nav-item href="https://www.creative-tim.com/learning-lab/bootstrap-vue/colors/argon-dashboard">
              <i class="ni ni-palette"></i>
              <b-nav-text class="p-0">Foundation</b-nav-text>
          </b-nav-item>
          <b-nav-item href="https://www.creative-tim.com/learning-lab/bootstrap-vue/avatar/argon-dashboard">
              <i class="ni ni-ui-04"></i>
              <b-nav-text class="p-0">Components</b-nav-text>
          </b-nav-item>
        </b-nav>
      </template> -->
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import DashboardContent from './Content.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      FadeTransition
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('sidenav');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
/* KOL Marketing Company - Vibrant Right Side Styles */

.wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
}

.main-content {
  position: relative;
  z-index: 1;
  background: transparent;
  min-height: 100vh;
  
  /* 自定義navbar樣式已移至DashboardNavbar組件 */
  
  /* Container styling - 移除所有Bootstrap container的默認樣式 */
  .container-fluid {
    background: transparent !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    backdrop-filter: none !important;
    border: none !important;
    box-shadow: none !important;
    min-height: auto !important;
    position: static !important;
    overflow: visible !important;
  }
}

/* Animations */
@keyframes titleGlow {
  from {
    box-shadow: 0 0 10px rgba(255,107,107,0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(78,205,196,0.8);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    .container-fluid {
      margin: 10px;
      padding: 20px;
      border-radius: 15px;
    }
    
    .navbar-top {
      padding: 10px 0;
      
      .h4 {
        font-size: 1.4rem;
      }
    }
  }
}

/* Enhanced dropdown styling */
.dropdown-menu {
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  padding: 10px 0;
  
  .dropdown-item {
    padding: 12px 20px;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 2px 10px;
    
    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: translateX(5px);
    }
    
    i {
      margin-right: 10px;
      transition: all 0.3s ease;
    }
    
    &:hover i {
      transform: scale(1.1);
    }
  }
  
  .dropdown-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
    margin: 5px 10px;
    padding: 10px 15px;
    font-weight: 600;
  }
}

/* Footer styling */
.content-footer {
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: 30px;
  padding: 20px 0;
  text-align: center;
  color: rgba(255,255,255,0.8);
}
</style>
