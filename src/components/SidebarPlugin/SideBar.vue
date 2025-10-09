<template>
    <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">

            <!--Toggler-->
            <navbar-toggle-button @click.native="showSidebar">
                
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/">
                <img :src="logo" class="navbar-brand-img" alt="...">
            </router-link>

            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <base-dropdown class="nav-item" menu-on-right tag="li" title-tag="a">
                        <a slot="title-container" class="nav-link nav-link-icon" href="#" role="button"
                           aria-haspopup="true" aria-expanded="false">
                            <i class="ni ni-bell-55"></i>
                        </a>

                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </base-dropdown>
                    <base-dropdown class="nav-item" menu-on-right tag="li" title-tag="a">
                        <a slot="title-container" class="nav-link" href="#" role="button">
                            <div class="media align-items-center">
                              <span class="avatar avatar-sm rounded-circle">
                                <img alt="Image placeholder" src="img/theme/team-1.jpg">
                              </span>
                            </div>
                        </a>

                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>My profile</span>
                        </router-link>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-settings-gear-65"></i>
                            <span>Settings</span>
                        </router-link>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-calendar-grid-58"></i>
                            <span>Activity</span>
                        </router-link>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-support-16"></i>
                            <span>Support</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <a href="#!" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Logout</span>
                        </a>
                    </base-dropdown>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links">
                    </slot>
                </ul>
                <!--Divider-->
                <!-- <hr class="my-3"> -->
                <!--Heading-->
                <!-- <h6 class="navbar-heading text-muted">Documentation</h6> -->
                <!--Navigation-->
                <!-- <ul class="navbar-nav mb-md-3">
                    <li class="nav-item">
                        <a class="nav-link"
                           href="https://www.creative-tim.com/learning-lab/bootstrap-vue/alerts/argon-dashboard">
                            <i class="ni ni-spaceship"></i> Getting started
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                           href="https://www.creative-tim.com/learning-lab/bootstrap-vue/colors/argon-dashboard">
                            <i class="ni ni-palette"></i> Foundation
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                           href="https://www.creative-tim.com/learning-lab/bootstrap-vue/alerts/argon-dashboard">
                            <i class="ni ni-ui-04"></i> Components
                        </a>
                    </li>
                </ul> -->
            </div>
            </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '@/components/NavbarToggleButton'

  export default {
    name: 'sidebar',
    components: {
      NavbarToggleButton
    },
    props: {
      logo: {
        type: String,
        default: 'img/theme/bichon-logo.png',
        description: 'Sidebar app logo'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      }
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>

<style lang="scss">
/* KOL Marketing Company - Vibrant Sidebar Styles */

#sidenav-main {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-right: none;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  
  .navbar-brand {
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    margin: 15px;
    padding: 15px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .navbar-brand-img {
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
  }
  
  .navbar-nav {
    padding: 20px 15px;
    
    .nav-item {
      margin-bottom: 8px;
      
      .nav-link {
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        margin: 4px 0;
        padding: 15px 20px;
        color: rgba(255,255,255,0.9);
        font-weight: 500;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        
        &:hover {
          background: rgba(255,255,255,0.2);
          color: white;
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.3);
          
          &::before {
            left: 100%;
          }
        }
        
        &.active {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          box-shadow: 0 5px 20px rgba(255,107,107,0.4);
          border-color: rgba(255,255,255,0.3);
          
          &::before {
            display: none;
          }
          
          i {
            color: white;
            text-shadow: 0 0 10px rgba(255,255,255,0.5);
          }
        }
        
        i {
          font-size: 1.2rem;
          margin-right: 12px;
          transition: all 0.3s ease;
          text-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        
        .nav-link-text {
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }
      }
    }
  }
  
  /* Special styling for different menu items */
  .nav-item:nth-child(1) .nav-link i { color: #74b9ff; } /* Dashboard */
  .nav-item:nth-child(2) .nav-link i { color: #fd79a8; } /* Tags */
  .nav-item:nth-child(3) .nav-link i { color: #fdcb6e; } /* Email */
  .nav-item:nth-child(4) .nav-link i { color: #6c5ce7; } /* KOL */
  .nav-item:nth-child(5) .nav-link i { color: #a29bfe; } /* Products */
  .nav-item:nth-child(6) .nav-link i { color: #fd79a8; } /* Login */
  .nav-item:nth-child(7) .nav-link i { color: #fdcb6e; } /* Register */
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .navbar-brand {
      margin: 10px;
      padding: 10px;
    }
    
    .navbar-nav {
      padding: 15px 10px;
      
      .nav-item .nav-link {
        padding: 12px 15px;
        margin: 2px 0;
      }
    }
  }
}

/* Sidebar toggle button enhancement */
.navbar-toggler {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.05);
  }
  
  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }
}

/* Sidebar collapse animation */
.navbar-collapse {
  transition: all 0.3s ease;
}

/* Custom scrollbar for sidebar */
#sidenav-main::-webkit-scrollbar {
  width: 6px;
}

#sidenav-main::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

#sidenav-main::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  
  &:hover {
    background: rgba(255,255,255,0.5);
  }
}
</style>
