<template>
    <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">
            <navbar-toggle-button @click.native="showSidebar">
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/">
                <img :src="logo" class="navbar-brand-img" alt="Logo">
            </router-link>

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
#sidenav-main {
  background: #ffffff;
  border-right: 1px solid #dadce0;
  box-shadow: none;

  .navbar-brand {
    padding: 16px 24px;
    margin: 0;

    .navbar-brand-img {
      max-height: 36px;
    }
  }

  .navbar-nav {
    padding: 8px 0;

    .nav-item {
      margin-bottom: 0;

      .nav-link {
        padding: 10px 24px;
        color: #5f6368;
        font-weight: 500;
        font-size: 0.875rem;
        border-left: 3px solid transparent;
        border-radius: 0;
        transition: background-color 0.15s ease;

        &:hover {
          background-color: #f1f3f4;
          color: #202124;
        }

        &.active {
          background-color: #e8f0fe;
          color: #1a73e8;
          border-left-color: #1a73e8;
          font-weight: 600;

          i {
            color: #1a73e8;
          }
        }

        i {
          font-size: 1rem;
          margin-right: 12px;
          color: #5f6368;
          width: 20px;
          text-align: center;
        }

        .nav-link-text {
          font-size: 0.875rem;
        }
      }
    }
  }
}

.navbar-toggler {
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 6px 10px;
}

#sidenav-main::-webkit-scrollbar {
  width: 4px;
}

#sidenav-main::-webkit-scrollbar-track {
  background: transparent;
}

#sidenav-main::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 2px;
}
</style>
