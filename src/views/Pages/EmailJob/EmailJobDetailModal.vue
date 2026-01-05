<template>
  <b-modal
    v-model="modalShow"
    @hide="handleClose"
    title="Email Job Details"
    size="xl"
    class="email-job-detail-modal"
  >
    <div v-if="loading" class="text-center py-4">
      <b-spinner variant="primary"></b-spinner>
      <p class="mt-2">Loading...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="emailJob">
      <!-- Job Information -->
      <b-card class="mb-4 job-info-card">
        <b-row>
          <b-col md="6">
            <div class="info-item mb-2">
              <strong>Job ID:</strong> {{ emailJob.id }}
            </div>
            <div class="info-item mb-2">
              <strong>Status:</strong>
              <b-badge :variant="getStatusVariant(emailJob.status)" class="ml-2 status-badge-large">
                {{ formatStatus(emailJob.status) }}
              </b-badge>
            </div>
            <div class="info-item mb-2">
              <strong>Sender:</strong> {{ emailJob.sender_name }} ({{ emailJob.sender_email }})
            </div>
            <div class="info-item mb-2">
              <strong>Admin:</strong> {{ emailJob.admin_name || 'N/A' }}
            </div>
          </b-col>
          <b-col md="6">
            <div class="info-item mb-2">
              <strong>Product:</strong> {{ emailJob.product_name || 'N/A' }}
            </div>
            <div class="info-item mb-2">
              <strong>Expected Count:</strong> {{ emailJob.expected_reciver_count }}
            </div>
            <div class="info-item mb-2">
              <strong>Success Count:</strong> {{ emailJob.success_count }}
            </div>
            <div class="info-item mb-2">
              <strong>Memo:</strong> {{ emailJob.memo || 'N/A' }}
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="6">
            <div class="info-item">
              <strong>Created At:</strong> {{ formatDate(emailJob.created_at) }}
            </div>
          </b-col>
          <b-col md="6">
            <div class="info-item">
              <strong>Last Execute At:</strong> {{ formatDate(emailJob.last_execute_at) }}
            </div>
          </b-col>
        </b-row>
      </b-card>

      <!-- Email Logs -->
      <b-card class="email-logs-card">
        <h5 class="mb-3">Email Logs ({{ emailLogs.length }})</h5>
        <el-table
          class="table-responsive table table-dark"
          header-row-class-name="thead-dark"
          :data="emailLogs"
          empty-text="No email logs found."
          max-height="400"
        >
          <!-- Email -->
          <el-table-column label="Email" min-width="200px" prop="email">
            <template v-slot="{ row }">
              <div class="d-flex align-items-center">
                <i class="ni ni-email-83 mr-2 text-primary"></i>
                <span>{{ row.email }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- KOL Name -->
          <el-table-column label="KOL Name" min-width="150px" prop="kol_name">
            <template v-slot="{ row }">
              <span>{{ row.kol_name || 'N/A' }}</span>
            </template>
          </el-table-column>

          <!-- Status -->
          <el-table-column label="Status" min-width="120px" prop="status">
            <template v-slot="{ row }">
              <b-badge :variant="getLogStatusVariant(row.status)" class="text-uppercase status-badge-large">
                {{ formatStatus(row.status) }}
              </b-badge>
            </template>
          </el-table-column>

          <!-- Reply -->
          <el-table-column label="Reply" min-width="80px" prop="reply" align="center">
            <template v-slot="{ row }">
              <b-badge :variant="row.reply ? 'success' : 'secondary'">
                {{ row.reply ? 'Yes' : 'No' }}
              </b-badge>
            </template>
          </el-table-column>

          <!-- Sent At -->
          <el-table-column label="Sent At" min-width="150px">
            <template v-slot="{ row }">
              <span>{{ formatDate(row.sended_at) }}</span>
            </template>
          </el-table-column>

          <!-- Memo -->
          <el-table-column label="Memo" min-width="150px" prop="memo">
            <template v-slot="{ row }">
              <span v-if="row.memo">{{ row.memo }}</span>
            </template>
          </el-table-column>
        </el-table>
      </b-card>
    </div>

    <template #modal-footer>
      <b-button variant="secondary" @click="handleClose">Close</b-button>
    </template>
  </b-modal>
</template>

<script>
import { Table, TableColumn } from "element-ui";

export default {
  name: "email-job-detail-modal",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    jobId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      emailJob: null,
      emailLogs: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    modalShow: {
      get() {
        return this.show;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  watch: {
    show(newVal) {
      if (newVal && this.jobId) {
        this.fetchEmailJobDetails();
      }
    },
  },
  methods: {
    fetchEmailJobDetails() {
      if (!this.jobId) {
        this.error = "No job ID provided";
        return;
      }

      // Prevent duplicate API calls
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.error = null;
      this.emailJob = null;
      this.emailLogs = [];

      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_jobs/${this.jobId}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.emailJob = response.data.email_job;
            this.emailLogs = response.data.email_logs || [];
          }
        })
        .catch((error) => {
          console.error("Error fetching email job details:", error);

          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          this.error =
            (error.response && error.response.data && error.response.data.error) || "Failed to load email job details";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleClose() {
      this.$emit("close");
    },
    getStatusVariant(status) {
      const variantMap = {
        pending: "warning",
        processing: "info",
        success: "success",
        partially_success: "warning",
        failed: "danger",
        canceled: "secondary",
      };
      return variantMap[status] || "secondary";
    },
    getLogStatusVariant(status) {
      const variantMap = {
        pending: "warning",
        success: "success",
        failed: "danger",
        canceled: "secondary",
      };
      return variantMap[status] || "secondary";
    },
    formatStatus(status) {
      return status.replace("_", " ").toUpperCase();
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.job-info-card {
  background-color: #27293d !important;
  border: none !important;
  color: #fff;
}

.info-item {
  color: #fff;
}

.email-logs-card {
  background-color: #27293d !important;
  border: none !important;
  color: #fff;
}

.email-job-detail-modal ::v-deep .modal-content {
  background-color: #1a1d29;
  color: #fff;
}

.email-job-detail-modal ::v-deep .modal-header {
  border-bottom: 1px solid #34495e;
  background-color: #1a1d29;
}

.email-job-detail-modal ::v-deep .modal-header .modal-title {
  color: #fff;
}

.email-job-detail-modal ::v-deep .modal-body {
  background-color: #1a1d29;
}

.email-job-detail-modal ::v-deep .modal-footer {
  border-top: 1px solid #34495e;
  background-color: #1a1d29;
}

/* Status badge styling for better visibility */
.status-badge-large {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  padding: 8px 12px !important;
  letter-spacing: 0.5px !important;
}

/* Enhanced badge colors for dark background */
.status-badge-large.badge-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
  border: 1px solid #ffb300 !important;
}

.status-badge-large.badge-info {
  background-color: #17a2b8 !important;
  color: #fff !important;
  border: 1px solid #138496 !important;
}

.status-badge-large.badge-success {
  background-color: #28a745 !important;
  color: #fff !important;
  border: 1px solid #1e7e34 !important;
}

.status-badge-large.badge-danger {
  background-color: #dc3545 !important;
  color: #fff !important;
  border: 1px solid #c82333 !important;
}

.status-badge-large.badge-secondary {
  background-color: #6c757d !important;
  color: #fff !important;
  border: 1px solid #5a6268 !important;
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

/* Empty state styling */
.el-table__empty-block {
  background-color: #172b4d !important;
}

.el-table__empty-text {
  color: #8898aa !important;
}
</style>

