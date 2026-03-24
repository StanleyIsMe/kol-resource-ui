<template>
  <b-card no-body class="gcp-card-surface">
    <b-card-header class="bg-white border-bottom" style="border-color: #dadce0 !important;">
      <b-row align-v="center">
        <b-col cols="8">
          <h5 class="mb-0" style="color: #202124;">
            <i class="ni ni-box-2 mr-2"></i>
            {{ isCreate ? "Create Product" : "Edit Product" }}
          </h5>
        </b-col>
        <b-col cols="4" class="text-right">
          <b-button variant="outline-secondary" size="sm" @click="$router.push({name: 'products'})">
            <i class="ni ni-bold-left mr-1"></i> Back to Products
          </b-button>
        </b-col>
      </b-row>
    </b-card-header>

    <b-card-body class="px-lg-5 py-lg-4">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form @submit.prevent="handleSubmit(createProduct)">
          <div class="form-section mb-4">
            <h6 class="section-title mb-3">
              <i class="ni ni-badge mr-2"></i> Product Information
            </h6>
            <b-row>
              <b-col lg="6" class="mb-3">
                <base-input type="text" label="Product Name" placeholder="Enter product name"
                  v-model="product.name" name="name" :rules="{ required: true, max: 50 }"
                  addon-left-icon="ni ni-box-2"></base-input>
              </b-col>
            </b-row>
          </div>

          <div class="form-section mb-4">
            <h6 class="section-title mb-3">
              <i class="ni ni-align-left-2 mr-2"></i> Description
            </h6>
            <b-form-group label="" class="mb-0" label-for="about-form-textarea">
              <b-form-textarea rows="4" id="about-form-textarea"
                placeholder="Describe the product features, benefits, and target audience..."
                v-model="product.description" name="description"
                :rules="{ required: true, max: 500 }"></b-form-textarea>
            </b-form-group>
          </div>

          <div class="form-actions text-center pt-3">
            <b-button type="submit" variant="primary" size="lg" class="gcp-btn-primary mr-3" :disabled="!isFormValid">
              <i class="ni ni-check-bold mr-2"></i>
              {{ isCreate ? "Create Product" : "Update Product" }}
            </b-button>
            <b-button variant="outline-secondary" size="lg" @click="$router.push({name: 'products'})">
              Cancel
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  data() {
    return {
      product: {
        name: "",
        description: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return this.product.name && this.product.description;
    },
    isCreate() {
      return !this.$route.query.id;
    },
  },
  methods: {
    createProduct() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/products";
      const config = {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
      };
      this.axios.post(url, { name: this.product.name, description: this.product.description }, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast("Product created successfully", {
              title: "Success", variant: "success", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right",
            });
            this.$router.push({ name: "products" });
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error_code === "DUPLICATED_RESOURCE") {
            this.$bvToast.toast(`Product "${this.product.name}" already exists`, {
              title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right",
            });
          } else {
            this.$bvToast.toast("Failed to create product", {
              title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right",
            });
          }
        });
    },
  },
};
</script>
<style scoped>
.form-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #dadce0;
}

.section-title {
  color: #202124;
  font-weight: 600;
  font-size: 0.9375rem;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8eaed;
}

.form-actions {
  border-top: 1px solid #dadce0;
  margin-top: 16px;
}
</style>
