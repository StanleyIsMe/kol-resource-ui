<template>
  <card>
    <b-row align-v="center" slot="header">
      <b-col cols="8">
        <h3 class="mb-0">Edit kol</h3>
      </b-col>
      <!-- <b-col cols="4" class="text-right">
        <a href="#!" class="btn btn-sm btn-primary">Settings</a>
      </b-col> -->
    </b-row>

    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
      <b-form @submit.prevent="onSubmit">
        <h6 class="heading-small text-muted mb-4">Information</h6>

        <div class="pl-lg-4">
          <b-row>
            <b-col lg="4">
              <base-input
                type="text"
                label="Name"
                placeholder="Name"
                v-model="kol.name"
                :rules="{required: true, max: 50}"
                name="name"
              >
              </base-input>
            </b-col>
            <b-col lg="6">
              <base-input
                type="email"
                label="Email address"
                placeholder="mike@email.com"
                v-model="kol.email"
                :rules="{required: true, email: true}"
                name="email"
              >
              </base-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <base-input
                type="text"
                label="Social Media"
                placeholder="Social Media"
                v-model="kol.social_media"
                :rules="{required: true, max: 255}"
                name="social_media"
              >
              </base-input>
            </b-col>
            <b-col lg="2">
              <base-input label="Sex" :rules="{required: true}" name="sex">
                <select class="form-control" v-model="kol.sex">
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </base-input>
            </b-col>
          </b-row>
        </div>
        <hr class="my-4" />

        <!-- Address -->
        <h6 class="heading-small text-muted mb-4">Description</h6>
        <div class="pl-lg-4">
          <b-form-group
            label=""
            label-class="form-control-label"
            class="mb-0"
            label-for="about-form-textaria"
          >
            <!--  <label class="form-control-label">About Me</label> -->
            <b-form-textarea
              rows="4"
              value="A beautiful premium dashboard for BootstrapVue."
              id="about-form-textaria"
              placeholder="A few words about you ..."
              v-model="kol.description"
              :rules="{required: true, max: 500}"
              name="description"
            ></b-form-textarea>
          </b-form-group>
        </div>

        <hr class="my-4" />
        <!-- Description -->
        <h6 class="heading-small text-muted mb-4">Tags</h6>
        <div>
          <b-form-group label="" label-for="tags-component-select">
            <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
            <b-form-tags
              id="tags-component-select"
              v-model="kol.tags"
              size="lg"
              class="mb-2"
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
                <ul
                  v-if="tags.length > 0"
                  class="list-inline d-inline-block mb-2"
                >
                  <li v-for="tag in tags" :key="tag" class="list-inline-item">
                    <b-form-tag
                      @remove="removeTag(tag)"
                      :title="tag"
                      :disabled="disabled"
                      variant="info"
                      >{{ getCustomTagDisplay(tag) }}</b-form-tag
                    >
                  </li>
                </ul>
                <b-form-select
                  v-bind="inputAttrs"
                  v-on="inputHandlers"
                  :disabled="disabled || availableOptions.length === 0"
                  :options="availableOptions"
                >
                  <template #first>
                    <!-- This is required to prevent bugs with Safari -->
                    <option disabled value="">Choose a tag...</option>
                  </template>
                </b-form-select>
              </template>
            </b-form-tags>
          </b-form-group>
        </div>

        <div class="pl-lg-4">
          <b-button type="submit" variant="primary" class="mt-4">{{ isCreate ? "Create" : "Update" }}</b-button>
        </div>
      </b-form>
    </validation-observer>
  </card>
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
<style></style>
