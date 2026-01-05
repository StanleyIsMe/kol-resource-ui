<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <!-- Search Section -->
      <b-card class="search-card mb-4">
        <b-form @submit.prevent="listEmailJobs">
          <div class="pl-lg-4">
            <b-row>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Sender Email"
                  placeholder="Search by sender email"
                  v-model="searchParams.sender_email"
                  addon-left-icon="ni ni-email-83"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Sender Name"
                  placeholder="Search by sender name"
                  v-model="searchParams.sender_name"
                  addon-left-icon="ni ni-single-02"
                >
                </base-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Product Name"
                  placeholder="Search by product name"
                  v-model="searchParams.product_name"
                  addon-left-icon="ni ni-box-2"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input label="Status" addon-left-icon="ni ni-badge">
                  <select class="form-control" v-model="searchParams.status">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="success">Success</option>
                    <option value="partially_success">Partially Success</option>
                    <option value="failed">Failed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </base-input>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col cols="12" class="text-left">
                <b-button
                  type="submit"
                  variant="primary"
                  class="email-job-search-btn"
                >
                  <i class="ni ni-zoom-split-in mr-2"></i> Search
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-form>
      </b-card>
    </b-card-header>

    <!-- Email Jobs Results Section -->
    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="emailJobs"
      :current-page="currentPage"
      empty-text="No email jobs found. Try broadening your search criteria."
    >
      <!-- Status -->
      <el-table-column label="Status" min-width="120px" prop="status">
        <template v-slot="{ row }">
          <b-badge :variant="getStatusVariant(row.status)" class="text-uppercase status-badge-large">
            {{ formatStatus(row.status) }}
          </b-badge>
        </template>
      </el-table-column>

      <!-- Sender -->
      <el-table-column label="Sender" min-width="200px">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-send mr-2 text-primary"></i>
            <span>{{ row.sender_name }} ({{ row.sender_email }})</span>
          </div>
        </template>
      </el-table-column>

      <!-- Admin -->
      <el-table-column label="Admin" min-width="150px" prop="admin_name">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-single-02 mr-2 text-primary"></i>
            <span>{{ row.admin_name || 'N/A' }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Product -->
      <el-table-column label="Product" min-width="150px" prop="product_name">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-box-2 mr-2 text-primary"></i>
            <span>{{ row.product_name || 'N/A' }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Counts -->
      <el-table-column label="Counts" min-width="150px">
        <template v-slot="{ row }">
          <div>
            <span class="text-muted">Expected: </span>
            <span class="font-weight-600">{{ row.expected_reciver_count }}</span>
            <br />
            <span class="text-muted">Success: </span>
            <span class="font-weight-600 text-success">{{ row.success_count }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Last Execute -->
      <el-table-column label="Last Execute" min-width="180px">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-watch-time mr-2 text-primary"></i>
            <span>{{ formatDate(row.last_execute_at) }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Memo -->
      <el-table-column label="Memo" min-width="150px" prop="memo">
        <template v-slot="{ row }">
          <span v-if="row.memo" class="text-truncate d-inline-block" style="max-width: 150px;" :title="row.memo">
            {{ row.memo }}
          </span>
        </template>
      </el-table-column>

      <!-- Actions -->
      <el-table-column label="Actions" min-width="180px" align="center">
        <template v-slot="{ row }">
          <div class="btn-group">
            <b-button
              v-if="canStart(row.status)"
              variant="success"
              size="sm"
              @click="startEmailJob(row)"
              class="mr-2"
            >
              <i class="ni ni-button-play mr-1"></i> Start
            </b-button>
            <b-button
              v-if="canCancel(row.status)"
              variant="warning"
              size="sm"
              @click="cancelEmailJob(row)"
              class="mr-2"
            >
              <i class="ni ni-button-power mr-1"></i> Cancel
            </b-button>
            <b-button
              variant="info"
              size="sm"
              @click="viewEmailJob(row)"
            >
              <i class="ni ni-zoom-split-in mr-1"></i> View
            </b-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <b-card-footer
      class="py-4 d-flex justify-content-between align-items-center"
    >
      <span class="text-muted">Showing page {{ currentPage }}</span>
      <b-pagination
        v-model="currentPage"
        :per-page="per_page"
        :total-rows="total"
        @change="onPageChange"
        size="md"
        class="mb-0"
      ></b-pagination>
    </b-card-footer>

    <!-- Detail Modal -->
    <email-job-detail-modal
      :show="showDetailModal"
      :job-id="selectedJobId"
      @close="closeDetailModal"
    ></email-job-detail-modal>
  </b-card>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import EmailJobDetailModal from "./EmailJobDetailModal.vue";

export default {
  name: "email-job-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    EmailJobDetailModal,
  },
  data() {
    return {
      emailJobs: [],
      currentPage: 1,
      per_page: 10,
      total: 0,
      searchParams: {
        sender_email: "",
        sender_name: "",
        product_name: "",
        status: "",
        page_index: 1,
        page_size: 10,
      },
      showDetailModal: false,
      selectedJobId: null,
    };
  },
  mounted() {
    this.listEmailJobs();
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page;
      this.searchParams.page_index = page;
      this.listEmailJobs();
    },
    listEmailJobs() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/email_jobs";

      this.searchParams.page_index = this.currentPage;

      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          page_index: this.searchParams.page_index,
          page_size: this.searchParams.page_size,
        },
      };

      if (this.searchParams.sender_email != "") {
        config.params.sender_email = this.searchParams.sender_email;
      }

      if (this.searchParams.sender_name != "") {
        config.params.sender_name = this.searchParams.sender_name;
      }

      if (this.searchParams.product_name != "") {
        config.params.product_name = this.searchParams.product_name;
      }

      if (this.searchParams.status != "") {
        config.params.status = this.searchParams.status;
      }

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.emailJobs = response.data.email_jobs || [];
            this.total = response.data.total || 0;
          }
        })
        .catch((error) => {
          console.error("Error:", error);

          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          this.$bvToast.toast("Failed to load email jobs", {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 3000,
          });
        });
    },
    canStart(status) {
      return status === "canceled";
    },
    canCancel(status) {
      return status === "pending" || status === "processing";
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
    startEmailJob(job) {
      if (!confirm(`Are you sure you want to start email job #${job.id}?`)) {
        return;
      }

      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_jobs/${job.id}/start`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .put(url, {}, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(`Email job #${job.id} started successfully`, {
              title: "Success",
              variant: "success",
              solid: true,
              autoHideDelay: 3000,
            });
            this.listEmailJobs();
          }
        })
        .catch((error) => {
          console.error("Error starting email job:", error);

          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          const errorMessage =
            (error.response && error.response.data && error.response.data.error) || "Failed to start email job";
          this.$bvToast.toast(errorMessage, {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 3000,
          });
        });
    },
    cancelEmailJob(job) {
      if (!confirm(`Are you sure you want to cancel email job #${job.id}?`)) {
        return;
      }

      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_jobs/${job.id}/cancel`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .put(url, {}, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(`Email job #${job.id} canceled successfully`, {
              title: "Success",
              variant: "success",
              solid: true,
              autoHideDelay: 3000,
            });
            this.listEmailJobs();
          }
        })
        .catch((error) => {
          console.error("Error canceling email job:", error);

          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "login" });
            return;
          }

          const errorMessage =
            (error.response && error.response.data && error.response.data.error) || "Failed to cancel email job";
          this.$bvToast.toast(errorMessage, {
            title: "Error",
            variant: "danger",
            solid: true,
            autoHideDelay: 3000,
          });
        });
    },
    viewEmailJob(job) {
      this.selectedJobId = job.id;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedJobId = null;
      // Optionally refresh the list after viewing details
      // this.listEmailJobs();
    },
  },
  watch: {
    currentPage(newVal) {
      this.searchParams.page_index = newVal;
      this.listEmailJobs();
    },
  },
};
</script>

<style>
/* Card styling */
.search-card {
  background-color: #27293d !important;
  border: none !important;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.15) !important;
  border-left: 4px solid #5e72e4 !important;
}

/* Button styling */
.email-job-search-btn {
  height: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
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

/* Pagination styling */
.page-item.active .page-link {
  background-color: #5e72e4;
  border-color: #5e72e4;
}

.page-link {
  color: #5e72e4;
  background-color: #fff;
}

.page-link:hover {
  color: #233dd2;
}
</style>

