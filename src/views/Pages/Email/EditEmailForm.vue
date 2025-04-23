<template>
  <card>
    <div>
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <!-- <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group> -->

          <b-form-group id="input-group-2" label="Subject" label-for="input-2">
            <b-form-input
              id="input-2"
              name="subject"
              type="text"
              v-model="form.subject"
              placeholder="Enter subject"
              required
              :rules="{ required: true, max: 100 }"
            ></b-form-input>
          </b-form-group>

          <b-form-group>
            <div id="app">
              <!-- <ckeditor id="editor1" name="editor1" value="1" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor> -->
              <ckeditor
                id="editor1"
                name="editor1"
                value="1"
                v-model="editorData"
                :config="editorConfig"
              ></ckeditor>
              <!-- <ckeditor ref="editor" v-model="editorData" :config="editorConfig" @namespaceLoaded="onNameSpaceLoaded" @ready="onEditorReady"></ckeditor> -->
            </div>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Product"
            label-for="product-select"
          >
            <template>
              <div>
                <b-form-select
                  id="product-select"
                  v-model="form.product"
                  :options="productOptions"
                ></b-form-select>
              </div>
            </template>
          </b-form-group>

          <hr class="my-4" />
          <h6 class="heading-small text-muted mb-4">KOL Select</h6>
          <div class="pl-lg-4">
            <div>
              <b-button v-b-toggle.collapse-1 variant="primary"
                >KOL Filter</b-button
              >
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <b-form @submit.prevent="listKols">
                    <div class="pl-lg-4">
                      <b-row>
                        <b-col lg="6">
                          <base-input
                            type="text"
                            label="Kol Name"
                            placeholder="網紅名"
                            v-model="searchKols.name"
                          >
                          </base-input>
                        </b-col>
                        <b-col lg="6">
                          <base-input
                            type="text"
                            label="Email address"
                            placeholder="mike@email.com"
                            v-model="searchKols.email"
                          >
                          </base-input>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="8">
                          <b-form-group
                            label="Tag"
                            label-for="tags-component-select"
                          >
                            <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                            <b-form-tags
                              id="tags-component-select"
                              v-model="searchKols.tag_ids"
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
                                  <li
                                    v-for="tag in tags"
                                    :key="tag"
                                    class="list-inline-item"
                                  >
                                    <b-form-tag
                                      @remove="removeTag(tag)"
                                      :title="tag"
                                      :disabled="disabled"
                                      variant="info"
                                      >{{
                                        getCustomTagDisplay(tag)
                                      }}</b-form-tag
                                    >
                                  </li>
                                </ul>
                                <b-form-select
                                  v-bind="inputAttrs"
                                  v-on="inputHandlers"
                                  :disabled="
                                    disabled || availableTagOptions.length === 0
                                  "
                                  :options="availableTagOptions"
                                >
                                  <template #first>
                                    <!-- This is required to prevent bugs with Safari -->
                                    <option disabled value="">
                                      Choose a tag...
                                    </option>
                                  </template>
                                </b-form-select>
                              </template>
                            </b-form-tags>
                          </b-form-group>
                          <!-- <base-input
                            type="text"
                            label="Tag Name"
                            placeholder="生活"
                            v-model="searchKols.tag"
                          >
                          </base-input> -->
                        </b-col>
                        <b-col lg="2">
                          <base-input label="Sex">
                            <select
                              class="form-control"
                              v-model="searchKols.sex"
                            >
                              <option value="">All</option>
                              <option value="m">Male</option>
                              <option value="f">Female</option>
                            </select>
                          </base-input>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="4">
                          <b-button type="submit" variant="primary" class="mt-4"
                            >Search</b-button
                          >
                        </b-col>
                      </b-row>
                    </div>
                  </b-form>
                </b-card>
              </b-collapse>
            </div>

            <b-form-group id="input-group-3" label="KOL" label-for="kol">
              <b-form-tags
                id="kol"
                v-model="form.kols"
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
                  <!-- Add Select All button -->
                  <div class="d-flex justify-content-end mb-2">
                    <b-button
                      variant="primary"
                      size="sm"
                      @click="selectAllFilteredKols"
                      class="select-all-btn mr-2"
                      :disabled="kolOptions.length === 0"
                    >
                      <i class="ni ni-check-bold mr-1"></i> Select All
                    </b-button>

                    <b-button
                      variant="danger"
                      size="sm"
                      @click="removeAllKols"
                      class="remove-all-btn"
                      :disabled="form.kols.length === 0"
                    >
                      <i class="ni ni-fat-remove mr-1"></i> Remove All
                    </b-button>
                  </div>

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
                        >{{ getCustomKolDisplay(tag) }}</b-form-tag
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
                      <option disabled value="">Choose a kol...</option>
                    </template>
                  </b-form-select>
                </template>
              </b-form-tags>
            </b-form-group>
          </div>

          <!-- <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              v-model="form.checked"
              id="checkboxes-4"
              :aria-describedby="ariaDescribedby"
            >
              <b-form-checkbox value="me">Check me out</b-form-checkbox>
              <b-form-checkbox value="that">Check that out</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group> -->

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </validation-observer>
      <!-- <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card> -->
    </div>
  </card>
</template>

<script>
export default {
  // components: {
  //   ckeditor: CKEditor.component
  // },
  name: "editor1",
  data() {
    return {
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
        toolbar: [["Bold"]],
      },
      options: [],
      value: [],
      tagMap: new Map(),
      searchKols: {
        name: "",
        tag: "",
        tag_ids: [],
        email: "",
        sex: "",
        page_index: 1,
        page_size: 1000,
      },
      form: {
        // email: "",
        subject: "",
        emailBody: "",
        kols: [],
        product: "",
      },
      show: true,
      // kolOptions: [{id:1, name:'美食網紅'}, {id:2, name:'旅遊網紅'}, {id:3, name:'美妝網紅'}],
      kolOptions: ["美食網紅", "旅遊網紅", "美妝網紅"],
      productOptions: ["產品名稱"],
      tagOptions: ["生活", "旅遊", "美食", "美妝"],
      tagValue: [],
      kolTags: [],
      kolMap: new Map(),
    };
  },
  mounted() {
    this.editorDom = CKEDITOR.replace("editor1");
    this.listProducts();
    this.listTags();
    this.listKols();
  },
  computed: {
    availableTagOptions() {
      return this.tagOptions.filter(
        (opt) => this.searchKols.tag_ids.indexOf(opt.value) === -1
      );
    },
    availableOptions() {
      return this.kolOptions.filter(
        (opt) => this.form.kols.indexOf(opt.value) === -1
      );
    },
  },
  methods: {
    // updateSelectedTags(newTags) {
    //   console.log(newTags);
    //   // this.kolTags = newTags.map(tag => this.kolMap.get(tag));
    // },
    getCustomKolDisplay(tag) {
      // 自定義標籤的顯示方式
      return this.kolMap.get(tag);
    },
    getCustomTagDisplay(tag) {
      // 自定義標籤的顯示方式
      return this.tagMap.get(tag);
    },
    onSubmit(event) {
      if (this.form.kols.length == 0) {
        alert("請選擇至少一個KOL");
        return;
      }

      if (this.editorDom.getData().trim() == "") {
        alert("信件內容不得為空");
        return;
      }

      // Get the editor content
      const originalContent = this.editorDom.getData();

      // Process the content to extract images and convert to CID format
      const { processedContent, images } =
        this.processImagesForEmail(originalContent);

      this.form.emailBody = processedContent;
      event.preventDefault();

      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/send_emails";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      const requestBody = {
        subject: this.form.subject,
        email_content: processedContent,
        product_id: this.form.product,
        kol_ids: this.form.kols,
        images: images, // Add the extracted images array
      };

      this.axios
        .post(url, requestBody, config)
        .then((response) => {
          if (response.status == 200) {
            alert("send mail success");
          }
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });

            return;
          }

          console.error("Error:", error);
          alert("send mail failed");
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.subject = "";
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    listProducts() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/products";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.options = [];
            response.data.forEach((product) => {
              this.productOptions.push({
                text: product.name,
                value: product.id,
              });
            });
          }
          console.log("Response:", response.data);
          // Handle successful response here
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });

            return;
          }

          console.error("Error:", error);
          alert("Error:" + error.response.data);
        });
    },
    listTags() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/tags";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.tagOptions = [];
            response.data.forEach((tag) => {
              this.tagMap.set(tag.id, tag.name);
              // this.options.push({
              //   text: tag.name,
              //   value: tag.id,
              // });
              this.tagOptions.push({ text: tag.name, value: tag.id });
            });
          }
          console.log("Response:", response.data);
          // Handle successful response here
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });

            return;
          }

          console.error("Error:", error);
          alert("Error:" + error.response.data);
        });
    },
    listKols() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols";

      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          page_index: this.searchKols.page_index,
          page_size: this.searchKols.page_size,
        },
      };

      if (this.searchKols.name != "") {
        config.params.name = this.searchKols.name;
      }

      if (this.searchKols.email != "") {
        config.params.email = this.searchKols.email;
      }

      if (this.searchKols.sex != "") {
        config.params.sex = this.searchKols.sex;
      }

      if (this.searchKols.tag_ids.length > 0) {
        config.params.tag_ids = this.searchKols.tag_ids;
      }

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            // this.kols = [];
            this.kolMap.clear();
            this.kolOptions = [];
            response.data.kols.forEach((kol) => {
              this.kolOptions.push({
                text: `${kol.name} - ${kol.email}`,
                value: kol.id,
              });
              this.kolMap.set(kol.id, `${kol.name} - ${kol.email}`);
            });
          }
          console.log("Response:", response.data);
          // Handle successful response here
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });

            return;
          }

          console.error("Error:", error);
        });
    },
    // New method to process images from CKEditor content
    processImagesForEmail(htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const images = [];
      let imageCounter = 1;

      // Find all img elements
      const imgElements = doc.querySelectorAll("img");

      imgElements.forEach((img) => {
        const src = img.getAttribute("src");

        // Process only data URLs (base64 encoded images)
        if (src && src.startsWith("data:image/")) {
          const imageType = src.split(";")[0].split("/")[1];
          const base64Data = src.split(",")[1];
          const contentId = `image${imageCounter}`;

          // Replace src with cid reference
          img.setAttribute("src", `cid:${contentId}`);

          // Store image data for backend processing
          images.push({
            content_id: contentId,
            type: imageType,
            data: base64Data,
          });

          imageCounter++;
        }
      });

      // Serialize the modified DOM back to HTML
      const processedContent = doc.body.innerHTML;

      return { processedContent, images };
    },
    selectAllFilteredKols() {
      // If there are no options or all options are already selected, do nothing
      if (this.kolOptions.length === 0 || this.availableOptions.length === 0) {
        return;
      }

      // Get all currently available KOL ids
      const kolIdsToAdd = this.availableOptions.map((option) => option.value);

      // Add them to the currently selected kols (without duplicates)
      this.form.kols = [...new Set([...this.form.kols, ...kolIdsToAdd])];

      // Show confirmation message
      this.$bvToast.toast(`Added ${kolIdsToAdd.length} KOLs to recipients`, {
        title: "KOLs Selected",
        variant: "success",
        solid: true,
        autoHideDelay: 3000,
      });
    },
    removeAllKols() {
      // If there are no selected KOLs, do nothing
      if (this.form.kols.length === 0) {
        return;
      }

      // Store the count for the confirmation message
      const removedCount = this.form.kols.length;

      // Clear all selected KOLs
      this.form.kols = [];

      // Show confirmation message
      this.$bvToast.toast(`Removed ${removedCount} KOLs from recipients`, {
        title: "KOLs Removed",
        variant: "warning",
        solid: true,
        autoHideDelay: 3000,
      });
    },
  },
};
</script>

<style>
.select-all-btn,
.remove-all-btn {
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.select-all-btn:hover,
.remove-all-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.remove-all-btn {
  background-color: #f5365c;
  border-color: #f5365c;
}

.remove-all-btn:hover {
  background-color: #f21e48;
  border-color: #f21e48;
}
</style>
