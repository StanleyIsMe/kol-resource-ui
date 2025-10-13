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
              <i class="ni ni-email-83 mr-2"></i>步驟 1: 基本資訊
            </h5>
            
            <b-form-group id="input-group-subject" label="Subject" label-for="input-subject">
              <b-form-input
                id="input-subject"
                name="subject"
                type="text"
                v-model="form.subject"
                placeholder="請輸入郵件主旨"
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
                下一步 <i class="ni ni-bold-right"></i>
              </b-button>
            </div>
          </div>

          <!-- Step 2: Product and Sender Selection -->
          <div class="step-section" v-show="currentStep === 2">
            <h5 class="step-title mb-4">
              <i class="ni ni-box-2 mr-2"></i>步驟 2: 產品與寄信者選擇
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
                      <option disabled value="">請選擇產品</option>
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
                      <option disabled value="">請選擇寄信者</option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            
            <div class="d-flex justify-content-between mt-3">
              <b-button variant="secondary" @click="prevStep">
                <i class="ni ni-bold-left"></i> 上一步
              </b-button>
              <b-button variant="primary" @click="nextStep" :disabled="!canProceedToStep3">
                下一步 <i class="ni ni-bold-right"></i>
              </b-button>
            </div>
          </div>

          <!-- Step 3: KOL Selection -->
          <div class="step-section" v-show="currentStep === 3">
            <h5 class="step-title mb-4">
              <i class="ni ni-single-02 mr-2"></i>步驟 3: KOL 搜尋與選擇
            </h5>
            
            <!-- KOL Search Section -->
            <div class="kol-search-container">
              <div class="search-header mb-4">
                <h6 class="search-title">
                  <i class="ni ni-zoom-split mr-2"></i>搜尋條件
                </h6>
                <p class="search-subtitle text-muted">請設定搜尋條件來找到合適的KOL</p>
              </div>
              
              <b-form @submit.prevent="listKols" class="search-form">
                <div class="search-grid">
                  <!-- Name and Email Row -->
                  <div class="search-row">
                    <div class="search-field">
                      <label class="field-label">
                        <i class="ni ni-single-02 mr-1"></i>KOL名稱
                      </label>
                      <b-form-input
                        type="text"
                        placeholder="請輸入KOL名稱"
                        v-model="searchKols.name"
                        class="modern-input"
                      ></b-form-input>
                    </div>
                    <div class="search-field">
                      <label class="field-label">
                        <i class="ni ni-email-83 mr-1"></i>Email地址
                      </label>
                      <b-form-input
                        type="email"
                        placeholder="請輸入Email地址"
                        v-model="searchKols.email"
                        class="modern-input"
                      ></b-form-input>
                    </div>
                  </div>
                  
                  <!-- Tags and Sex Row -->
                  <div class="search-row">
                    <div class="search-field tags-field">
                      <label class="field-label">
                        <i class="ni ni-tag mr-1"></i>標籤分類
                      </label>
                      <b-form-tags
                        id="tags-component-select"
                        v-model="searchKols.tag_ids"
                        size="lg"
                        class="modern-tags"
                        add-on-change
                        no-outer-focus
                        placeholder="選擇標籤..."
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
                              <option disabled value="">選擇標籤...</option>
                            </template>
                          </b-form-select>
                        </template>
                      </b-form-tags>
                    </div>
                    <div class="search-field">
                      <label class="field-label">
                        <i class="ni ni-user-run mr-1"></i>性別
                      </label>
                      <b-form-select
                        v-model="searchKols.sex"
                        class="modern-select"
                      >
                        <option value="">全部</option>
                        <option value="m">男性</option>
                        <option value="f">女性</option>
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
                      {{ isSearchingKols ? '搜尋中...' : '搜尋KOL' }}
                    </b-button>
                    <b-button 
                      type="button" 
                      variant="outline-secondary" 
                      size="lg" 
                      @click="clearSearch" 
                      class="clear-btn"
                      :disabled="isSearchingKols"
                    >
                      <i class="ni ni-fat-remove mr-2"></i>清除條件
                    </b-button>
                  </div>
                </div>
              </b-form>
            </div>

            <!-- Selected KOLs Section -->
            <div class="selected-kols-container">
              <div class="selected-header mb-4">
                <h6 class="selected-title">
                  <i class="ni ni-check-bold mr-2"></i>已選擇的KOL
                  <b-badge variant="primary" class="ml-2">{{ form.kols.length }}</b-badge>
                </h6>
                <p class="selected-subtitle text-muted">已選擇 {{ form.kols.length }} 位KOL作為收件者</p>
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
                  <i class="ni ni-check-bold mr-1"></i>全選搜尋結果
                </b-button>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="removeAllKols"
                  :disabled="form.kols.length === 0"
                  class="action-btn"
                >
                  <i class="ni ni-fat-remove mr-1"></i>清除所有選擇
                </b-button>
              </div>
              
              <!-- Selected KOLs Display -->
              <div class="selected-kols-display">
                <div v-if="form.kols.length === 0" class="empty-state">
                  <i class="ni ni-single-02 empty-icon"></i>
                  <p class="empty-text">尚未選擇任何KOL</p>
                  <p class="empty-subtext">請先搜尋並選擇要發送郵件的KOL</p>
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
                  <i class="ni ni-fat-add mr-2"></i>新增更多KOL
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
                        <option disabled value="">選擇KOL加入收件者...</option>
                      </template>
                    </b-form-select>
                  </template>
                </b-form-tags>
              </div>
            </div>
            
            <div class="d-flex justify-content-between mt-3">
              <b-button variant="secondary" @click="prevStep">
                <i class="ni ni-bold-left"></i> 上一步
              </b-button>
              <b-button variant="primary" @click="nextStep" :disabled="!canProceedToStep4">
                下一步 <i class="ni ni-bold-right"></i>
              </b-button>
            </div>
          </div>

          <!-- Step 4: Submit -->
          <div class="step-section" v-show="currentStep === 4">
            <h5 class="step-title mb-4">
              <i class="ni ni-send mr-2"></i>步驟 4: 確認發送
            </h5>
            
            <!-- Email Information Preview -->
            <div class="preview-content">
              <div class="preview-section mb-3">
                <h6 class="text-primary mb-2">
                  <i class="ni ni-email-83 mr-1"></i>郵件資訊
                </h6>
                <p><strong>主旨:</strong> {{ form.subject }}</p>
                <p><strong>寄信者:</strong> {{ getSenderName(form.sender) }} ({{ getSenderEmail(form.sender) }})</p>
                <p><strong>產品:</strong> {{ getProductName(form.product) }}</p>
              </div>
              
              <div class="preview-section mb-4">
                <h6 class="text-primary mb-2">
                  <i class="ni ni-single-02 mr-1"></i>收件者清單 ({{ form.kols.length }}位)
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
                <i class="ni ni-bold-left"></i> 上一步
              </b-button>
              <div>
                <b-button type="submit" variant="primary" size="lg" class="mr-3">
                  <i class="ni ni-send mr-1"></i>Send Email
                </b-button>
                <b-button type="reset" variant="danger" size="lg">
                  <i class="ni ni-fat-remove mr-1"></i>Reset
                </b-button>
              </div>
            </div>
          </div>
        </b-form>
      </validation-observer>

      
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
            <h5 class="error-title">發送失敗</h5>
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
              我知道了
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
      // Progress tracking
      currentStep: 1,
      steps: [
        { label: "基本資訊", icon: "ni ni-email-83" },
        { label: "產品寄信者", icon: "ni ni-box-2" },
        { label: "KOL選擇", icon: "ni ni-single-02" },
        { label: "確認發送", icon: "ni ni-send" }
      ],
      
      // Editor
      editorData: "<p>Content of the editor.</p>",
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
      
      // Form data
      form: {
        subject: "",
        emailBody: "",
        kols: [],
        product: "",
        sender: "",
      },
      
      // Search and options
      searchKols: {
        name: "",
        tag: "",
        tag_ids: [],
        email: "",
        sex: "",
        page_index: 1,
        page_size: 1000,
      },
      
      // Options
      options: [],
      value: [],
      tagMap: new Map(),
      kolMap: new Map(),
      senderMap: new Map(),
      
      // UI state
      show: true,
      kolOptions: [],
      productOptions: [],
      senderOptions: [],
      tagOptions: [],
      tagValue: [],
      kolTags: [],
      
      // Loading states
      isSearchingKols: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.editorDom = CKEDITOR.replace("editor1");
    this.listProducts();
    this.listTags();
    this.listSenders();
    // Removed this.listKols() - only load KOLs when user searches
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
    // Step navigation methods
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
    
    // CKEditor ready handler
    onEditorReady() {
      // Set up CKEditor change event
      this.editorDom.on('change', () => {
        this.editorData = this.editorDom.getData();
      });
    },
    
    // Step validation methods
    validateStep1() {
      // This will be called automatically by computed properties
    },
    validateStep2() {
      // This will be called automatically by computed properties
    },
    validateStep3() {
      // This will be called automatically by computed properties
    },
    
    // KOL management methods
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
    
    // Display methods
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
      
      // Comprehensive validation
      if (!this.form.subject.trim()) {
        this.$bvToast.toast("主旨不得為空", {
          title: "驗證失敗",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (!this.editorDom.getData().trim()) {
        this.$bvToast.toast("信件內容不得為空", {
          title: "驗證失敗",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (!this.form.product) {
        this.$bvToast.toast("請選擇產品", {
          title: "驗證失敗",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (!this.form.sender) {
        this.$bvToast.toast("請選擇寄信者", {
          title: "驗證失敗",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      if (this.form.kols.length === 0) {
        this.$bvToast.toast("請選擇至少一個KOL", {
          title: "驗證失敗",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right'
        });
        return;
      }

      // Call API directly
      this.confirmSend();
    },
    
    confirmSend() {
      // Process the content to extract images and convert to CID format
      const originalContent = this.editorDom.getData();
      const { processedContent, images } = this.processImagesForEmail(originalContent);

      this.form.emailBody = processedContent;

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
        images: images,
      };

      // Show sending status
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
            this.$bvToast.toast(`成功發送郵件給 ${this.form.kols.length} 位KOL`, {
              title: "發送成功",
              variant: "success",
              solid: true,
              autoHideDelay: 5000,
              toaster: 'b-toaster-top-right'
            });
            // Reset form after successful send
            this.onReset();
          }
        })
        .catch((error) => {
          console.error("Send email error:", error);
          
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          // Extract error message from different possible locations
          let errorMessage = "發送郵件失敗，請稍後再試";
          
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
          
          // Show error toast
          this.$bvToast.toast(errorMessage, {
            title: "發送失敗",
            variant: "danger",
            solid: true,
            autoHideDelay: 8000,
            toaster: 'b-toaster-top-right'
          });
          
          // Show custom error modal instead of alert
          this.showErrorModal(errorMessage);
        });
    },
    
    showErrorModal(errorMessage) {
      this.errorMessage = errorMessage;
      this.$bvModal.show('error-modal');
    },
    
    onReset(event) {
      if (event) event.preventDefault();
      
      // Reset form values
      this.form.subject = "";
      this.form.emailBody = "";
      this.form.kols = [];
      this.form.product = "";
      this.form.sender = "";
      
      // Reset editor
      if (this.editorDom) {
        this.editorDom.setData("<p>Content of the editor.</p>");
      }
      
      // Reset progress
      this.currentStep = 1;
      
      // Reset search
      this.searchKols = {
        name: "",
        tag: "",
        tag_ids: [],
        email: "",
        sex: "",
        page_index: 1,
        page_size: 1000,
      };
      
      // Reset KOL options
      this.kolOptions = [];
      this.kolMap.clear();
      
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    
    // API methods
    listSenders() {
      // Fake API implementation for now
      const fakeSenders = [
        { id: "uuid-1", name: "stanley_01", email: "stanley01@gmail.com" },
        { id: "uuid-2", name: "marketing_team", email: "marketing@company.com" },
        { id: "uuid-3", name: "admin_user", email: "admin@company.com" }
      ];
      
      this.senderOptions = [];
      fakeSenders.forEach((sender) => {
        this.senderOptions.push({
          text: `${sender.name} (${sender.email})`,
          value: sender.id,
        });
        this.senderMap.set(sender.id, sender);
      });
      
      console.log("Fake senders loaded:", fakeSenders);
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
    async listKols() {
      // Set loading state
      this.isSearchingKols = true;
      
      // Show loading toast
      this.$bvToast.toast("正在搜尋KOL，請稍候...", {
        title: "搜尋中",
        variant: "info",
        solid: true,
        autoHideDelay: 2000,
        toaster: 'b-toaster-top-right'
      });
      
      try {
        // Store previously selected KOLs to preserve them
        const previouslySelectedKols = new Map();
        this.form.kols.forEach(kolId => {
          if (this.kolMap.has(kolId)) {
            previouslySelectedKols.set(kolId, this.kolMap.get(kolId));
          }
        });
        
        // Clear current options but preserve selected KOLs
        this.kolMap.clear();
        this.kolOptions = [];
        
        // Add previously selected KOLs back to the map
        previouslySelectedKols.forEach((displayName, kolId) => {
          this.kolMap.set(kolId, displayName);
        });
        
        // Pagination variables
        let pageIndex = 1;
        const pageSize = 1000;
        let allKols = [];
        let hasMorePages = true;
        
        // Fetch all pages
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
            
            // Check if there are more pages
            hasMorePages = kols.length === pageSize;
            pageIndex++;
            
            // Update loading message for pagination
            this.$bvToast.toast(`已載入 ${allKols.length} 位KOL，繼續搜尋中...`, {
              title: "搜尋中",
              variant: "info",
              solid: true,
              autoHideDelay: 1000,
              toaster: 'b-toaster-top-right'
            });
          } else {
            hasMorePages = false;
          }
        }
        
        // Add all found KOLs to options
        allKols.forEach((kol) => {
          const displayName = `${kol.name} - ${kol.email}`;
          this.kolOptions.push({
            text: displayName,
            value: kol.id,
          });
          this.kolMap.set(kol.id, displayName);
        });
        
        // Show success message
        this.$bvToast.toast(`搜尋完成！找到 ${allKols.length} 位KOL`, {
          title: "搜尋完成",
          variant: "success",
          solid: true,
          autoHideDelay: 3000,
          toaster: 'b-toaster-top-right',
          noCloseButton: false
        });
        
        console.log("Total KOLs found:", allKols.length);
        
      } catch (error) {
        console.error("Error:", error);
        
        if (error.response && error.response.status === 401) {
          this.$router.push({ name: "login" });
          return;
        }

        const errorMessage = (error.response && error.response.data && error.response.data.message) || 
                            (error.response && error.response.data) || 
                            "搜尋KOL失敗，請稍後再試";
        this.$bvToast.toast(errorMessage, {
          title: "搜尋失敗",
          variant: "danger",
          solid: true,
          autoHideDelay: 5000,
          toaster: 'b-toaster-top-right'
        });
      } finally {
        // Always clear loading state
        this.isSearchingKols = false;
      }
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
        toaster: 'b-toaster-top-right'
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
      // Store the current scroll position
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      // Call the original removeTag function from the component
      removeTagFunction(tag);

      // Use setTimeout to ensure the DOM has updated before setting scroll position
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto", // Use 'auto' instead of 'smooth' to prevent visible scrolling
        });
      }, 0);
    },
  },
};
</script>

<style>
/* Global Background */
body {
  background: linear-gradient(135deg, #e8eaed 0%, #dadce0 100%);
  min-height: 100vh;
}

/* Main Container Background */
.email-form-container {
  background: transparent;
  min-height: 100vh;
  padding: 10px;
}
/* Progress Bar Styles */
.progress-container {
  background: linear-gradient(135deg, #e8eaed 0%, #dadce0 100%);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(94, 114, 228, 0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  border: 3px solid #e9ecef;
}

.step-item.active .step-circle {
  background: #5e72e4;
  border-color: #5e72e4;
  color: white;
}

.step-item.completed .step-circle {
  background: #2dce89;
  border-color: #2dce89;
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-align: center;
}

.step-item.active .step-label,
.step-item.completed .step-label {
  color: #5e72e4;
}

.progress-bar-container {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #5e72e4, #2dce89);
  transition: width 0.3s ease;
  border-radius: 2px;
}

/* Step Section Styles */
.step-section {
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid rgba(94, 114, 228, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5e72e4, #2dce89);
  border-radius: 12px 12px 0 0;
}

.step-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  border-color: rgba(94, 114, 228, 0.2);
}

.step-title {
  color: #5e72e4;
  font-weight: 600;
  border-bottom: 2px solid rgba(94, 114, 228, 0.2);
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
  background: linear-gradient(90deg, #5e72e4, #2dce89);
  border-radius: 1px;
}

/* Form Input Styling */
.form-control, .custom-select, .modern-input, .modern-select {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(94, 114, 228, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus, .custom-select:focus, .modern-input:focus, .modern-select:focus {
  background: linear-gradient(135deg, #ffffff 0%, #f1f3f4 100%);
  border-color: #5e72e4;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25);
}

/* Button Styling */
.btn-primary {
  background: linear-gradient(135deg, #5e72e4 0%, #4c63d2 100%);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4c63d2 0%, #3b4db8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #2dce89 0%, #26a06a 100%);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: linear-gradient(135deg, #26a06a 0%, #1e7e56 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 206, 137, 0.3);
}

.btn-outline-secondary {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(108, 117, 125, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: rgba(108, 117, 125, 0.5);
  transform: translateY(-1px);
}

.b-form-tags-form {
  transition: none !important;
}

/* Button Styles */
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

/* Preview Modal Styles */
.preview-content {
  padding: 10px 0;
}

.preview-section {
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #5e72e4;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 15px;
}

.recipients-list {
  max-height: 200px;
  overflow-y: auto;
}

.recipient-item {
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

/* KOL Search Container */
.kol-search-container {
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 25px;
  border: 1px solid rgba(94, 114, 228, 0.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.kol-search-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #2dce89);
  border-radius: 15px 15px 0 0;
}

.search-header {
  text-align: center;
  margin-bottom: 25px;
}

.search-title {
  color: #5e72e4;
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
  color: #495057;
  margin-bottom: 8px;
  font-size: 14px;
}

.modern-input,
.modern-select {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.modern-input:focus,
.modern-select:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25);
  outline: none;
}

.tags-field {
  grid-column: span 1;
}

.modern-tags {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.search-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* Selected KOLs Container */
.selected-kols-container {
  background: linear-gradient(135deg, #e8eaed 0%, #f1f3f4 100%);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(45, 206, 137, 0.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.selected-kols-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2dce89, #5e72e4);
  border-radius: 15px 15px 0 0;
}

.selected-header {
  text-align: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 15px;
}

.selected-title {
  color: #2dce89;
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

.action-btn:hover {
  transform: translateY(-1px);
}

.selected-kols-display {
  margin-bottom: 25px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  color: #dee2e6;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
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
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
  border-radius: 10px;
  padding: 18px;
  border: 1px solid rgba(45, 206, 137, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.kol-item:hover {
  background: linear-gradient(135deg, #dadce0 0%, #e8eaed 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: rgba(45, 206, 137, 0.3);
}

.kol-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kol-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #5e72e4, #2dce89);
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
  color: #495057;
  font-size: 14px;
}

.kol-email {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

.remove-kol-btn {
  border-radius: 6px;
  padding: 6px 10px;
  transition: all 0.3s ease;
}

.remove-kol-btn:hover {
  transform: scale(1.1);
}

.add-kols-section {
  border-top: 2px solid #e9ecef;
  padding-top: 20px;
}

.add-title {
  color: #5e72e4;
  font-weight: 600;
  text-align: center;
}

.modern-kol-tags {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  padding: 8px;
}

/* CKEditor Styles */
.ck-editor__editable {
  min-height: 300px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: border-color 0.3s ease;
}

.ck-editor__editable:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25);
}

.ck-toolbar {
  border-radius: 8px 8px 0 0;
  border: 2px solid #e9ecef;
  border-bottom: none;
}

.ck-editor__main {
  border-radius: 0 0 8px 8px;
}

/* CKEditor Content Styles */
.ck-editor__editable p {
  margin: 1em 0;
}

.ck-editor__editable h1,
.ck-editor__editable h2,
.ck-editor__editable h3,
.ck-editor__editable h4,
.ck-editor__editable h5,
.ck-editor__editable h6 {
  margin: 1em 0 0.5em 0;
  font-weight: bold;
}

.ck-editor__editable ul,
.ck-editor__editable ol {
  margin: 1em 0;
  padding-left: 2em;
}

.ck-editor__editable blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #5e72e4;
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
  font-style: italic;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.ck-editor__editable table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.ck-editor__editable table td,
.ck-editor__editable table th {
  border: 1px solid #dee2e6;
  padding: 0.5em;
}

.ck-editor__editable table th {
  background: linear-gradient(135deg, #e8eaed 0%, #dadce0 100%);
  font-weight: bold;
}

/* Error Modal Styles */
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.error-icon i {
  color: white;
  font-size: 24px;
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
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.1);
}

.error-message p {
  color: #721c24;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
}

.error-confirm-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  border-radius: 10px;
  padding: 12px 30px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;
}

.error-confirm-btn:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

/* Modal Overlay Styling */
.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-header {
  border-bottom: none;
  padding: 0;
}

.modal-body {
  padding: 0;
}

/* Toast Styles */
.toast {
  min-width: 300px;
  max-width: 400px;
}

.toast-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.toast-body {
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #212529;
  font-size: 0.875rem;
  line-height: 1.4;
}

.toast.show {
  display: block !important;
}

/* Responsive Design */
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
  
  .ck-toolbar {
    flex-wrap: wrap;
  }
  
  .ck-toolbar__separator {
    display: none;
  }
}
</style>
