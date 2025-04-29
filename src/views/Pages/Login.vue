<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">Welcome!</h1>
              <p class="text-lead text-white">Please login to your account</p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <!-- <b-card-header class="bg-transparent pb-5"  >
              <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="img/icons/common/github.svg"></span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="img/icons/common/google.svg"></span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </b-card-header> -->
            <b-card-body class="px-lg-5 py-lg-5">
              <base-alert v-if="showAlert" dismissible :variant="variantAlert">
                <span class="alert-icon"><i class="ni ni-like-2"></i></span>
                <span class="alert-text"><strong>{{alertMessage}}</strong></span>
              </base-alert>
              <!-- <div class="text-center text-muted mb-4">
                <small>Or sign in with credentials</small>
              </div> -->
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative
                              class="mb-3"
                              name="Email"
                              :rules="{required: true, email: true}"
                              prepend-icon="ni ni-email-83"
                              placeholder="Email"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              name="Password"
                              :rules="{required: true, min: 6}"
                              prepend-icon="ni ni-lock-circle-open"
                              type="password"
                              placeholder="Password"
                              v-model="model.password">
                  </base-input>

                  <!-- <b-form-checkbox v-model="model.rememberMe">Remember me</b-form-checkbox> -->
                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="my-4">Sign in</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <b-col cols="6">
              <router-link to="/dashboard" class="text-light"><small>Forgot password?</small></router-link>
            </b-col>
            <b-col cols="6" class="text-right">
              <router-link to="/register" class="text-light"><small>Create new account</small></router-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
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
        variantAlert: "success",
        alertMessage: "login success"
      };
    },
    methods: {
      onSubmit() {
        const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/login';

        const requestBody = {
          user_name: this.model.email,
          password: this.model.password
        }

        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        this.axios.post(url, requestBody, config)
        .then(response => {
          if (response.status == 200) {
            this.showAlert = true
            this.variantAlert = "success"
            this.alertMessage = "Login success"

            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", response.data.admin_name)
            this.$router.push({name: 'dashboard'}) 
          }
          console.log('Response:', response.data);
          // Handle successful response here
        })
        .catch(error => {
          
          console.error('Error:', error.response);

          if (error.status == 401) {
            this.variantAlert = "danger";
            this.showAlert = true;
            this.alertMessage = "Invalid email or password";
          } else {
            this.variantAlert = "danger";
            this.showAlert = true;
            this.alertMessage = "Internal server error";
          }
          // if (error.response) {
          //   // The request was made and the server responded with a status code
          //   // that falls out of the range of 2xx
          //   console.error('Error Data:', error.response.data);
          //   console.error('Error Status:', error.response.status);
          //   console.error('Error Headers:', error.response.headers);
          // } else if (error.request) {
          //   // The request was made but no response was received
          //   console.error('Error Request:', error.request);
          // } else {
          //   // Something happened in setting up the request that triggered an Error
          //   console.error('Error Message:', error.message);
          // }
        });
      }
    }
  };
</script>
