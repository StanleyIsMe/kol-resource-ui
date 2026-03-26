<template>
  <div>
    <b-card class="gcp-search-panel mb-4">
      <b-form @submit.prevent="listKols">
        <b-row>
          <b-col lg="6">
            <base-input type="text" label="KOL Name" placeholder="Search by name"
              v-model="searchKols.name" addon-left-icon="ni ni-single-02"></base-input>
          </b-col>
          <b-col lg="6">
            <base-input type="text" label="Email Address" placeholder="Search by email"
              v-model="searchKols.email" addon-left-icon="ni ni-email-83"></base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <base-input type="text" label="Tag" placeholder="Filter by tag"
              v-model="searchKols.tag" addon-left-icon="ni ni-tag"></base-input>
          </b-col>
          <b-col lg="6">
            <base-input label="Gender" addon-left-icon="ni ni-circle-08">
              <select class="form-control" v-model="searchKols.sex">
                <option value="">All Genders</option>
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </base-input>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col cols="6">
            <b-button type="submit" variant="primary" class="gcp-btn">
              <i class="ni ni-zoom-split-in mr-2"></i> Search
            </b-button>
          </b-col>
          <b-col cols="6" class="text-right">
            <input type="file" ref="fileInput" accept=".xlsx" style="display: none" @change="handleFileUpload" />
            <b-button variant="outline-primary" class="gcp-btn mr-2" @click="$refs.fileInput.click()">
              <i class="ni ni-cloud-upload-96 mr-2"></i> Import
            </b-button>
            <a href="#/kols-edit" class="btn gcp-btn" style="background-color:#1e8e3e;border-color:#1e8e3e;color:#fff;">
              <i class="ni ni-fat-add mr-2"></i> Create
            </a>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <b-card class="gcp-card-surface p-0" no-body>
      <el-table class="gcp-table" :data="kols" :current-page="currentPage"
        empty-text="No KOLs found. Try broadening your search criteria.">
        <el-table-column label="KOL Name" min-width="200px" prop="name">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div class="gcp-avatar gcp-avatar--primary mr-3"><i class="ni ni-single-02"></i></div>
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

        <el-table-column label="Tags" min-width="200px" prop="tags">
          <template v-slot="{ row }">
            <div class="tags-container">
              <b-badge v-for="(tag, index) in row.tags" :key="index"
                variant="primary" class="tag-badge mr-1 mb-1">
                {{ typeof tag === 'object' ? tag.name : tag }}
              </b-badge>
              <span v-if="!row.tags || row.tags.length === 0" class="text-muted">No tags</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Gender" min-width="100px" prop="sex">
          <template v-slot="{ row }">
            <b-badge :variant="row.sex === 'm' ? 'primary' : 'info'">
              {{ row.sex === 'm' ? 'Male' : row.sex === 'f' ? 'Female' : 'Other' }}
            </b-badge>
          </template>
        </el-table-column>

        <el-table-column label="Social Media" min-width="120px" align="center">
          <template v-slot="{ row }">
            <a v-if="hasSocialMedia(row.social_media)" :href="ensureAbsoluteUrl(row.social_media)"
              target="_blank" class="btn btn-sm btn-outline-primary">
              <i class="ni ni-world-2 mr-1"></i> View
            </a>
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" min-width="140px" align="center">
          <template v-slot="{ row }">
            <a :href="`#/kols-edit?id=${row.id}`" class="btn btn-sm btn-outline-primary mr-1">
              <i class="ni ni-settings mr-1"></i> Edit
            </a>
            <b-button variant="outline-danger" size="sm" @click="confirmDelete(row)">
              <i class="ni ni-fat-remove mr-1"></i> Delete
            </b-button>
          </template>
        </el-table-column>
      </el-table>

      <b-card-footer class="d-flex justify-content-between align-items-center" style="background:#fff;border-top:1px solid #dadce0;">
        <span class="text-muted">Page {{ currentPage }}</span>
        <b-pagination v-model="currentPage" :per-page="per_page" :total-rows="total"
          @change="onPageChange" size="md" class="mb-0"></b-pagination>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import { Table, TableColumn } from 'element-ui';
export default {
  name: 'kol-table',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      kols: [],
      currentPage: 1,
      per_page: 5,
      total: 0,
      searchKols: { name: '', tag: '', email: '', sex: '', page_index: 1, page_size: 5 },
    };
  },
  mounted() {
    this.listKols();
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page;
      this.searchKols.page_index = page;
      this.listKols();
    },
    listKols() {
      const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/kols';
      this.searchKols.page_index = this.currentPage;
      let config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        params: { page_index: this.searchKols.page_index, page_size: this.searchKols.page_size },
      };
      if (this.searchKols.name) config.params.name = this.searchKols.name;
      if (this.searchKols.tag) config.params.tag = this.searchKols.tag;
      if (this.searchKols.email) config.params.email = this.searchKols.email;
      if (this.searchKols.sex) config.params.sex = this.searchKols.sex;

      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.kols = (response.data.kols || []).map((kol) => ({
              id: kol.id, name: kol.name, email: kol.email,
              social_media: kol.social_media, description: kol.description,
              sex: kol.sex, tags: kol.tags,
            }));
            this.total = response.data.total || 0;
          }
        })
        .catch(() => {});
    },
    importKols(file) {
      const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/kols/upload';
      const formData = new FormData();
      formData.append('file', file);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      this.axios.post(url, formData, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast('KOLs imported successfully', { title: 'Success', variant: 'success', solid: true, autoHideDelay: 3000, toaster: 'b-toaster-top-right' });
            this.listKols();
          }
        })
        .catch((error) => {
          const msg = (error.response && error.response.data) || 'Import failed';
          this.$bvToast.toast(typeof msg === 'string' ? msg : 'Import failed', { title: 'Error', variant: 'danger', solid: true, autoHideDelay: 3000, toaster: 'b-toaster-top-right' });
        });
    },
    hasSocialMedia(url) {
      return url && url.trim() !== '';
    },
    ensureAbsoluteUrl(url) {
      if (!url) return '#';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      return 'https://' + url;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.name.endsWith('.xlsx')) {
        this.$bvToast.toast('Please select an Excel (.xlsx) file', { title: 'Invalid File Type', variant: 'danger', solid: true, autoHideDelay: 3000, toaster: 'b-toaster-top-right' });
        this.$refs.fileInput.value = null;
        return;
      }
      this.importKols(file);
      this.$refs.fileInput.value = null;
    },
    async confirmDelete(kol) {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        `Are you sure you want to delete "${kol.name}"?`,
        { title: 'Confirm Delete', okVariant: 'danger', okTitle: 'Delete', cancelTitle: 'Cancel', centered: true }
      );
      if (confirmed) this.deleteKol(kol.id);
    },
    deleteKol(id) {
      const url = `${process.env.VUE_APP_KOL_API_URL}/api/v1/kols/${id}`;
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
      };
      this.axios.delete(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast('KOL deleted successfully', { title: 'Success', variant: 'success', solid: true, autoHideDelay: 3000, toaster: 'b-toaster-top-right' });
            this.listKols();
          }
        })
        .catch(() => {
          this.$bvToast.toast('Failed to delete KOL', { title: 'Error', variant: 'danger', solid: true, autoHideDelay: 3000, toaster: 'b-toaster-top-right' });
        });
    },
  },
  watch: {
    currentPage(newVal) {
      this.searchKols.page_index = newVal;
      this.listKols();
    },
  },
};
</script>

<style scoped>
.gcp-btn { height: 42px; font-weight: 500; font-size: 0.875rem; }
.gcp-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; }
.gcp-avatar--primary { background-color: #1a73e8; }
.tags-container { display: flex; flex-wrap: wrap; }
.tag-badge { font-size: 0.75rem; font-weight: 500; border-radius: 4px; padding: 4px 8px; }
</style>
