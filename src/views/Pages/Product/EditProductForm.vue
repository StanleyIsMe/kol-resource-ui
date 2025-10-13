<template>
  <b-card no-body class="bg-default shadow edit-product-card">
    <b-card-header class="bg-transparent border-0">
      <b-row align-v="center">
        <b-col cols="8">
          <h3 class="mb-0 text-white">
            <i class="ni ni-box-2 mr-2"></i>
            {{ isCreate ? "Create Product" : "Edit Product" }}
          </h3>
        </b-col>
        <b-col cols="4" class="text-right">
          <b-button 
            variant="outline-light" 
            size="sm" 
            @click="$router.push({name: 'products'})"
            class="back-btn"
          >
            <i class="ni ni-bold-left mr-1"></i>
            Back to Products
          </b-button>
        </b-col>
      </b-row>
    </b-card-header>

    <b-card-body class="px-lg-5 py-lg-4">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form @submit.prevent="handleSubmit(createProduct)">
          <!-- Information Section -->
          <div class="form-section mb-5">
            <h6 class="section-title mb-4">
              <i class="ni ni-badge mr-2"></i>
              Product Information
            </h6>
            
            <b-row>
              <b-col lg="6" class="mb-3">
                <base-input
                  type="text"
                  label="Product Name"
                  placeholder="Enter product name"
                  v-model="product.name"
                  name="name"
                  :rules="{ required: true, max: 50 }"
                  addon-left-icon="ni ni-box-2"
                >
                </base-input>
              </b-col>
            </b-row>
          </div>

          <!-- Description Section -->
          <div class="form-section mb-5">
            <h6 class="section-title mb-4">
              <i class="ni ni-align-left-2 mr-2"></i>
              Description
            </h6>
            
            <b-form-group
              label=""
              label-class="form-control-label"
              class="mb-0"
              label-for="about-form-textarea"
            >
              <b-form-textarea
                rows="4"
                id="about-form-textarea"
                placeholder="Describe the product features, benefits, and target audience..."
                v-model="product.description"
                name="description"
                :rules="{ required: true, max: 500 }"
                class="modern-textarea"
              ></b-form-textarea>
            </b-form-group>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions text-center pt-4">
            <b-button 
              type="submit" 
              variant="success" 
              size="lg"
              class="submit-btn mr-3"
              :disabled="!isFormValid"
            >
              <i class="ni ni-check-bold mr-2"></i>
              {{ isCreate ? "Create Product" : "Update Product" }}
            </b-button>
            <b-button 
              variant="outline-light" 
              size="lg"
              @click="$router.push({name: 'products'})"
              class="cancel-btn"
            >
              <i class="ni ni-fat-remove mr-2"></i>
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
        name: "史丹",
        description: "愛吃愛玩愛旅行",
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
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .post(
          url,
          { name: this.product.name, description: this.product.description },
          config
        )
        .then((response) => {
          if (response.status == 200) {
            alert("Create tag success");
          }
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({name: 'login'}) 

            return;
          }

          if (error.response.data.error_code == "DUPLICATED_RESOURCE") {
            alert(`Tag [${this.product.name}] already exists`);
          } else {
            alert("Create tag failed");
          }

          console.error("Error:", error);
        });
    },
  },
};
</script>
<style scoped>
/* Card styling to match KOL page */
.edit-product-card {
  background-color: #27293d !important;
  border: none !important;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.15) !important;
  border-left: 4px solid #5e72e4 !important;
}

/* Section styling */
.form-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.form-section:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(94, 114, 228, 0.3);
}

.section-title {
  color: #fff !important;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(94, 114, 228, 0.2);
  padding-bottom: 8px;
}

/* Button styling */
.back-btn {
  height: 38px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.submit-btn {
  height: 50px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 1rem;
  background-color: #2dce89 !important;
  border-color: #2dce89 !important;
  padding: 0 30px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #24a870 !important;
  border-color: #24a870 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 206, 137, 0.3);
}

.submit-btn:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  transform: none;
  box-shadow: none;
}

.cancel-btn {
  height: 50px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 1rem;
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 0 30px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Form labels styling */
.form-control-label {
  color: #fff !important;
}

/* Make all text within form sections white */
.form-section {
  color: #fff !important;
}

.form-section * {
  color: #fff !important;
}

.form-section input,
.form-section select,
.form-section textarea {
  color: #fff !important;
}

.form-section option {
  color: #333 !important;
  background-color: #fff !important;
}

/* Form elements styling */
.modern-textarea {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.modern-textarea:focus {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25) !important;
}

.modern-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Fix selected option visibility in select */
.form-control:focus,
.form-control:active,
.form-control {
  color: #333 !important;
}

/* Make sure selected text is visible */
select.form-control {
  color: #333 !important;
}

/* Override white text for selected values */
.form-section select {
  color: #333 !important;
}

/* Form actions */
.form-actions {
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-section {
    padding: 16px;
  }
  
  .submit-btn,
  .cancel-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .submit-btn {
    margin-right: 0 !important;
  }
}
</style>
