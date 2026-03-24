<template>
  <div>
    <b-card class="gcp-search-panel mb-4">
      <b-form @submit.prevent="listEmailJobs">
        <b-row>
          <b-col lg="6">
            <base-input type="text" label="Sender Email" placeholder="Search by sender email"
              v-model="searchParams.sender_email" addon-left-icon="ni ni-email-83"></base-input>
          </b-col>
          <b-col lg="6">
            <base-input type="text" label="Sender Name" placeholder="Search by sender name"
              v-model="searchParams.sender_name" addon-left-icon="ni ni-single-02"></base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <base-input type="text" label="Product Name" placeholder="Search by product name"
              v-model="searchParams.product_name" addon-left-icon="ni ni-box-2"></base-input>
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
          <b-col cols="12">
            <b-button type="submit" variant="primary" class="gcp-btn">
              <i class="ni ni-zoom-split-in mr-2"></i> Search
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <b-card class="gcp-card-surface p-0" no-body>
      <el-table class="gcp-table" :data="emailJobs" :current-page="currentPage"
        empty-text="No email jobs found. Try broadening your search criteria.">
        <el-table-column label="Status" min-width="120px" prop="status">
          <template v-slot="{ row }">
            <b-badge :variant="getStatusVariant(row.status)" class="text-uppercase">
              {{ formatStatus(row.status) }}
            </b-badge>
          </template>
        </el-table-column>

        <el-table-column label="Sender" min-width="200px">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <i class="ni ni-send mr-2 text-muted"></i>
              <span>{{ row.sender_name }} ({{ row.sender_email }})</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Admin" min-width="150px" prop="admin_name">
          <template v-slot="{ row }">
            <span>{{ row.admin_name || 'N/A' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Product" min-width="150px" prop="product_name">
          <template v-slot="{ row }">
            <span>{{ row.product_name || 'N/A' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Counts" min-width="150px">
          <template v-slot="{ row }">
            <div>
              <span class="text-muted">Expected: </span><span class="font-weight-600">{{ row.expected_reciver_count }}</span>
              <br>
              <span class="text-muted">Success: </span><span class="font-weight-600" style="color:#1e8e3e;">{{ row.success_count }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Last Execute" min-width="180px">
          <template v-slot="{ row }">
            <span>{{ formatDate(row.last_execute_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Memo" min-width="150px" prop="memo">
          <template v-slot="{ row }">
            <span v-if="row.memo" class="text-truncate d-inline-block" style="max-width: 150px;" :title="row.memo">{{ row.memo }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" min-width="180px" align="center">
          <template v-slot="{ row }">
            <div class="btn-group">
              <b-button v-if="canStart(row.status)" variant="outline-success" size="sm" @click="startEmailJob(row)" class="mr-1">
                <i class="ni ni-button-play mr-1"></i> Start
              </b-button>
              <b-button v-if="canCancel(row.status)" variant="outline-warning" size="sm" @click="cancelEmailJob(row)" class="mr-1">
                <i class="ni ni-button-power mr-1"></i> Cancel
              </b-button>
              <b-button variant="outline-primary" size="sm" @click="viewEmailJob(row)">
                <i class="ni ni-zoom-split-in mr-1"></i> View
              </b-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <b-card-footer class="d-flex justify-content-between align-items-center" style="background:#fff;border-top:1px solid #dadce0;">
        <span class="text-muted">Page {{ currentPage }}</span>
        <b-pagination v-model="currentPage" :per-page="per_page" :total-rows="total"
          @change="onPageChange" size="md" class="mb-0"></b-pagination>
      </b-card-footer>
    </b-card>

    <email-job-detail-modal :show="showDetailModal" :job-id="selectedJobId" @close="closeDetailModal"></email-job-detail-modal>
  </div>
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
      searchParams: { sender_email: "", sender_name: "", product_name: "", status: "", page_index: 1, page_size: 10 },
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
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
        params: { page_index: this.searchParams.page_index, page_size: this.searchParams.page_size },
      };
      if (this.searchParams.sender_email) config.params.sender_email = this.searchParams.sender_email;
      if (this.searchParams.sender_name) config.params.sender_name = this.searchParams.sender_name;
      if (this.searchParams.product_name) config.params.product_name = this.searchParams.product_name;
      if (this.searchParams.status) config.params.status = this.searchParams.status;

      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.emailJobs = response.data.email_jobs || [];
            this.total = response.data.total || 0;
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) return;
          this.$bvToast.toast("Failed to load email jobs", { title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        });
    },
    canStart(status) { return status === "canceled"; },
    canCancel(status) { return status === "pending" || status === "processing"; },
    getStatusVariant(status) {
      const map = { pending: "warning", processing: "info", success: "success", partially_success: "warning", failed: "danger", canceled: "secondary" };
      return map[status] || "secondary";
    },
    formatStatus(status) { return (status || '').replace("_", " ").toUpperCase(); },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    },
    async startEmailJob(job) {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        `Are you sure you want to start email job #${job.id}?`,
        { title: "Confirm Start", okVariant: "success", okTitle: "Start", cancelTitle: "Cancel", centered: true }
      );
      if (!confirmed) return;
      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_jobs/${job.id}/start`;
      const config = { headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } };
      this.axios.put(url, {}, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(`Email job #${job.id} started successfully`, { title: "Success", variant: "success", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
            this.listEmailJobs();
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) return;
          const msg = (error.response && error.response.data && error.response.data.error) || "Failed to start email job";
          this.$bvToast.toast(msg, { title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        });
    },
    async cancelEmailJob(job) {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        `Are you sure you want to cancel email job #${job.id}?`,
        { title: "Confirm Cancel", okVariant: "danger", okTitle: "Cancel Job", cancelTitle: "Go Back", centered: true }
      );
      if (!confirmed) return;
      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_jobs/${job.id}/cancel`;
      const config = { headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } };
      this.axios.put(url, {}, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(`Email job #${job.id} canceled successfully`, { title: "Success", variant: "success", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
            this.listEmailJobs();
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) return;
          const msg = (error.response && error.response.data && error.response.data.error) || "Failed to cancel email job";
          this.$bvToast.toast(msg, { title: "Error", variant: "danger", solid: true, autoHideDelay: 3000, toaster: "b-toaster-top-right" });
        });
    },
    viewEmailJob(job) { this.selectedJobId = job.id; this.showDetailModal = true; },
    closeDetailModal() { this.showDetailModal = false; this.selectedJobId = null; },
  },
  watch: {
    currentPage(newVal) { this.searchParams.page_index = newVal; this.listEmailJobs(); },
  },
};
</script>

<style scoped>
.gcp-btn { height: 42px; font-weight: 500; font-size: 0.875rem; }
</style>
