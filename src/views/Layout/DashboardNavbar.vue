<template>
  <div class="custom-navbar">
    <!-- 左側：頁面標題 -->
    <div class="page-title-container">
      <a href="#" aria-current="page" class="h4 mb-0 text-white text-uppercase active router-link-active">
        <i class="ni ni-diamond mr-2"></i>
        {{$route.name}}
      </a>
      <div class="page-subtitle">
        <span class="badge badge-pill badge-gradient">KOL Marketing Platform</span>
      </div>
    </div>
    
    <!-- 右側：用戶資料 -->
    <div class="user-profile-container">
      <base-dropdown menu-on-right
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0 user-profile-link" @click.prevent slot="title-container">
          <b-media no-body class="align-items-center">
                  <span class="avatar avatar-sm rounded-circle user-avatar">
                    <img alt="User Avatar" src="img/theme/bichon-logo.png">
                    <div class="avatar-status"></div>
                  </span>
            <b-media-body class="ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold user-name">{{adminName}}</span>
              <small class="text-muted d-block user-role">KOL Manager</small>
            </b-media-body>
          </b-media>
        </a>

        <template>
          <b-dropdown-header class="noti-title">
            <div class="welcome-container">
              <i class="ni ni-diamond text-primary mr-2"></i>
              <h6 class="text-overflow m-0">Welcome!</h6>
            </div>
            <small class="text-muted">KOL Marketing Platform</small>
          </b-dropdown-header>
          
          <div class="dropdown-divider"></div>
          
          <b-dropdown-item class="dropdown-item-enhanced" @click="logout">
            <i class="ni ni-user-run text-danger"></i>
            <span>Logout</span>
            <small class="text-muted ml-auto">Sign out</small>
          </b-dropdown-item>
        </template>
      </base-dropdown>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';
import { BaseNav, Modal } from '@/components';

export default {
  components: {
    CollapseTransition,
    BaseNav,
    Modal
  },
  props: {
    type: {
      type: String,
      default: 'default', // default|light
      description: 'Look of the dashboard navbar. Default (Green) or light (gray)'
    }
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      adminName: localStorage.getItem("user")
      // searchQuery: ''
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push({name: 'login'}) 
    }
  }
};
</script>

<style lang="scss">
/* KOL Marketing Company - Custom Navbar Layout */

.custom-navbar {
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 20px 30px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 80px;
}

.page-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  .h4 {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    font-size: 1.8rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    letter-spacing: 1px;
    position: relative;
    
    i {
      color: #ff6b6b;
      animation: sparkle 2s ease-in-out infinite;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
      border-radius: 2px;
      animation: titleGlow 2s ease-in-out infinite alternate;
    }
  }
  
  .page-subtitle {
    margin-top: 5px;
    
    .badge-gradient {
      background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
      color: white;
      font-size: 0.7rem;
      padding: 4px 12px;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(255,107,107,0.3);
      animation: badgePulse 3s ease-in-out infinite;
    }
  }
}

.user-profile-container {
  display: flex;
  align-items: flex-start;
}

/* 搜尋欄已移除 */

.user-profile-link {
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 8px 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .user-avatar {
    position: relative;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .avatar-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background: #4ecdc4;
      border: 2px solid white;
      border-radius: 50%;
      animation: statusPulse 2s ease-in-out infinite;
    }
  }
  
  .user-name {
    color: rgba(255,255,255,0.9);
    font-weight: 600;
  }
  
  .user-role {
    color: rgba(255,255,255,0.7);
    font-size: 0.75rem;
  }
}

.noti-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  margin: 5px 10px;
  padding: 15px;
  font-weight: 600;
  
  .welcome-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    
    i {
      color: #ff6b6b;
      animation: sparkle 2s ease-in-out infinite;
    }
  }
}

.dropdown-item-enhanced {
  padding: 12px 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 2px 10px;
  display: flex;
  align-items: center;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(5px);
    
    i {
      transform: scale(1.1);
    }
  }
  
  i {
    margin-right: 10px;
    transition: all 0.3s ease;
    width: 16px;
    text-align: center;
  }
  
  span {
    flex: 1;
  }
  
  small {
    font-size: 0.7rem;
    opacity: 0.8;
  }
}

/* Animations */
@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    color: #ff6b6b;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    color: #4ecdc4;
  }
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(255,107,107,0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(78,205,196,0.5);
  }
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .page-title-container {
    .h4 {
      font-size: 1.2rem;
    }
    
    .page-subtitle .badge-gradient {
      font-size: 0.6rem;
      padding: 3px 8px;
    }
  }
  
  .search-container .search-input {
    padding: 10px 15px;
    font-size: 0.8rem;
  }
  
  .user-profile-link {
    padding: 6px 12px;
  }
}
</style>
