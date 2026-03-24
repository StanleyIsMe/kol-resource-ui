<template>
  <nav class="gcp-navbar">
    <div class="gcp-navbar-left">
      <h6 class="gcp-navbar-title">{{ routeName }}</h6>
    </div>
    <div class="gcp-navbar-right">
      <base-dropdown menu-on-right
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <b-media no-body class="align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img alt="User Avatar" src="img/theme/bichon-logo.png">
            </span>
            <b-media-body class="ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold" style="color: #202124;">{{ adminName }}</span>
            </b-media-body>
          </b-media>
        </a>

        <template>
          <b-dropdown-header class="noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </b-dropdown-header>
          <div class="dropdown-divider"></div>
          <b-dropdown-item @click="logout">
            <i class="ni ni-user-run"></i>
            <span>Logout</span>
          </b-dropdown-item>
        </template>
      </base-dropdown>
    </div>
  </nav>
</template>
<script>
export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      if (!name) return '';
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  },
  data() {
    return {
      adminName: localStorage.getItem('user')
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style lang="scss" scoped>
.gcp-navbar {
  background: #ffffff;
  border-bottom: 1px solid #dadce0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
}

.gcp-navbar-title {
  color: #202124;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
  text-transform: capitalize;
}

.gcp-navbar-right {
  display: flex;
  align-items: center;
}

.avatar {
  border: 1px solid #dadce0;
}
</style>
