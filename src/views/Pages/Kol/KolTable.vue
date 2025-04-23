<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <h3 class="mb-4 text-white">KOL Management</h3>

      <!-- Search Section -->
      <b-card class="search-card mb-4">
        <b-form @submit.prevent="listKols">
          <div class="pl-lg-4">
            <b-row>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="KOL Name"
                  placeholder="Search by name"
                  v-model="searchKols.name"
                  addon-left-icon="ni ni-single-02"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Email Address"
                  placeholder="Search by email"
                  v-model="searchKols.email"
                  addon-left-icon="ni ni-email-83"
                >
                </base-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Tag"
                  placeholder="Filter by tag"
                  v-model="searchKols.tag"
                  addon-left-icon="ni ni-tag"
                >
                </base-input>
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
                <b-button
                  type="submit"
                  variant="primary"
                  class="kol-search-btn"
                >
                  <i class="ni ni-zoom-split-in mr-2"></i> Search
                </b-button>
              </b-col>
              <b-col cols="6" class="text-right">
                <!-- Add import button -->
                <input
                  type="file"
                  ref="fileInput"
                  accept=".xlsx"
                  style="display: none"
                  @change="handleFileUpload"
                />
                <b-button
                  variant="info"
                  class="kol-import-btn mr-2"
                  @click="$refs.fileInput.click()"
                >
                  <i class="ni ni-cloud-upload-96 mr-2"></i> Import
                </b-button>

                <!-- Existing create button -->
                <a href="#/kols-edit" class="btn btn-success kol-create-btn">
                  <i class="ni ni-fat-add mr-2"></i> Create KOL
                </a>
              </b-col>
            </b-row>
          </div>
        </b-form>
      </b-card>
    </b-card-header>

    <!-- KOL Results Section -->
    <div
      class="table-header d-flex justify-content-between align-items-center px-4 py-3"
    >
      <h4 class="mb-0 text-white">KOL Directory</h4>
      <span class="badge badge-primary">{{ kols.length }} KOLs</span>
    </div>

    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="kols"
      :current-page="currentPage"
      empty-text="No KOLs found. Try broadening your search criteria."
    >
      <!-- KOL Name -->
      <el-table-column label="KOL Name" min-width="200px" prop="name">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-sm rounded-circle bg-primary mr-3">
              <i class="ni ni-single-02 text-white"></i>
            </div>
            <span class="font-weight-600 name mb-0">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- KOL Email -->
      <el-table-column label="Email" min-width="240px" prop="email">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-email-83 mr-2 text-primary"></i>
            <span>{{ row.email }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- KOL Tags -->
      <el-table-column label="Tags" min-width="200px" prop="tags">
        <template v-slot="{ row }">
          <div class="tags-container">
            <b-badge
              v-for="(tag, index) in row.tags"
              :key="index"
              :variant="getTagVariant(tag)"
              class="tag-badge mr-2 mb-2"
            >
              <i :class="getTagIcon(tag)" class="tag-icon mr-1"></i>
              {{ typeof tag === "object" ? tag.name : tag }}
            </b-badge>
            <span v-if="!row.tags || row.tags.length === 0" class="text-muted">
              No tags
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- KOL Gender -->
      <el-table-column label="Gender" min-width="100px" prop="sex">
        <template v-slot="{ row }">
          <b-badge
            :variant="row.sex === 'm' ? 'primary' : 'info'"
            class="text-uppercase"
          >
            {{
              row.sex === "m" ? "Male" : row.sex === "f" ? "Female" : "Other"
            }}
          </b-badge>
        </template>
      </el-table-column>

      <!-- Social Media -->
      <el-table-column label="Social Media" min-width="120px" align="center">
        <template v-slot="{ row }">
          <a
            :href="ensureAbsoluteUrl(row.social_media)"
            target="_blank"
            class="btn btn-sm btn-primary"
          >
            <i class="ni ni-world-2 mr-1"></i> View
          </a>
        </template>
      </el-table-column>

      <!-- Edit KOL -->
      <el-table-column label="Actions" min-width="120px" align="center">
        <template v-slot="{ row }">
          <a :href="`#/kols-edit?id=${row.id}`" class="btn btn-sm btn-info">
            <i class="ni ni-settings mr-1"></i> Edit
          </a>
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
  </b-card>
</template>

<script>
import { Table, TableColumn } from "element-ui";
export default {
  name: "kol-table",
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
      tag: {
        name: "",
      },
      searchKols: {
        name: "",
        tag: "",
        email: "",
        sex: "",
        page_index: 1,
        page_size: 5,
      },
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
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols";

      this.searchKols.page_index = this.currentPage;

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

      if (this.searchKols.tag != "") {
        config.params.tag = this.searchKols.tag;
      }

      if (this.searchKols.email != "") {
        config.params.email = this.searchKols.email;
      }

      if (this.searchKols.sex != "") {
        config.params.sex = this.searchKols.sex;
      }

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.kols = [];
            response.data.kols.forEach((kol) => {
              this.kols.push({
                id: kol.id,
                name: kol.name,
                email: kol.email,
                social_media: kol.social_media,
                description: kol.description,
                sex: kol.sex,
                tags: kol.tags,
              });
            });

            this.total = response.data.total || 0;
          }
          console.log("Response:", response.data);
          // Handle successful response here
        })
        .catch((error) => {
          console.error("Error:", error);

          if (error.status == 401) {
            this.$router.push({ name: "login" });

            return;
          }

          if (error.response) {
            // this.variantAlert = "danger";
            // this.showAlert = true;
            // if (error.response.data.error_code == 'DUPLICATED_USERNAME') {
            // this.alertMessage = "Email already exists";
            // }
          }
        });
    },
    importKols(file) {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols/upload";

      const formData = new FormData();
      formData.append('file', file);
      
      // if (this.value.length > 0) {
      //   this.value.forEach((tagName) => {
      //     requestBody.tags.push(this.tagMap.get(tagName));
      //   });
      // }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      }

      this.axios.post(url, formData, config).then((response) => {
        if (response.status == 200) {
          this.$notify({
            title: 'Success',
            message: 'KOLs imported successfully',
            type: 'success'
          });
          this.listKols(); // Reload the current page data
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          this.$router.push({name: 'login'}) 

          return;
        }

        console.error("Error:", error);
        alert("Error:" + error.response.data);
      });
    },
    getTagVariant(tag) {
      const tagName =
        typeof tag === "object" ? tag.name.toLowerCase() : tag.toLowerCase();

      // Map common tag names to bootstrap variants
      const variantMap = {
        food: "danger",
        美食: "danger",
        travel: "success",
        旅遊: "success",
        beauty: "info",
        美妝: "info",
        lifestyle: "warning",
        生活: "warning",
        fashion: "primary",
        時尚: "primary",
        tech: "dark",
        科技: "dark",
        fitness: "success",
        健身: "success",
        gaming: "dark",
        遊戲: "dark",
      };

      // Return mapped variant or default to secondary
      return variantMap[tagName] || "secondary";
    },
    getTagIcon(tag) {
      const tagName =
        typeof tag === "object" ? tag.name.toLowerCase() : tag.toLowerCase();

      // Map common tag names to Font Awesome or Nucleo icons
      const iconMap = {
        food: "ni ni-shop",
        美食: "ni ni-shop",
        travel: "ni ni-world",
        旅遊: "ni ni-world",
        beauty: "ni ni-diamond",
        美妝: "ni ni-diamond",
        lifestyle: "ni ni-istanbul",
        生活: "ni ni-istanbul",
        fashion: "ni ni-tie-bow",
        時尚: "ni ni-tie-bow",
        tech: "ni ni-laptop",
        科技: "ni ni-laptop",
        fitness: "ni ni-user-run",
        健身: "ni ni-user-run",
        gaming: "ni ni-controller",
        遊戲: "ni ni-controller",
      };

      // Return mapped icon or default tag icon
      return iconMap[tagName] || "ni ni-tag";
    },
    ensureAbsoluteUrl(url) {
      if (!url) return "#";

      // Check if the URL already has a protocol
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url; // Already has protocol, return as is
      }

      // If no protocol is specified, add https://
      return "https://" + url;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.name.endsWith(".xlsx")) {
        this.$bvToast.toast("Please select an Excel (.xlsx) file", {
          title: "Invalid File Type",
          variant: "danger",
          solid: true,
          autoHideDelay: 3000,
        });
        // Reset file input
        this.$refs.fileInput.value = null;
        return;
      }

      // Show a toast notification indicating successful file selection
      this.$bvToast.toast(`Selected file: ${file.name}`, {
        title: "File Ready for Import",
        variant: "info",
        solid: true,
        autoHideDelay: 3000,
      });

      // Here you would typically call an API to upload and process the file
      this.importKols(file);

      // Reset file input for future uploads
      this.$refs.fileInput.value = null;
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

<style>
/* Card styling */
.search-card {
  background-color: #27293d !important;
  border: none !important;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.15) !important;
  border-left: 4px solid #5e72e4 !important;
}

/* Button styling */
.kol-search-btn,
.kol-create-btn {
  height: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
}

.kol-create-btn {
  background-color: #2dce89 !important;
  border-color: #2dce89 !important;
}

/* Table styling */
.table-header {
  background-color: #1a3164;
  border-top: 1px solid #34495e;
  border-bottom: 1px solid #34495e;
}

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

/* Tags styling */
.tags-container {
  display: flex;
  flex-wrap: wrap;
}

/* Empty state styling */
.el-table__empty-block {
  background-color: #172b4d !important;
}

.el-table__empty-text {
  color: #8898aa !important;
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

/* Enhanced tag styling */
.tag-badge {
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.tag-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.tag-icon {
  font-size: 0.85rem;
}

/* Tag colors with better visibility */
.badge-danger {
  background-color: #f5365c !important;
  color: white !important;
}

.badge-success {
  background-color: #2dce89 !important;
  color: white !important;
}

.badge-info {
  background-color: #11cdef !important;
  color: white !important;
}

.badge-warning {
  background-color: #fb6340 !important;
  color: white !important;
}

.badge-primary {
  background-color: #5e72e4 !important;
  color: white !important;
}

.badge-secondary {
  background-color: #8898aa !important;
  color: white !important;
}

.badge-dark {
  background-color: #344675 !important;
  color: white !important;
}

/* Button styling - add to your existing CSS */
.kol-import-btn {
  height: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
  background-color: #11cdef !important;
  border-color: #11cdef !important;
}

.kol-import-btn:hover {
  background-color: #0bb7d4 !important;
  border-color: #0bb7d4 !important;
}
</style>
