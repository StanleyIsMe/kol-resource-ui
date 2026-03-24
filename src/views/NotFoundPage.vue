<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <h1 class="not-found-code">404</h1>
      <h5 class="not-found-title">Page not found</h5>
      <p class="not-found-text">The page you are looking for does not exist or has been moved.</p>
      <router-link to="/dashboard" class="btn btn-primary gcp-btn-primary">
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-found'
};
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: #f1f3f4;
}

.not-found-card {
  text-align: center;
  padding: 48px;
}

.not-found-code {
  font-size: 6rem;
  font-weight: 700;
  color: #dadce0;
  margin-bottom: 8px;
}

.not-found-title {
  color: #202124;
  font-weight: 600;
  margin-bottom: 8px;
}

.not-found-text {
  color: #5f6368;
  margin-bottom: 24px;
}
</style>
