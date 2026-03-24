<template>
  <b-card no-body class="gcp-card-surface edit-kol-card">
    <b-card-header class="bg-white border-bottom" style="border-color: #dadce0 !important;">
      <b-row align-v="center">
        <b-col cols="8">
          <h5 class="mb-0" style="color: #202124;">
            <i class="ni ni-single-02 mr-2"></i>
            {{ isCreate ? "Create KOL" : "Edit KOL" }}
          </h5>
        </b-col>
        <b-col cols="4" class="text-right">
          <b-button variant="outline-secondary" size="sm" @click="$router.push({name: 'kols'})">
            <i class="ni ni-bold-left mr-1"></i> Back to KOLs
          </b-button>
        </b-col>
      </b-row>
    </b-card-header>

    <b-card-body class="px-lg-5 py-lg-4">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form @submit.prevent="onSubmit">
          <div class="form-section mb-4">
            <h6 class="section-title mb-3">
              <i class="ni ni-badge mr-2"></i> Basic Information
            </h6>
            <b-row>
              <b-col lg="6" class="mb-3">
                <base-input type="text" label="KOL Name" placeholder="Enter KOL name"
                  v-model="kol.name" :rules="{required: true, max: 50}" name="name"
                  addon-left-icon="ni ni-single-02"></base-input>
              </b-col>
              <b-col lg="6" class="mb-3">
                <base-input type="email" label="Email Address" placeholder="kol@example.com"
                  v-model="kol.email" :rules="{required: true, email: true}" name="email"
                  addon-left-icon="ni ni-email-83"></base-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6" class="mb-3">
                <base-input type="text" label="Social Media" placeholder="Instagram, TikTok, etc. (Optional)"
                  v-model="kol.social_media" :rules="{max: 255}" name="social_media"
                  addon-left-icon="ni ni-world"></base-input>
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

          <div class="form-section mb-4">
            <h6 class="section-title mb-3">
              <i class="ni ni-align-left-2 mr-2"></i> Description
              <span class="text-muted" style="font-size: 0.8rem; font-weight: normal;">(Optional)</span>
            </h6>
            <b-form-group label="" class="mb-0" label-for="about-form-textarea">
              <b-form-textarea rows="4" id="about-form-textarea"
                placeholder="Describe the KOL's background, expertise, and audience..."
                v-model="kol.description" name="description"></b-form-textarea>
            </b-form-group>
          </div>

          <div class="form-section mb-4" :class="{ 'tags-error': tagsError }">
            <h6 class="section-title mb-3">
              <i class="ni ni-tag mr-2"></i> Tags & Categories <span class="text-danger">*</span>
            </h6>
            <b-form-group label="" label-for="tags-component-select"
              :invalid-feedback="tagsError ? 'At least one tag is required' : ''"
              :state="tagsError === null ? null : !tagsError">
              <b-form-tags id="tags-component-select" v-model="kol.tags" size="lg" class="mb-2"
                :class="{ 'is-invalid': tagsError }" add-on-change no-outer-focus @input="validateTags">
                <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                  <div v-if="tags.length > 0" class="tags-display mb-3">
                    <b-form-tag v-for="tag in tags" :key="tag" @remove="removeTag(tag)"
                      :title="tag" :disabled="disabled" variant="info" class="tag-badge mr-2 mb-2">
                      {{ getCustomTagDisplay(tag) }}
                    </b-form-tag>
                  </div>
                  <b-form-select v-bind="inputAttrs" v-on="inputHandlers"
                    :disabled="disabled || availableOptions.length === 0" :options="availableOptions">
                    <template #first>
                      <option disabled value="">Choose a tag...</option>
                    </template>
                  </b-form-select>
                </template>
              </b-form-tags>
            </b-form-group>
          </div>

          <div class="form-actions text-center pt-3">
            <b-button type="submit" variant="primary" size="lg" class="gcp-btn-primary mr-3" :disabled="!isFormValid">
              <i class="ni ni-check-bold mr-2"></i>
              {{ isCreate ? "Create KOL" : "Update KOL" }}
            </b-button>
            <b-button variant="outline-secondary" size="lg" @click="$router.push({name: 'kols'})">
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
      kol: { name: "", description: "", email: "", sex: "", social_media: "", tags: [] },
      tags: [],
      options: [],
      tagMap: new Map(),
      isCreate: false,
      tagsError: null,
    };
  },
  computed: {
    availableOptions() {
      return this.options.filter((opt) => this.kol.tags.indexOf(opt.value) === -1);
    },
    isFormValid() {
      return this.kol.name && this.kol.email && this.kol.sex && this.kol.tags && this.kol.tags.length > 0;
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
    validateTags() {
      this.tagsError = !(this.kol.tags && this.kol.tags.length > 0);
    },
    getCustomTagDisplay(tag) {
      return this.tagMap.get(tag) || tag;
    },
    listTags() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/tags";
      const config = {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
      };
      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.options = [];
            response.data.forEach((tag) => {
              this.tagMap.set(tag.id, tag.name);
              this.options.push({ text: tag.name, value: tag.id });
            });
          }
        })
        .catch(() => {});
    },
    getKolByID(id) {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols/" + id;
      const config = {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
      };
      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.kol.name = response.data.name;
            this.kol.description = response.data.description;
            this.kol.email = response.data.email;
            this.kol.sex = response.data.sex;
            this.kol.social_media = response.data.social_media;
            response.data.tags.forEach((tag) => { this.kol.tags.push(tag.id); });
          }
        })
        .catch(() => {});
    },
    onSubmit() {
      this.validateTags();
      if (!this.kol.tags || this.kol.tags.length === 0) {
        this.$bvToast.toast("Please select at least one tag", { title: "Validation Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        return;
      }
      let url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols";
      const requestBody = {
        name: this.kol.name, email: this.kol.email, description: this.kol.description,
        sex: this.kol.sex, social_media: this.kol.social_media, tags: this.kol.tags,
      };
      const config = { headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } };
      let resp;
      if (this.isCreate) {
        resp = this.axios.post(url, requestBody, config);
      } else {
        url = url + "/" + this.$route.query.id;
        resp = this.axios.put(url, requestBody, config);
      }
      resp.then((response) => {
          if (response.status === 200) { this.$router.push({ name: "kols" }); }
        })
        .catch((error) => {
          const msg = (error.response && error.response.data && error.response.data.error_message) || "Failed to save KOL";
          this.$bvToast.toast(msg, { title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        });
    },
  },
};
</script>
<style scoped>
.edit-kol-card {
  border-radius: 8px;
}

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

.tags-error {
  border-color: #d93025;
}

.tags-error .section-title {
  color: #d93025;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
}

.tag-badge {
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 4px;
  background-color: #1a73e8 !important;
  border-color: #1a73e8 !important;
}

.form-actions {
  border-top: 1px solid #dadce0;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .form-section { padding: 16px; }
}
</style>
