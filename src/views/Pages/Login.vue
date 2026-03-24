<template>
  <div class="gcp-auth-card">
    <div class="text-center mb-4">
      <img src="img/theme/bichon-logo.png" alt="Logo" class="auth-logo mb-3">
      <h5 class="auth-title">Sign in</h5>
      <p class="auth-subtitle">KOL Resource Management</p>
    </div>

    <base-alert v-if="showAlert" dismissible :variant="variantAlert">
      <span class="alert-text"><strong>{{ alertMessage }}</strong></span>
    </base-alert>

    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
      <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
        <base-input alternative
                    class="mb-3"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                    v-model="model.email">
        </base-input>

        <base-input alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                    v-model="model.password">
        </base-input>

        <div class="text-center">
          <base-button type="primary" native-type="submit" class="my-4 gcp-btn-primary" style="width: 100%;">Sign in</base-button>
        </div>
      </b-form>
    </validation-observer>

    <div class="text-center mt-3">
      <router-link to="/register" class="auth-link">Create new account</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        model: {
          email: '',
          password: '',
        },
        showAlert: false,
        variantAlert: 'success',
        alertMessage: ''
      };
    },
    methods: {
      onSubmit() {
        const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/login';
        const requestBody = {
          user_name: this.model.email,
          password: this.model.password
        };
        const config = {
          headers: { 'Content-Type': 'application/json' }
        };

        this.axios.post(url, requestBody, config)
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', response.data.admin_name);
              this.$router.push({ name: 'dashboard' });
            }
          })
          .catch(error => {
            this.variantAlert = 'danger';
            this.showAlert = true;
            if (error.response && error.response.status === 401) {
              this.alertMessage = 'Invalid email or password';
            } else {
              this.alertMessage = 'An error occurred. Please try again.';
            }
          });
      }
    }
  };
</script>
<style scoped>
.gcp-auth-card {
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 48px 40px;
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.15);
}

.auth-logo {
  height: 48px;
}

.auth-title {
  color: #202124;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.auth-subtitle {
  color: #5f6368;
  font-size: 0.875rem;
}

.auth-link {
  color: #1a73e8;
  font-size: 0.875rem;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
