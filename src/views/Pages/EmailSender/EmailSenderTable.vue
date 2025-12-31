<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0 text-white">Email Sender Management</h3>
        <b-button
          variant="success"
          class="sender-create-btn"
          @click="openCreateModal"
        >
          <i class="ni ni-fat-add mr-2"></i> Create
        </b-button>
      </div>
    </b-card-header>

    <!-- Email Sender Results Section -->
    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="emailSenders"
      empty-text="No email senders found."
    >
      <!-- Name -->
      <el-table-column label="Name" min-width="200px" prop="name">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-sm rounded-circle bg-primary mr-3">
              <i class="ni ni-email-83 text-white"></i>
            </div>
            <span class="font-weight-600 name mb-0">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Email -->
      <el-table-column label="Email" min-width="240px" prop="email">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-email-83 mr-2 text-primary"></i>
            <span>{{ row.email }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Rate Limit -->
      <el-table-column label="Rate Limit" min-width="120px" prop="rate_limit">
        <template v-slot="{ row }">
          <b-badge variant="info" class="text-uppercase">
            {{ row.rate_limit }} / hour
          </b-badge>
        </template>
      </el-table-column>

      <!-- Last Send At -->
      <el-table-column label="Last Send At" min-width="180px" prop="last_send_at">
        <template v-slot="{ row }">
          <span v-if="row.last_send_at">
            {{ formatDate(row.last_send_at) }}
          </span>
          <span v-else class="text-muted">Never</span>
        </template>
      </el-table-column>

      <!-- Actions -->
      <el-table-column label="Actions" min-width="120px" align="center">
        <template v-slot="{ row }">
          <b-button
            variant="info"
            size="sm"
            @click="openEditModal(row)"
            class="mr-2"
          >
            <i class="ni ni-settings mr-1"></i> Edit
          </b-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create/Edit Modal -->
    <b-modal
      :id="modalId"
      :title="isEditMode ? 'Edit Email Sender' : 'Create Email Sender'"
      size="lg"
      centered
      @hidden="resetForm"
    >
      <b-form @submit.stop.prevent="handleSubmit">
        <b-form-group
          id="input-group-name"
          label="Name"
          label-for="input-name"
          :invalid-feedback="nameFeedback"
          :state="nameState"
        >
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            placeholder="Enter sender name"
            :state="nameState"
            required
            maxlength="50"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-email"
          label="Email"
          label-for="input-email"
          :invalid-feedback="emailFeedback"
          :state="emailState"
        >
          <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            :state="emailState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-key"
          label="Key"
          label-for="input-key"
          :invalid-feedback="keyFeedback"
          :state="keyState"
          description="API key or password for the email sender"
        >
          <b-form-input
            id="input-key"
            v-model="form.key"
            type="password"
            placeholder="Enter API key or password"
            :state="keyState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-rate-limit"
          label="Rate Limit"
          label-for="input-rate-limit"
          :invalid-feedback="rateLimitFeedback"
          :state="rateLimitState"
          description="Maximum number of emails per hour"
        >
          <b-form-input
            id="input-rate-limit"
            v-model.number="form.rate_limit"
            type="number"
            placeholder="Enter rate limit"
            :state="rateLimitState"
            required
            min="1"
          ></b-form-input>
        </b-form-group>
      </b-form>

      <template #modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">Cancel</b-button>
        <b-button
          variant="primary"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          <b-spinner v-if="isSubmitting" small class="mr-2"></b-spinner>
          {{ isEditMode ? "Update" : "Create" }}
        </b-button>
      </template>
    </b-modal>
  </b-card>
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
      form: {
        id: null,
        name: "",
        email: "",
        key: "",
        rate_limit: 1,
      },
    };
  },
  computed: {
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.form.email);
    },
    emailFeedback() {
      if (!this.form.email) return "Email is required";
      if (!this.emailState) return "Please enter a valid email address";
      return "";
    },
    keyState() {
      if (!this.form.key) return null;
      return this.form.key.length > 0;
    },
    keyFeedback() {
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
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.emailSenders = response.data.email_senders || [];
          }
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);

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
      
      // Fetch full details including key (if API supports it)
      // For now, we'll leave key empty and user needs to re-enter it
      this.form.key = "";

      // Try to get full details from API
      try {
        const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_senders/${sender.id}`;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };

        const response = await this.axios.get(url, config);
        if (response.status === 200 && response.data) {
          // API might not return key for security, so we keep it empty
          this.form.name = response.data.name || sender.name;
          this.form.email = response.data.email || sender.email;
          this.form.rate_limit = response.data.rate_limit || sender.rate_limit;
        }
      } catch (error) {
        console.error("Error fetching sender details:", error);
        // Continue with existing data
      }

      this.$bvModal.show(this.modalId);
    },
    resetForm() {
      this.form = {
        id: null,
        name: "",
        email: "",
        key: "",
        rate_limit: 1,
      };
      this.isEditMode = false;
    },
    validateForm() {
      if (!this.form.name || this.form.name.length > 50) {
        return false;
      }
      if (!this.form.email || !this.emailState) {
        return false;
      }
      if (!this.form.key) {
        return false;
      }
      if (!this.form.rate_limit || this.form.rate_limit < 1) {
        return false;
      }
      return true;
    },
    handleSubmit() {
      if (!this.validateForm()) {
        this.$bvToast.toast("Please fill in all required fields correctly", {
          title: "Validation Error",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
          toaster: "b-toaster-top-right",
        });
        return;
      }

      this.onSubmit();
    },
    onSubmit() {
      if (this.isSubmitting) return;

      this.isSubmitting = true;

      const url = this.isEditMode
        ? `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_senders/${this.form.id}`
        : `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_senders`;

      const requestBody = {
        name: this.form.name,
        email: this.form.email,
        key: this.form.key,
        rate_limit: this.form.rate_limit,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      const request = this.isEditMode
        ? this.axios.put(url, requestBody, config)
        : this.axios.post(url, requestBody, config);

      request
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            this.$bvToast.toast(
              `Email sender ${this.isEditMode ? "updated" : "created"} successfully`,
              {
                title: "Success",
                variant: "success",
                solid: true,
                autoHideDelay: 3000,
                toaster: "b-toaster-top-right",
              }
            );

            this.$bvModal.hide(this.modalId);
            this.resetForm();
            this.listEmailSenders();
          }
        })
        .catch((error) => {
          console.error("Error:", error);

          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          let errorMessage = "Failed to save email sender";
          if (error.response && error.response.data) {
            if (typeof error.response.data === "string") {
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            }
          }

          this.$bvToast.toast(errorMessage, {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 5000,
            toaster: "b-toaster-top-right",
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    formatDate(dateString) {
      if (!dateString) return "Never";
      try {
        const date = new Date(dateString);
        return date.toLocaleString();
      } catch (e) {
        return dateString;
      }
    },
  },
};
</script>

<style>
/* Card styling */
.sender-create-btn {
  height: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
  background-color: #2dce89 !important;
  border-color: #2dce89 !important;
}

/* Table styling */
.el-table.table-dark {
  background-color: #172b4d;
  color: #fff;
}

.el-table.table-dark th {
  background-color: #1a3164 !important;
  color: #fff !important;
  font-weight: 600;
  border-bottom: 2px solid #34495e !important;
}

.el-table.table-dark td {
  border-bottom: 1px solid #34495e !important;
  padding: 12px 8px !important;
}

/* Override el-table hover behavior */
.el-table.table-dark .el-table__body tr:hover > td,
.el-table.table-dark .el-table__body tr:hover {
  background-color: #1a3365 !important;
  color: #fff !important;
}

.el-table.table-dark .el-table__body tr:hover .text-sm,
.el-table.table-dark .el-table__body tr:hover .font-weight-600,
.el-table.table-dark .el-table__body tr:hover .name {
  color: #fff !important;
}

/* Empty state styling */
.el-table__empty-block {
  background-color: #172b4d !important;
}

.el-table__empty-text {
  color: #8898aa !important;
}

/* Modal styling */
.modal-content {
  background-color: #27293d;
  color: #fff;
}

.modal-header {
  border-bottom: 1px solid #34495e;
}

.modal-body {
  color: #fff;
}

.modal-footer {
  border-top: 1px solid #34495e;
}

.form-group label {
  color: #fff;
}

.form-control {
  background-color: #1a3164;
  border-color: #34495e;
  color: #fff;
}

.form-control:focus {
  background-color: #1a3164;
  border-color: #5e72e4;
  color: #fff;
}

.form-control::placeholder {
  color: #8898aa;
}

.text-muted {
  color: #8898aa !important;
}
</style>

