<template>
  <div class="gcp-auth-card">
    <div class="text-center mb-4">
      <img src="img/theme/bichon-logo.png" alt="Logo" class="auth-logo mb-3">
      <h5 class="auth-title">Create account</h5>
      <p class="auth-subtitle">KOL Resource Management</p>
    </div>

    <base-alert v-if="showAlert" dismissible :variant="variantAlert">
      <span class="alert-text"><strong>{{ alertMessage }}</strong></span>
    </base-alert>

    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
      <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
        <base-input alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="Name"
                    name="Name"
                    :rules="{ required: true }"
                    v-model="model.name">
        </base-input>

        <base-input alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    v-model="model.email">
        </base-input>

        <base-input alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="Password"
                    type="password"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    v-model="model.password">
        </base-input>

        <div class="text-center">
          <b-button type="submit" variant="primary" class="mt-4 gcp-btn-primary" style="width: 100%;">Create account</b-button>
        </div>
      </b-form>
    </validation-observer>

    <div class="text-center mt-3">
      <router-link to="/login" class="auth-link">Already have an account? Sign in</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'register',
    data() {
      return {
        model: {
          name: '',
          email: '',
          password: ''
        },
        showAlert: false,
        variantAlert: 'success',
        alertMessage: ''
      };
    },
    methods: {
      onSubmit() {
        const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/register';
        const requestBody = {
          name: this.model.name,
          user_name: this.model.email,
          password: this.model.password
        };
        const config = {
          headers: { 'Content-Type': 'application/json' }
        };

        this.axios.post(url, requestBody, config)
          .then(response => {
            if (response.status === 200) {
              this.showAlert = true;
              this.variantAlert = 'success';
              this.alertMessage = 'Registration successful';
              this.$router.push({ name: 'login' });
            }
          })
          .catch(error => {
            this.variantAlert = 'danger';
            this.showAlert = true;
            if (error.response && error.response.data && error.response.data.error_code === 'DUPLICATED_USERNAME') {
              this.alertMessage = 'Email already exists';
            } else {
              this.alertMessage = 'Registration failed. Please try again.';
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
