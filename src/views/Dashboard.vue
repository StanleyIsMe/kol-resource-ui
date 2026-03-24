<template>
  <div class="gcp-dashboard">
    <div class="dashboard-welcome">
      <div class="welcome-icon">
        <i class="ni ni-tv-2"></i>
      </div>
      <h4 class="welcome-title">Dashboard</h4>
      <p class="welcome-text">Welcome to KOL Resource Management. Use the sidebar to navigate.</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dashboard'
};
</script>
<style scoped>
.gcp-dashboard {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.dashboard-welcome {
  text-align: center;
  padding: 48px;
}

.welcome-icon {
  font-size: 3rem;
  color: #dadce0;
  margin-bottom: 16px;
}

.welcome-title {
  color: #202124;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-text {
  color: #5f6368;
  font-size: 0.9375rem;
}
</style>
