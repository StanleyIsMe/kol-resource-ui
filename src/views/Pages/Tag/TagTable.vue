<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <h3 class="mb-4 text-white">Tag Management</h3>

      <!-- Search Section -->
      <b-card class="search-card mb-4">
        <h5 class="mb-3 text-primary">Search Tags</h5>
        <b-form @submit.prevent="listTags">
          <b-row align-items-center>
            <b-col lg="8">
              <base-input
                type="text"
                placeholder="Search by tag name"
                v-model="searchTagName"
                addon-left-icon="ni ni-tag"
              >
              </base-input>
            </b-col>
            <b-col lg="4" class="d-flex">
              <b-button
                type="submit"
                variant="primary"
                class="tag-btn flex-grow-1"
              >
                <i class="ni ni-zoom-split-in mr-2"></i> Search
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-card>

      <!-- Create Section -->
      <b-card class="create-card mb-4">
        <h5 class="mb-3 text-success">Create New Tag</h5>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <b-form role="form" @submit.prevent="handleSubmit(createTag)">
            <b-row align-items-center>
              <b-col lg="8">
                <base-input
                  alternative
                  type="text"
                  placeholder="Enter tag name"
                  v-model="newTagName"
                  name="newTagName"
                  :rules="{ required: true }"
                  addon-left-icon="ni ni-tag"
                >
                </base-input>
              </b-col>
              <b-col lg="4" class="d-flex">
                <b-button
                  type="submit"
                  variant="success"
                  class="tag-btn flex-grow-1"
                >
                  <i class="ni ni-fat-add mr-2"></i> Create Tag
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-card>
    </b-card-header>

    <!-- Table Section -->
    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="tags"
      empty-text="No tags found. Create one above."
    >
      <!-- Tag.Name with Icon -->
      <el-table-column label="Tag Name" min-width="310px" prop="name">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-sm rounded-circle bg-primary mr-3">
              <i class="ni ni-tag text-white"></i>
            </div>
            <span class="font-weight-600 name mb-0 text-white">{{
              row.name
            }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Time Column with Icon -->
      <el-table-column label="Created" prop="time" min-width="140px">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-calendar-grid-58 mr-2 text-primary"></i>
            <span class="text-white">{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </b-card>
</template>

<script>
import { Table, TableColumn } from "element-ui";
export default {
  name: "tag-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      currentPage: 1,
      searchTagName: "",
      tags: [],
      newTagName: "",
    };
  },
  methods: {
    listTags() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/tags";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          name: this.searchTagName,
        },
      };

      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.tags = [];
            response.data.forEach((tag) => {
              this.tags.push({
                name: tag.name,
                time: "2024-01-01 00:00:00",
              });
            });

            // this.showAlert = true
            // this.variantAlert = "success"
            // this.alertMessage = "Register success"
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
    createTag() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/tags";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .post(url, { name: this.newTagName }, config)
        .then((response) => {
          if (response.status == 200) {
            alert("Create tag success");
            this.listTags();
          }
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({ name: "login" });

            return;
          }

          if (error.response.data.error_code == "DUPLICATED_RESOURCE") {
            alert(`Tag [${this.newTagName}] already exists`);
          } else {
            alert("Create tag failed");
          }

          console.error("Error:", error);
        });
    },
  },
  mounted() {
    this.listTags();
  },
};
</script>

<style>
/* Card styling */
.search-card,
.create-card {
  background-color: #27293d !important;
  border: none !important;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.15) !important;
}

.search-card {
  border-left: 4px solid #5e72e4 !important;
}

.create-card {
  border-left: 4px solid #2dce89 !important;
}

/* Button styling */
.tag-btn {
  height: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
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

/* Empty state styling */
.el-table__empty-block {
  background-color: #172b4d !important;
}

.el-table__empty-text {
  color: #8898aa !important;
}

/* Avatar for tags */
.avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Form validation styles */
.is-invalid .form-control {
  border-color: #f5365c;
}

.invalid-feedback {
  color: #f5365c;
}
</style>
