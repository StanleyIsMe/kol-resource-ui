<template>
  <card>
    <div>
      <!-- Progress Bar -->
      <div class="progress-container mb-4">
        <div class="progress-steps d-flex justify-content-between align-items-center">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-item d-flex flex-column align-items-center"
            :class="{ 'active': currentStep >= index + 1, 'completed': currentStep > index + 1 }"
          >
            <div class="step-circle">
              <i :class="step.icon"></i>
            </div>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>
        <div class="progress-bar-container mt-2">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <!-- Step 1: Basic Information -->
          <div class="step-section" v-show="currentStep === 1">
            <h5 class="step-title mb-4">
              <i class="ni ni-email-83 mr-2"></i>Step 1: Basic Information
            </h5>
            
            <b-form-group id="input-group-subject" label="Subject" label-for="input-subject">
              <b-form-input
                id="input-subject"
                name="subject"
                type="text"
                v-model="form.subject"
                placeholder="Enter email subject"
                required
                :rules="{ required: true, max: 100 }"
                @input="validateStep1"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Email Content">
              <div id="app">
                <ckeditor
                  id="editor1"
                  name="editor1"
                  value="1"
                  v-model="editorData"
                  :config="editorConfig"
                  @ready="onEditorReady"
                ></ckeditor>
              </div>
            </b-form-group>
            
            <div class="text-right mt-3">
              <b-button variant="primary" @click="nextStep" :disabled="!canProceedToStep2">
                Next <i class="ni ni-bold-right"></i>
              </b-button>
            </div>
          </div>

          <!-- Step 2: Product and Sender Selection -->
          <div class="step-section" v-show="currentStep === 2">
            <h5 class="step-title mb-4">
              <i class="ni ni-box-2 mr-2"></i>Step 2: Product &amp; Sender
            </h5>
            
            <b-row>
              <b-col lg="6">
                <b-form-group label="Product" label-for="product-select">
                  <b-form-select
                    id="product-select"
                    v-model="form.product"
                    :options="productOptions"
                    @change="validateStep2"
                  >
                    <template #first>
                      <option disabled value="">Select a product</option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Sender" label-for="sender-select">
                  <b-form-select
                    id="sender-select"
                    v-model="form.sender"
                    :options="senderOptions"
                    @change="validateStep2"
                  >
                    <template #first>
                      <option disabled value="">Select a sender</option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            
            <div class="d-flex justify-content-between mt-3">
              <b-button variant="secondary" @click="prevStep">
                <i class="ni ni-bold-left"></i> Back
              </b-button>
              <b-button variant="primary" @click="nextStep" :disabled="!canProceedToStep3">
                Next <i class="ni ni-bold-right"></i>
              </b-button>
            </div>
          </div>

          <!-- Step 3: KOL Selection -->
          <div class="step-section" v-show="currentStep === 3">
            <h5 class="step-title mb-4">
              <i class="ni ni-single-02 mr-2"></i>Step 3: Search &amp; Select KOLs
            </h5>
            
            <!-- KOL Search Section -->
            <div class="kol-search-container">
              <div class="search-header mb-4">
                <h6 class="search-title">
                  <i class="ni ni-zoom-split mr-2"></i>Search Criteria
                </h6>
                <p class="search-subtitle text-muted">Set search criteria to find KOLs</p>
              </div>
              
              <b-form @submit.prevent="listKols" class="search-form">
                <div class="search-grid">
                  <!-- Name and Email Row -->
                  <div class="search-row">
                    <div class="search-field">
                      <label class="field-label">
                        <i class="ni ni-single-02 mr-1"></i>KOL Name
                      </label>
                      <b-form-input
                        type="text"
                        placeholder="Enter KOL name"
                        v-model="searchKols.name"
                        class="modern-input"
                      ></b-form-input>
                    </div>
                    <div class="search-field">
                      <label class="field-label">
                        <i class="ni ni-email-83 mr-1"></i>Email Address
                      </label>
                      <b-form-input
                        type="email"
                        placeholder="Enter email address"
                        v-model="searchKols.email"
                        class="modern-input"
                      ></b-form-input>
                    </div>
                  </div>
                  
                  <!-- Tags and Sex Row -->
                  <div class="search-row">
                    <div class="search-field tags-field">
                      <label class="field-label">
                        <i class="ni ni-tag mr-1"></i>Tags
                      </label>
                      <b-form-tags
                        id="tags-component-select"
                        v-model="searchKols.tag_ids"
                        size="lg"
                        class="modern-tags"
                        add-on-change
                        no-outer-focus
                        placeholder="Select tags..."
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
                          <div v-if="tags.length > 0" class="selected-tags">
                            <b-form-tag
                              v-for="tag in tags"
                              :key="tag"
                              @remove="removeTag(tag)"
                              :title="tag"
                              :disabled="disabled"
                              variant="primary"
                              class="tag-item"
                            >
                              <i class="ni ni-tag mr-1"></i>{{ getCustomTagDisplay(tag) }}
                            </b-form-tag>
                          </div>
                          <b-form-select
                            v-bind="inputAttrs"
                            v-on="inputHandlers"
                            :disabled="disabled || availableTagOptions.length === 0"
                            :options="availableTagOptions"
                            class="modern-select"
                          >
                            <template #first>
                              <option disabled value="">Select tags...</option>
                            </template>
                          </b-form-select>
                        </template>
                      </b-form-tags>
                    </div>
                    <div class="search-field">
                      <label class="field-label">
                        <i class="ni ni-user-run mr-1"></i>Gender
                      </label>
                      <b-form-select
                        v-model="searchKols.sex"
                        class="modern-select"
                      >
                        <option value="">All</option>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                      </b-form-select>
                    </div>
                  </div>
                  
                  <!-- Search Button -->
                  <div class="search-actions">
                    <b-button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      class="search-btn"
                      :disabled="isSearchingKols"
                    >
                      <b-spinner v-if="isSearchingKols" small class="mr-2"></b-spinner>
                      <i v-else class="ni ni-zoom-split mr-2"></i>
                      {{ isSearchingKols ? 'Searching...' : 'Search KOL' }}
                    </b-button>
                    <b-button 
                      type="button" 
                      variant="outline-secondary" 
                      size="lg" 
                      @click="clearSearch" 
                      class="clear-btn"
                      :disabled="isSearchingKols"
                    >
                      <i class="ni ni-fat-remove mr-2"></i>Clear
                    </b-button>
                  </div>
                </div>
              </b-form>
            </div>

            <!-- Selected KOLs Section -->
            <div class="selected-kols-container">
              <div class="selected-header mb-4">
                <h6 class="selected-title">
                  <i class="ni ni-check-bold mr-2"></i>Selected KOLs
                  <b-badge variant="primary" class="ml-2">{{ form.kols.length }}</b-badge>
                </h6>
                <p class="selected-subtitle text-muted">{{ form.kols.length }} KOLs selected as recipients</p>
              </div>
              
              <!-- KOL Selection Actions -->
              <div class="kol-actions mb-3">
                <b-button
                  variant="success"
                  size="sm"
                  @click="selectAllFilteredKols"
                  :disabled="kolOptions.length === 0"
                  class="action-btn"
                >
                  <i class="ni ni-check-bold mr-1"></i>Select All Results
                </b-button>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="removeAllKols"
                  :disabled="form.kols.length === 0"
                  class="action-btn"
                >
                  <i class="ni ni-fat-remove mr-1"></i>Clear All
                </b-button>
              </div>
              
              <!-- Selected KOLs Display -->
              <div class="selected-kols-display">
                <div v-if="form.kols.length === 0" class="empty-state">
                  <i class="ni ni-single-02 empty-icon"></i>
                  <p class="empty-text">No KOLs selected</p>
                  <p class="empty-subtext">Search and select KOLs to send emails to</p>
                </div>
                
                <div v-else class="kol-list">
                  <div 
                    v-for="kolId in form.kols" 
                    :key="kolId" 
                    class="kol-item"
                  >
                    <div class="kol-info">
                      <div class="kol-avatar">
                        <i class="ni ni-single-02"></i>
                      </div>
                      <div class="kol-details">
                        <div class="kol-name">{{ getKolName(kolId) }}</div>
                        <div class="kol-email">{{ getKolEmail(kolId) }}</div>
                      </div>
                    </div>
                    <b-button
                      variant="outline-danger"
                      size="sm"
                      @click="removeKol(kolId)"
                      class="remove-kol-btn"
                    >
                      <i class="ni ni-fat-remove"></i>
                    </b-button>
                  </div>
                </div>
              </div>
              
              <!-- Add More KOLs -->
              <div class="add-kols-section">
                <h6 class="add-title mb-3">
                  <i class="ni ni-fat-add mr-2"></i>Add More KOLs
                </h6>
                <b-form-tags
                  id="kol"
                  v-model="form.kols"
                  size="lg"
                  class="modern-kol-tags"
                  add-on-change
                  no-outer-focus
                  @input="validateStep3"
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
                    <b-form-select
                      v-bind="inputAttrs"
                      v-on="inputHandlers"
                      :disabled="disabled || availableOptions.length === 0"
                      :options="availableOptions"
                      class="modern-select"
                    >
                      <template #first>
                        <option disabled value="">Select a KOL...</option>
                      </template>
                    </b-form-select>
                  </template>
                </b-form-tags>
              </div>
            </div>
            
            <div class="d-flex justify-content-between mt-3">
              <b-button variant="secondary" @click="prevStep">
                <i class="ni ni-bold-left"></i> Back
              </b-button>
              <b-button variant="primary" @click="nextStep" :disabled="!canProceedToStep4">
                Next <i class="ni ni-bold-right"></i>
              </b-button>
            </div>
          </div>

          <!-- Step 4: Submit -->
          <div class="step-section" v-show="currentStep === 4">
            <h5 class="step-title mb-4">
              <i class="ni ni-send mr-2"></i>Step 4: Confirm &amp; Send
            </h5>
            
            <!-- Email Information Preview -->
            <div class="preview-content">
              <div class="preview-section mb-3">
                <h6 class="text-primary mb-2">
                  <i class="ni ni-email-83 mr-1"></i>Email Information
                </h6>
                <p><strong>Subject:</strong> {{ form.subject }}</p>
                <p><strong>Sender:</strong> {{ getSenderName(form.sender) }} ({{ getSenderEmail(form.sender) }})</p>
                <p><strong>Product:</strong> {{ getProductName(form.product) }}</p>
              </div>
              
              <div class="preview-section mb-4">
                <h6 class="text-primary mb-2">
                  <i class="ni ni-single-02 mr-1"></i>Recipient List ({{ form.kols.length }})
                </h6>
                <div class="recipients-list">
                  <div 
                    v-for="kolId in form.kols" 
                    :key="kolId" 
                    class="recipient-item d-flex align-items-center mb-2"
                  >
                    <i class="ni ni-check-bold text-success mr-2"></i>
                    <span>{{ getCustomKolDisplay(kolId) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <b-button variant="secondary" @click="prevStep">
                <i class="ni ni-bold-left"></i> Back
              </b-button>
              <div>
                <b-button type="submit" variant="primary" size="lg">
                  <i class="ni ni-send mr-1"></i>Send Email
                </b-button>
              </div>
            </div>
          </div>
        </b-form>
      </validation-observer>

      
      <!-- Success Modal -->
      <b-modal
        id="success-modal"
        size="md"
        centered
        hide-footer
        hide-header-close
        no-close-on-backdrop
        no-close-on-esc
      >
        <template #modal-header>
          <div class="success-modal-header">
            <div class="success-icon">
              <i class="ni ni-check-bold"></i>
            </div>
            <h5 class="success-title">Email Job Created</h5>
          </div>
        </template>
        
        <div class="success-modal-content">
          <div class="success-message">
            <p>{{ successMessage }}</p>
          </div>
          <div class="success-actions">
            <b-button 
              variant="success" 
              size="lg" 
              @click="confirmSuccess"
              class="success-confirm-btn"
            >
              <i class="ni ni-check-bold mr-2"></i>
              Confirm
            </b-button>
          </div>
        </div>
      </b-modal>

      <!-- Error Modal -->
      <b-modal
        id="error-modal"
        title=""
        size="md"
        centered
        hide-footer
        hide-header-close
        no-close-on-backdrop
        no-close-on-esc
      >
        <template #modal-header>
          <div class="error-modal-header">
            <div class="error-icon">
              <i class="ni ni-notification-70"></i>
            </div>
            <h5 class="error-title">Send Failed</h5>
          </div>
        </template>
        
        <div class="error-modal-content">
          <div class="error-message">
            <p>{{ errorMessage }}</p>
          </div>
          <div class="error-actions">
            <b-button 
              variant="primary" 
              size="lg" 
              @click="$bvModal.hide('error-modal')"
              class="error-confirm-btn"
            >
              <i class="ni ni-check-bold mr-2"></i>
              OK
            </b-button>
          </div>
        </div>
      </b-modal>
    </div>
  </card>
</template>

<script>
export default {
  name: "EditEmailForm",
  data() {
    return {
      currentStep: 1,
      steps: [
        { label: "Basic Info", icon: "ni ni-email-83" },
        { label: "Product & Sender", icon: "ni ni-box-2" },
        { label: "KOL Selection", icon: "ni ni-single-02" },
        { label: "Confirm", icon: "ni ni-send" }
      ],
      
      editorData: "",
      editorConfig: {
        toolbar: [
          { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
          { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
          { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
          { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
          '/',
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
          { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
          { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
          '/',
          { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
          { name: 'colors', items: ['TextColor', 'BGColor'] },
          { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
          { name: 'about', items: ['About'] }
        ],
        height: 300,
        width: '100%',
        filebrowserImageUploadUrl: '/api/upload/image',
        filebrowserImageBrowseUrl: '/api/browse/images',
        removeDialogTabs: 'image:advanced;link:advanced',
        extraPlugins: 'uploadimage,uploadfile',
        uploadUrl: '/api/upload/file',
        allowedContent: true,
        extraAllowedContent: 'img[alt,src,width,height];a[href,target]',
        language: 'zh-cn',
        uiColor: '#f8f9fa',
        contentsCss: [
          'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css'
        ]
      },
      
      form: {
        subject: "",
        emailBody: "",
        kols: [],
        product: "",
        sender: "",
      },
      
      searchKols: {
        name: "",
        tag: "",
        tag_ids: [],
        email: "",
        sex: "",
        page_index: 1,
        page_size: 1000,
      },
      
      options: [],
      value: [],
      tagMap: new Map(),
      kolMap: new Map(),
      senderMap: new Map(),
      
      show: true,
      kolOptions: [],
      productOptions: [],
      senderOptions: [],
      tagOptions: [],
      tagValue: [],
      kolTags: [],
      
      isSearchingKols: false,
      errorMessage: '',
      successMessage: '',
    };
  },
  mounted() {
    this.editorDom = CKEDITOR.replace("editor1");
    this.listProducts();
    this.listTags();
    this.listSenders();
  },
  computed: {
    progressPercentage() {
      return ((this.currentStep - 1) / (this.steps.length - 1)) * 100;
    },
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
    canProceedToStep2() {
      return this.form.subject.trim() && this.editorData.trim();
    },
    canProceedToStep3() {
      return this.form.product && this.form.sender;
    },
    canProceedToStep4() {
      return this.form.kols.length > 0;
    },
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    
    onEditorReady() {
      this.editorDom.on('change', () => {
        this.editorData = this.editorDom.getData();
      });
    },
    
    validateStep1() {},
    validateStep2() {},
    validateStep3() {},
    
    clearSearch() {
      this.searchKols = {
        name: "",
        tag: "",
        tag_ids: [],
        email: "",
        sex: "",
        page_index: 1,
        page_size: 1000,
      };
    },
    removeKol(kolId) {
      const index = this.form.kols.indexOf(kolId);
      if (index > -1) {
        this.form.kols.splice(index, 1);
      }
    },
    
    getCustomKolDisplay(tag) {
      return this.kolMap.get(tag);
    },
    getCustomTagDisplay(tag) {
      return this.tagMap.get(tag);
    },
    getSenderName(senderId) {
      const sender = this.senderOptions.find(opt => opt.value === senderId);
      return sender ? sender.text.split(' (')[0] : 'Unknown';
    },
    getSenderEmail(senderId) {
      const sender = this.senderOptions.find(opt => opt.value === senderId);
      return sender ? sender.text.split(' (')[1].replace(')', '') : 'Unknown';
    },
    getKolName(kolId) {
      const displayName = this.kolMap.get(kolId);
      if (!displayName) return 'Unknown KOL';
      return displayName.split(' - ')[0];
    },
    getKolEmail(kolId) {
      const displayName = this.kolMap.get(kolId);
      if (!displayName) return 'unknown@email.com';
      return displayName.split(' - ')[1] || 'unknown@email.com';
    },
    onSubmit(event) {
      event.preventDefault();
      
      if (!this.form.subject.trim()) {
        this.$bvToast.toast("Subject is required", {
          title: "Validation Error",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (!this.editorDom.getData().trim()) {
        this.$bvToast.toast("Email content is required", {
          title: "Validation Error",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (!this.form.product) {
        this.$bvToast.toast("Please select a product", {
          title: "Validation Error",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (!this.form.sender) {
        this.$bvToast.toast("Please select a sender", {
          title: "Validation Error",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (this.form.kols.length === 0) {
        this.$bvToast.toast("Please select at least one KOL", {
          title: "Validation Error",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      this.confirmSend();
    },
    
    confirmSend() {
      const originalContent = this.editorDom.getData();
      const { processedContent, images } = this.processImagesForEmail(originalContent);

      this.form.emailBody = processedContent;

      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/email_jobs";

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
        sender_id: this.form.sender,
        images: images,
      };

      this.$bvToast.toast("Sending emails, please wait...", {
        title: "Sending",
        variant: "info",
        solid: true,
        autoHideDelay: 5000,
        toaster: 'b-toaster-top-right'
      });

      this.axios
        .post(url, requestBody, config)
        .then((response) => {
          if (response.status == 200) {
            const kolCount = this.form.kols.length;
            const subject = this.form.subject;
            this.successMessage = `Email "${subject}" has been queued for ${kolCount} KOLs`;
            this.$bvModal.show('success-modal');
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          let errorMessage = "Failed to send email. Please try again.";
          
          if (error.response) {
            if (error.response.data) {
              if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
              } else if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
              }
            } else if (error.response.statusText) {
              errorMessage = error.response.statusText;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.$bvToast.toast(errorMessage, {
            title: "Send Failed",
            variant: "danger",
            solid: true,
            autoHideDelay: 8000,
            toaster: 'b-toaster-top-right'
          });
          
          this.showErrorModal(errorMessage);
        });
    },
    
    showErrorModal(errorMessage) {
      this.errorMessage = errorMessage;
      this.$bvModal.show('error-modal');
    },
    
    confirmSuccess() {
      this.$bvModal.hide('success-modal');
      this.onReset();
    },
    
    onReset(event) {
      if (event) event.preventDefault();
      
      this.form.subject = "";
      this.form.emailBody = "";
      this.form.kols = [];
      this.form.product = "";
      this.form.sender = "";
      this.editorData = "";
      
      if (this.editorDom) {
        this.editorDom.setData("");
      }
      
      this.currentStep = 1;
      
      this.searchKols = {
        name: "",
        tag: "",
        tag_ids: [],
        email: "",
        sex: "",
        page_index: 1,
        page_size: 1000,
      };
      
      this.kolOptions = [];
      this.kolMap.clear();
      
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$nextTick(() => {
          this.editorDom = CKEDITOR.replace("editor1");
          this.editorDom.on('change', () => {
            this.editorData = this.editorDom.getData();
          });
        });
      });
    },
    
    listSenders() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/email_senders";

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
            this.senderOptions = [];
            const senders = response.data.email_senders || [];
            senders.forEach((sender) => {
              this.senderOptions.push({
                text: `${sender.name} (${sender.email})`,
                value: sender.id,
              });
              this.senderMap.set(sender.id, sender);
            });
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          this.$bvToast.toast("Failed to load email senders", {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 3000,
            toaster: "b-toaster-top-right",
          });
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
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });
            return;
          }

          this.$bvToast.toast("Failed to load products", {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 3000,
            toaster: "b-toaster-top-right",
          });
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
              this.tagOptions.push({ text: tag.name, value: tag.id });
            });
          }
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });
            return;
          }

          this.$bvToast.toast("Failed to load tags", {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 3000,
            toaster: "b-toaster-top-right",
          });
        });
    },
    async listKols() {
      this.isSearchingKols = true;
      
      this.$bvToast.toast("Searching for KOLs...", {
        title: "Searching",
        variant: "info",
        solid: true,
        autoHideDelay: 2000,
        toaster: 'b-toaster-top-right'
      });
      
      try {
        const previouslySelectedKols = new Map();
        this.form.kols.forEach(kolId => {
          if (this.kolMap.has(kolId)) {
            previouslySelectedKols.set(kolId, this.kolMap.get(kolId));
          }
        });
        
        this.kolMap.clear();
        this.kolOptions = [];
        
        previouslySelectedKols.forEach((displayName, kolId) => {
          this.kolMap.set(kolId, displayName);
        });
        
        let pageIndex = 1;
        const pageSize = 1000;
        let allKols = [];
        let hasMorePages = true;
        
        while (hasMorePages) {
          const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols";
          
          let config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params: {
              page_index: pageIndex,
              page_size: pageSize,
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

          const response = await this.axios.get(url, config);
          
          if (response.status === 200) {
            const kols = response.data.kols || [];
            allKols = allKols.concat(kols);
            
            hasMorePages = kols.length === pageSize;
            pageIndex++;
          } else {
            hasMorePages = false;
          }
        }
        
        allKols.forEach((kol) => {
          const displayName = `${kol.name} - ${kol.email}`;
          this.kolOptions.push({
            text: displayName,
            value: kol.id,
          });
          this.kolMap.set(kol.id, displayName);
        });
        
        this.$bvToast.toast(`Search complete! Found ${allKols.length} KOLs`, {
          title: "Search Complete",
          variant: "success",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right',
          noCloseButton: false
        });
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push({ name: "login" });
          return;
        }

        const errorMessage = (error.response && error.response.data && error.response.data.message) || 
                            (error.response && error.response.data) || 
                            "Failed to search KOLs";
        this.$bvToast.toast(errorMessage, {
          title: "Search Failed",
          variant: "danger",
          solid: true,
          autoHideDelay: 5000,
          toaster: 'b-toaster-top-right'
        });
      } finally {
        this.isSearchingKols = false;
      }
    },
    processImagesForEmail(htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const images = [];
      let imageCounter = 1;

      const imgElements = doc.querySelectorAll("img");

      imgElements.forEach((img) => {
        const src = img.getAttribute("src");

        if (src && src.startsWith("data:image/")) {
          const imageType = src.split(";")[0].split("/")[1];
          const base64Data = src.split(",")[1];
          const contentId = `image${imageCounter}`;

          img.setAttribute("src", `cid:${contentId}`);

          images.push({
            content_id: contentId,
            type: imageType,
            data: base64Data,
          });

          imageCounter++;
        }
      });

      const processedContent = doc.body.innerHTML;

      return { processedContent, images };
    },
    selectAllFilteredKols() {
      if (this.kolOptions.length === 0 || this.availableOptions.length === 0) {
        return;
      }

      const kolIdsToAdd = this.availableOptions.map((option) => option.value);

      this.form.kols = [...new Set([...this.form.kols, ...kolIdsToAdd])];

      this.$bvToast.toast(`Added ${kolIdsToAdd.length} KOLs to recipients`, {
        title: "KOLs Selected",
        variant: "success",
        solid: true,
        autoHideDelay: 3000,
        toaster: 'b-toaster-top-right'
      });
    },
    removeAllKols() {
      if (this.form.kols.length === 0) {
        return;
      }

      const removedCount = this.form.kols.length;

      this.form.kols = [];

      this.$bvToast.toast(`Removed ${removedCount} KOLs from recipients`, {
        title: "KOLs Removed",
        variant: "warning",
        solid: true,
        autoHideDelay: 3000,
        toaster: 'b-toaster-top-right'
      });
    },
    getProductName(productId) {
      const product = this.productOptions.find(
        (option) => option.value === productId
      );
      return product ? product.text : "Unknown Product";
    },
    handleRemoveKol(tag, removeTagFunction) {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      removeTagFunction(tag);

      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto",
        });
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
$gcp-blue: #1a73e8;
$gcp-green: #1e8e3e;
$gcp-text: #202124;
$gcp-secondary: #5f6368;
$gcp-border: #dadce0;
$gcp-surface: #ffffff;
$gcp-bg: #fafafa;

.progress-container {
  background: $gcp-surface;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid $gcp-border;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.progress-steps {
  position: relative;
  margin-bottom: 15px;
}

.step-item {
  flex: 1;
  position: relative;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e8eaed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  border: 3px solid #e8eaed;
}

.step-item.active .step-circle {
  background: $gcp-blue;
  border-color: $gcp-blue;
  color: white;
}

.step-item.completed .step-circle {
  background: $gcp-green;
  border-color: $gcp-green;
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: $gcp-secondary;
  text-align: center;
}

.step-item.active .step-label,
.step-item.completed .step-label {
  color: $gcp-blue;
}

.progress-bar-container {
  height: 4px;
  background: #e8eaed;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: $gcp-blue;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.step-section {
  background: $gcp-surface;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid $gcp-border;
  transition: box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-section:hover {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.step-title {
  color: $gcp-blue;
  font-weight: 600;
  border-bottom: 2px solid $gcp-border;
  padding-bottom: 15px;
  margin-bottom: 25px;
  position: relative;
}

.step-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: $gcp-blue;
  border-radius: 1px;
}

.b-form-tags-form {
  transition: none !important;
}

.select-all-btn,
.remove-all-btn {
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.remove-all-btn {
  background-color: #f5365c;
  border-color: #f5365c;
}

.remove-all-btn:hover {
  background-color: #f21e48;
  border-color: #f21e48;
}

.preview-content {
  padding: 10px 0;
}

.preview-section {
  background: $gcp-bg;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid $gcp-blue;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
}

.recipients-list {
  max-height: 200px;
  overflow-y: auto;
}

.recipient-item {
  padding: 8px 12px;
  background: $gcp-surface;
  border-radius: 6px;
  border: 1px solid $gcp-border;
}

.kol-search-container {
  background: $gcp-surface;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 25px;
  border: 1px solid $gcp-border;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.search-header {
  text-align: center;
  margin-bottom: 25px;
}

.search-title {
  color: $gcp-blue;
  font-weight: 600;
  margin-bottom: 5px;
}

.search-subtitle {
  font-size: 14px;
  margin: 0;
}

.search-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.search-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-weight: 600;
  color: $gcp-text;
  margin-bottom: 8px;
  font-size: 14px;
}

.modern-input,
.modern-select {
  border: 1px solid $gcp-border;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: $gcp-surface;
}

.modern-input:focus,
.modern-select:focus {
  border-color: $gcp-blue;
  box-shadow: 0 0 0 0.2rem rgba(26, 115, 232, 0.25);
  outline: none;
}

.tags-field {
  grid-column: span 1;
}

.modern-tags {
  border: 1px solid $gcp-border;
  border-radius: 8px;
  background: $gcp-surface;
  padding: 8px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.tag-item {
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
}

.search-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.search-btn,
.clear-btn {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.search-btn:hover {
  box-shadow: 0 1px 6px rgba(26, 115, 232, 0.3);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-btn:disabled:hover {
  box-shadow: none;
}

.clear-btn:hover {
  box-shadow: 0 1px 6px rgba(95, 99, 104, 0.3);
}

.selected-kols-container {
  background: $gcp-surface;
  border-radius: 15px;
  padding: 30px;
  border: 1px solid $gcp-border;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.selected-header {
  text-align: center;
  border-bottom: 1px solid $gcp-border;
  padding-bottom: 15px;
}

.selected-title {
  color: $gcp-green;
  font-weight: 600;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-subtitle {
  font-size: 14px;
  margin: 0;
}

.kol-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-btn {
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.selected-kols-display {
  margin-bottom: 25px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: $gcp-secondary;
}

.empty-icon {
  font-size: 48px;
  color: $gcp-border;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: $gcp-text;
}

.empty-subtext {
  font-size: 14px;
  margin: 0;
}

.kol-list {
  display: grid;
  gap: 12px;
}

.kol-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $gcp-bg;
  border-radius: 10px;
  padding: 18px;
  border: 1px solid $gcp-border;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.kol-item:hover {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.kol-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kol-avatar {
  width: 40px;
  height: 40px;
  background: $gcp-blue;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.kol-details {
  display: flex;
  flex-direction: column;
}

.kol-name {
  font-weight: 600;
  color: $gcp-text;
  font-size: 14px;
}

.kol-email {
  font-size: 12px;
  color: $gcp-secondary;
  font-style: italic;
}

.remove-kol-btn {
  border-radius: 6px;
  padding: 6px 10px;
  transition: all 0.3s ease;
}

.add-kols-section {
  border-top: 1px solid $gcp-border;
  padding-top: 20px;
}

.add-title {
  color: $gcp-blue;
  font-weight: 600;
  text-align: center;
}

.modern-kol-tags {
  border: 1px solid $gcp-border;
  border-radius: 8px;
  background: $gcp-surface;
  padding: 8px;
}

.error-modal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 2px solid rgba(220, 53, 69, 0.2);
}

.error-icon {
  width: 50px;
  height: 50px;
  background: #dc3545;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);

  i {
    color: white;
    font-size: 24px;
  }
}

.error-title {
  color: #dc3545;
  font-weight: 600;
  margin: 0;
  font-size: 1.5rem;
}

.error-modal-content {
  padding: 30px 0;
  text-align: center;
}

.error-message {
  background: #fce8e6;
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;

  p {
    color: #721c24;
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.6;
  }
}

.error-actions {
  display: flex;
  justify-content: center;
}

.error-confirm-btn {
  background: #dc3545;
  border: none;
  border-radius: 10px;
  padding: 12px 30px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  }
}

.success-modal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 2px solid rgba(30, 142, 62, 0.2);
}

.success-icon {
  width: 50px;
  height: 50px;
  background: $gcp-green;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(30, 142, 62, 0.3);

  i {
    color: white;
    font-size: 24px;
  }
}

.success-title {
  color: $gcp-green;
  font-weight: 600;
  margin: 0;
  font-size: 1.5rem;
}

.success-modal-content {
  padding: 30px 0;
  text-align: center;
}

.success-message {
  background: #e6f4ea;
  border: 1px solid rgba(30, 142, 62, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;

  p {
    color: #137333;
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.6;
  }
}

.success-actions {
  display: flex;
  justify-content: center;
}

.success-confirm-btn {
  background: $gcp-green;
  border: none;
  border-radius: 10px;
  padding: 12px 30px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(30, 142, 62, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #1b7e38;
    box-shadow: 0 4px 12px rgba(30, 142, 62, 0.4);
  }
}

@media (max-width: 768px) {
  .search-row {
    grid-template-columns: 1fr;
  }

  .search-actions {
    flex-direction: column;
    align-items: center;
  }

  .kol-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
