<template>
  <div class="auth-layout">
    <div class="auth-content">
      <zoom-center-transition
        :duration="pageTransitionDuration"
        mode="out-in"
      >
        <router-view></router-view>
      </zoom-center-transition>
    </div>
  </div>
</template>
<script>
  import { ZoomCenterTransition } from 'vue2-transitions';

  export default {
    components: {
      ZoomCenterTransition
    },
    data() {
      return {
        pageTransitionDuration: 200
      };
    }
  };
</script>
<style lang="scss" scoped>
.auth-layout {
  background-color: #f1f3f4;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-content {
  width: 100%;
  max-width: 480px;
  padding: 24px;
}
</style>
