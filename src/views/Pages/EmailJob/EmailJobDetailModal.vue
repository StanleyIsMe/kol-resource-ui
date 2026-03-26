<template>
  <b-modal v-model="modalShow" @hide="handleClose" title="Email Job Details" size="xl">
    <div v-if="loading" class="text-center py-4">
      <b-spinner variant="primary"></b-spinner>
      <p class="mt-2 text-muted">Loading...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="emailJob">
      <b-card class="gcp-card-surface mb-4">
        <b-row>
          <b-col md="6">
            <div class="info-item mb-2"><strong>Job ID:</strong> {{ emailJob.id }}</div>
            <div class="info-item mb-2">
              <strong>Status:</strong>
              <b-badge :variant="getStatusVariant(emailJob.status)" class="ml-2">{{ formatStatus(emailJob.status) }}</b-badge>
            </div>
            <div class="info-item mb-2"><strong>Sender:</strong> {{ emailJob.sender_name }} ({{ emailJob.sender_email }})</div>
            <div class="info-item mb-2"><strong>Admin:</strong> {{ emailJob.admin_name || 'N/A' }}</div>
          </b-col>
          <b-col md="6">
            <div class="info-item mb-2"><strong>Product:</strong> {{ emailJob.product_name || 'N/A' }}</div>
            <div class="info-item mb-2"><strong>Expected Count:</strong> {{ emailJob.expected_reciver_count }}</div>
            <div class="info-item mb-2"><strong>Success Count:</strong> {{ emailJob.success_count }}</div>
            <div class="info-item mb-2"><strong>Memo:</strong> {{ emailJob.memo || 'N/A' }}</div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="6"><div class="info-item"><strong>Created At:</strong> {{ formatDate(emailJob.created_at) }}</div></b-col>
          <b-col md="6"><div class="info-item"><strong>Last Execute At:</strong> {{ formatDate(emailJob.last_execute_at) }}</div></b-col>
        </b-row>
      </b-card>

      <h6 class="mb-3" style="color:#202124;font-weight:600;">Email Logs ({{ emailLogs.length }})</h6>
      <b-card class="gcp-card-surface p-0" no-body>
        <el-table class="gcp-table" :data="emailLogs" empty-text="No email logs found." max-height="400">
          <el-table-column label="Email" min-width="200px" prop="email">
            <template v-slot="{ row }">
              <div class="d-flex align-items-center">
                <i class="ni ni-email-83 mr-2 text-muted"></i><span>{{ row.email }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="KOL Name" min-width="150px" prop="kol_name">
            <template v-slot="{ row }"><span>{{ row.kol_name || 'N/A' }}</span></template>
          </el-table-column>
          <el-table-column label="Status" min-width="120px" prop="status">
            <template v-slot="{ row }">
              <b-badge :variant="getLogStatusVariant(row.status)" class="text-uppercase">{{ formatStatus(row.status) }}</b-badge>
            </template>
          </el-table-column>
          <el-table-column label="Reply" min-width="80px" prop="reply" align="center">
            <template v-slot="{ row }">
              <b-badge :variant="row.reply ? 'success' : 'secondary'">{{ row.reply ? 'Yes' : 'No' }}</b-badge>
            </template>
          </el-table-column>
          <el-table-column label="Sent At" min-width="150px">
            <template v-slot="{ row }"><span>{{ formatDate(row.sended_at) }}</span></template>
          </el-table-column>
          <el-table-column label="Memo" min-width="150px" prop="memo">
            <template v-slot="{ row }"><span v-if="row.memo">{{ row.memo }}</span></template>
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
  components: { [Table.name]: Table, [TableColumn.name]: TableColumn },
  props: {
    show: { type: Boolean, default: false },
    jobId: { type: Number, default: null },
  },
  data() {
    return { emailJob: null, emailLogs: [], loading: false, error: null };
  },
  computed: {
    modalShow: {
      get() { return this.show; },
      set(value) { if (!value) this.$emit("close"); },
    },
  },
  watch: {
    show(newVal) { if (newVal && this.jobId) this.fetchEmailJobDetails(); },
  },
  methods: {
    fetchEmailJobDetails() {
      if (!this.jobId || this.loading) return;
      this.loading = true;
      this.error = null;
      this.emailJob = null;
      this.emailLogs = [];
      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/email_jobs/${this.jobId}`;
      const config = { headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } };
      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.emailJob = response.data.email_job;
            this.emailLogs = response.data.email_logs || [];
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) return;
          this.error = (error.response && error.response.data && error.response.data.error) || "Failed to load email job details";
        })
        .finally(() => { this.loading = false; });
    },
    handleClose() { this.$emit("close"); },
    getStatusVariant(status) {
      const map = { pending: "warning", processing: "info", success: "success", partially_success: "warning", failed: "danger", canceled: "secondary" };
      return map[status] || "secondary";
    },
    getLogStatusVariant(status) {
      const map = { pending: "warning", success: "success", failed: "danger", canceled: "secondary" };
      return map[status] || "secondary";
    },
    formatStatus(status) { return (status || '').replace("_", " ").toUpperCase(); },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    },
  },
};
</script>

<style scoped>
.info-item { color: #202124; font-size: 0.9rem; }
.info-item strong { color: #5f6368; font-weight: 600; }
</style>
