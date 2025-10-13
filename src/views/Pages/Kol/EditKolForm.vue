<template>
  <b-card no-body class="bg-default shadow edit-kol-card">
    <b-card-header class="bg-transparent border-0">
      <b-row align-v="center">
        <b-col cols="8">
          <h3 class="mb-0 text-white">
            <i class="ni ni-single-02 mr-2"></i>
            {{ isCreate ? "Create KOL" : "Edit KOL" }}
          </h3>
        </b-col>
        <b-col cols="4" class="text-right">
          <b-button 
            variant="outline-light" 
            size="sm" 
            @click="$router.push({name: 'kols'})"
            class="back-btn"
          >
            <i class="ni ni-bold-left mr-1"></i>
            Back to KOLs
          </b-button>
        </b-col>
      </b-row>
    </b-card-header>

    <b-card-body class="px-lg-5 py-lg-4">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form @submit.prevent="onSubmit">
          <!-- Information Section -->
          <div class="form-section mb-5">
            <h6 class="section-title mb-4">
              <i class="ni ni-badge mr-2"></i>
              Basic Information
            </h6>
            
            <b-row>
              <b-col lg="6" class="mb-3">
                <base-input
                  type="text"
                  label="KOL Name"
                  placeholder="Enter KOL name"
                  v-model="kol.name"
                  :rules="{required: true, max: 50}"
                  name="name"
                  addon-left-icon="ni ni-single-02"
                >
                </base-input>
              </b-col>
              <b-col lg="6" class="mb-3">
                <base-input
                  type="email"
                  label="Email Address"
                  placeholder="kol@example.com"
                  v-model="kol.email"
                  :rules="{required: true, email: true}"
                  name="email"
                  addon-left-icon="ni ni-email-83"
                >
                </base-input>
              </b-col>
            </b-row>
            
            <b-row>
              <b-col lg="6" class="mb-3">
                <base-input
                  type="text"
                  label="Social Media"
                  placeholder="Instagram, TikTok, etc."
                  v-model="kol.social_media"
                  :rules="{required: true, max: 255}"
                  name="social_media"
                  addon-left-icon="ni ni-world"
                >
                </base-input>
              </b-col>
              <b-col lg="6" class="mb-3">
                <base-input label="Gender" :rules="{required: true}" name="sex" addon-left-icon="ni ni-circle-08">
                  <select class="form-control" v-model="kol.sex">
                    <option value="">Select Gender</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                  </select>
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
                placeholder="Describe the KOL's background, expertise, and audience..."
                v-model="kol.description"
                :rules="{required: true, max: 500}"
                name="description"
                class="modern-textarea"
              ></b-form-textarea>
            </b-form-group>
          </div>

          <!-- Tags Section -->
          <div class="form-section mb-5">
            <h6 class="section-title mb-4">
              <i class="ni ni-tag mr-2"></i>
              Tags & Categories
            </h6>
            
            <b-form-group label="" label-for="tags-component-select">
              <b-form-tags
                id="tags-component-select"
                v-model="kol.tags"
                size="lg"
                class="mb-2 modern-tags"
                add-on-change
                no-outer-focus
              >
                <template
                  v-slot="{
                    tags,
                    inputAttrs,
                    inputHandlers,
                    disabled,
                    removeTag,
                  }"
                >
                  <div v-if="tags.length > 0" class="tags-display mb-3">
                    <b-form-tag
                      v-for="tag in tags"
                      :key="tag"
                      @remove="removeTag(tag)"
                      :title="tag"
                      :disabled="disabled"
                      variant="info"
                      class="tag-badge mr-2 mb-2"
                    >
                      <i class="ni ni-tag tag-icon mr-1"></i>
                      {{ getCustomTagDisplay(tag) }}
                    </b-form-tag>
                  </div>
                  <b-form-select
                    v-bind="inputAttrs"
                    v-on="inputHandlers"
                    :disabled="disabled || availableOptions.length === 0"
                    :options="availableOptions"
                    class="modern-select"
                  >
                    <template #first>
                      <option disabled value="">Choose a tag...</option>
                    </template>
                  </b-form-select>
                </template>
              </b-form-tags>
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
              {{ isCreate ? "Create KOL" : "Update KOL" }}
            </b-button>
            <b-button 
              variant="outline-light" 
              size="lg"
              @click="$router.push({name: 'kols'})"
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
      kol: {
        name: "",
        description: "",
        email: "",
        sex: "",
        social_media: "",
        tags: [],
      },
      tags: [],
      options: [],
      value: [],
      selectedTagIDs: [],
      tagMap: new Map(),
      isCreate: false
    };
  },
  computed: {
    availableOptions() {
      return this.options.filter((opt) => this.kol.tags.indexOf(opt.value) === -1);
    },
    isFormValid() {
      return this.kol.name && 
             this.kol.email && 
             this.kol.social_media && 
             this.kol.sex && 
             this.kol.description;
    },
  },
  mounted() {
    this.listTags();

    if (this.$route.query.id) {
      this.isCreate = false;
      this.getKolByID(this.$route.query.id);
    } else {
      this.isCreate = true;
    }
  },
  methods: {
    getCustomTagDisplay(tag) {
      // 自定義標籤的顯示方式
      return this.tagMap.get(tag);
    },
    listTags() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/tags";

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.options = [];
            response.data.forEach((tag) => {
              this.tagMap.set(tag.id, tag.name);
              this.options.push({
                text: tag.name,
                value: tag.id,
              });
            });
          }
          console.log("Response:", response.data);
          // Handle successful response here
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({name: 'login'}) 

            return;
          }

          console.error("Error:", error);
          alert("Error:" + error.response.data);
        });
    },
    getKolByID(id) {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols/" + id;

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            
            // response.data.forEach((kol) => {
              this.kol.name = response.data.name;
              this.kol.description = response.data.description;
              this.kol.email = response.data.email;
              this.kol.sex = response.data.sex;
              this.kol.social_media = response.data.social_media;

              response.data.tags.forEach((tag) => {
                this.kol.tags.push(tag.id);
              });
            // });
          }
          console.log("Response:", response.data);
          // Handle successful response here
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({name: 'login'}) 

            return;
          }

          console.error("Error:", error);
          alert("Error:" + error.response.data);
        });
    },
    onSubmit() {
      let url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols";

      let requestBody = {
          name: this.kol.name,
          email: this.kol.email,
          description: this.kol.description,
          sex: this.kol.sex,
          social_media: this.kol.social_media,
          tags: this.kol.tags
        }
      
      // if (this.value.length > 0) {
      //   this.value.forEach((tagName) => {
      //     requestBody.tags.push(this.tagMap.get(tagName));
      //   });
      // }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      }

      let resp;
      if (this.isCreate) {
        resp = this.axios.post(url, requestBody, config)
      } else {
        url = url + "/" + this.$route.query.id;
        resp = this.axios.put(url, requestBody, config)
      }

      resp.then((response) => {
        if (response.status == 200) {
          this.$router.push({name: 'kols'})
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          this.$router.push({name: 'login'}) 

          return;
        }

        console.error("Error:", error);
        alert("Error:" + error.response.data);
      });

    },
  },
};
</script>
<style scoped>
/* Card styling to match KOL page */
.edit-kol-card {
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

/* Fix dropdown menu visibility */
.modern-select option {
  color: #333 !important;
  background-color: #fff !important;
}

/* Bootstrap Vue dropdown styling */
.custom-select option {
  color: #333 !important;
  background-color: #fff !important;
}

/* Ensure dropdown is visible when opened */
select:focus option {
  color: #333 !important;
  background-color: #fff !important;
}

/* Additional styling for better visibility */
.form-section select option {
  color: #333 !important;
  background-color: #fff !important;
  padding: 8px 12px;
}

/* Bootstrap Vue specific dropdown styling */
.b-form-tags select option {
  color: #333 !important;
  background-color: #fff !important;
  padding: 8px 12px;
}

/* Target the specific select element */
#tags-component-select___input__ option {
  color: #333 !important;
  background-color: #fff !important;
  padding: 8px 12px;
}

/* Global option styling for all selects */
option {
  color: #333 !important;
  background-color: #fff !important;
  padding: 8px 12px;
}

/* Ensure dropdown list is visible */
select option:checked,
select option:hover,
select option:focus {
  color: #333 !important;
  background-color: #f8f9fa !important;
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

.modern-select {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.modern-select:focus {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25) !important;
}

/* Tags styling */
.modern-tags {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px !important;
  padding: 12px !important;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-badge {
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  background-color: #5e72e4 !important;
  border-color: #5e72e4 !important;
}

.tag-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.tag-icon {
  font-size: 0.8rem;
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
