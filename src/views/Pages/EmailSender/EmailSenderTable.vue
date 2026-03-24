<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0" style="color: #202124; font-weight: 600;">Email Sender Management</h5>
      <b-button variant="primary" class="gcp-btn-primary" @click="openCreateModal">
        <i class="ni ni-fat-add mr-2"></i> Create
      </b-button>
    </div>

    <b-card class="gcp-card-surface p-0" no-body>
      <el-table class="gcp-table" :data="emailSenders" empty-text="No email senders found.">
        <el-table-column label="Name" min-width="200px" prop="name">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div class="gcp-avatar mr-3"><i class="ni ni-email-83"></i></div>
              <span class="font-weight-600">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Email" min-width="240px" prop="email">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <i class="ni ni-email-83 mr-2 text-muted"></i>
              <span>{{ row.email }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Rate Limit (Day)" min-width="120px" prop="rate_limit">
          <template v-slot="{ row }">
            <b-badge variant="info">{{ row.rate_limit }}</b-badge>
          </template>
        </el-table-column>

        <el-table-column label="Last Send At" min-width="180px" prop="last_send_at">
          <template v-slot="{ row }">
            <span v-if="row.last_send_at">{{ formatDate(row.last_send_at) }}</span>
            <span v-else class="text-muted">Never</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" min-width="120px" align="center">
          <template v-slot="{ row }">
            <b-button variant="outline-primary" size="sm" @click="openEditModal(row)">
              <i class="ni ni-settings mr-1"></i> Edit
            </b-button>
          </template>
        </el-table-column>
      </el-table>
    </b-card>

    <b-modal :id="modalId"
      :title="isEditMode ? 'Edit Email Sender' : 'Create Email Sender'"
      size="lg" centered @hidden="resetForm" @ok="handleModalOk" @cancel="handleModalCancel"
      :ok-disabled="isSubmitting || (isEditMode && !hasFormChanged)" :cancel-disabled="isSubmitting">
      <template #modal-ok>
        <b-spinner v-if="isSubmitting" small class="mr-2"></b-spinner>
        {{ isEditMode ? "Update" : "Create" }}
      </template>
      <template #modal-cancel>Cancel</template>

      <b-form @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-name" label="Name" label-for="input-name"
          :invalid-feedback="nameFeedback" :state="nameState">
          <b-form-input id="input-name" v-model="form.name" type="text" placeholder="Enter sender name"
            :state="nameState" required maxlength="50"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-email" label="Email" label-for="input-email"
          :invalid-feedback="emailFeedback" :state="emailState">
          <b-form-input id="input-email" v-model="form.email" type="email" placeholder="Enter email address"
            :state="emailState" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-key" label="Key" label-for="input-key"
          :invalid-feedback="keyFeedback" :state="keyState"
          :description="isEditMode ? 'Leave empty if you don\'t want to change the key' : 'API key or password for the email sender'">
          <b-form-input id="input-key" v-model="form.key" type="password"
            :placeholder="isEditMode ? 'Leave empty to keep current key' : 'Enter API key or password'"
            :state="keyState" :required="!isEditMode"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-rate-limit" label="Rate Limit" label-for="input-rate-limit"
          :invalid-feedback="rateLimitFeedback" :state="rateLimitState"
          description="Maximum number of emails per hour">
          <b-form-input id="input-rate-limit" v-model.number="form.rate_limit" type="number"
            placeholder="Enter rate limit" :state="rateLimitState" required min="1"></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";

export default {
  name: "email-sender-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      emailSenders: [],
      modalId: "email-sender-modal",
      isEditMode: false,
      isSubmitting: false,
      form: { id: null, name: "", email: "", key: "", rate_limit: 1 },
      originalForm: { name: "", email: "", key: "", rate_limit: 1 },
    };
  },
  computed: {
    hasFormChanged() {
      if (!this.isEditMode) return true;
      return this.form.name !== this.originalForm.name ||
        this.form.email !== this.originalForm.email ||
        this.form.rate_limit !== this.originalForm.rate_limit ||
        (this.form.key !== "" && this.form.key !== this.originalForm.key);
    },
    nameState() {
      if (!this.form.name) return null;
      return this.form.name.length <= 50;
    },
    nameFeedback() {
      if (!this.form.name) return "Name is required";
      if (this.form.name.length > 50) return "Name must be 50 characters or less";
      return "";
    },
    emailState() {
      if (!this.form.email) return null;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email);
    },
    emailFeedback() {
      if (!this.form.email) return "Email is required";
      if (!this.emailState) return "Please enter a valid email address";
      return "";
    },
    keyState() {
      if (this.isEditMode && this.form.key === "" && this.originalForm.key === "") return null;
      if (!this.form.key) return null;
      return this.form.key.length > 0;
    },
    keyFeedback() {
      if (this.isEditMode && this.form.key === "" && this.originalForm.key === "") return "";
      if (!this.form.key) return "Key is required";
      return "";
    },
    rateLimitState() {
      if (!this.form.rate_limit) return null;
      return this.form.rate_limit >= 1;
    },
    rateLimitFeedback() {
      if (!this.form.rate_limit) return "Rate limit is required";
      if (this.form.rate_limit < 1) return "Rate limit must be at least 1";
      return "";
    },
  },
  mounted() {
    this.listEmailSenders();
  },
  methods: {
    listEmailSenders() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/email_senders";
      const config = {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
      };
      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.emailSenders = response.data.email_senders || [];
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) return;
          this.$bvToast.toast("Failed to load email senders", { title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        });
    },
    openCreateModal() {
      this.isEditMode = false;
      this.resetForm();
      this.$bvModal.show(this.modalId);
    },
    async openEditModal(sender) {
      this.isEditMode = true;
      this.form.id = sender.id;
      this.form.name = sender.name;
      this.form.email = sender.email;
      this.form.rate_limit = sender.rate_limit;
      this.form.key = "";
      try {
        const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_senders/${sender.id}`;
        const config = { headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } };
        const response = await this.axios.get(url, config);
        if (response.status === 200 && response.data) {
          this.form.name = response.data.name || sender.name;
          this.form.email = response.data.email || sender.email;
          this.form.rate_limit = response.data.rate_limit || sender.rate_limit;
        }
      } catch (_) { /* continue with existing data */ }
      this.originalForm = { name: this.form.name, email: this.form.email, key: this.form.key, rate_limit: this.form.rate_limit };
      this.$bvModal.show(this.modalId);
    },
    resetForm() {
      this.form = { id: null, name: "", email: "", key: "", rate_limit: 1 };
      this.originalForm = { name: "", email: "", key: "", rate_limit: 1 };
      this.isEditMode = false;
    },
    validateForm() {
      if (!this.form.name || this.form.name.length > 50) return false;
      if (!this.form.email || !this.emailState) return false;
      if (!this.isEditMode && !this.form.key) return false;
      if (!this.form.rate_limit || this.form.rate_limit < 1) return false;
      return true;
    },
    handleModalOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.handleSubmit();
    },
    handleModalCancel() {
      this.resetForm();
    },
    handleSubmit(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      if (!this.validateForm()) {
        this.$bvToast.toast("Please fill in all required fields correctly", { title: "Validation Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        return false;
      }
      this.onSubmit();
      return true;
    },
    onSubmit() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      const url = this.isEditMode
        ? `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_senders/${this.form.id}`
        : `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_senders`;
      let requestBody;
      if (this.isEditMode) {
        requestBody = {};
        if (this.form.name !== this.originalForm.name) requestBody.name = this.form.name;
        if (this.form.email !== this.originalForm.email) requestBody.email = this.form.email;
        if (this.form.rate_limit !== this.originalForm.rate_limit) requestBody.rate_limit = this.form.rate_limit;
        if (this.form.key !== "" && this.form.key !== this.originalForm.key) requestBody.key = this.form.key;
      } else {
        requestBody = { name: this.form.name, email: this.form.email, key: this.form.key, rate_limit: this.form.rate_limit };
      }
      const config = { headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } };
      const request = this.isEditMode ? this.axios.put(url, requestBody, config) : this.axios.post(url, requestBody, config);
      request
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            this.$bvToast.toast(`Email sender ${this.isEditMode ? "updated" : "created"} successfully`, { title: "Success", variant: "success", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
            this.$nextTick(() => {
              this.$bvModal.hide(this.modalId);
              this.resetForm();
              this.listEmailSenders();
            });
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) return;
          let errorMessage = "Failed to save email sender";
          if (error.response && error.response.data) {
            if (typeof error.response.data === "string") errorMessage = error.response.data;
            else if (error.response.data.message) errorMessage = error.response.data.message;
            else if (error.response.data.error) errorMessage = error.response.data.error;
          }
          this.$bvToast.toast(errorMessage, { title: "Error", variant: "danger", solid: true, autoHideDelay: 5000, toaster: "b-toaster-top-right" });
        })
        .finally(() => { this.isSubmitting = false; });
    },
    formatDate(dateString) {
      if (!dateString) return "Never";
      try { return new Date(dateString).toLocaleString(); } catch (_) { return dateString; }
    },
  },
};
</script>

<style scoped>
.gcp-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; background-color: #1a73e8; }
</style>
