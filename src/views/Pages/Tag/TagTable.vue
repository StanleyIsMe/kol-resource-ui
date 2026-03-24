<template>
  <div>
    <b-card class="gcp-search-panel mb-4">
      <h6 class="gcp-section-title mb-3">Search Tags</h6>
      <b-form @submit.prevent="listTags">
        <b-row>
          <b-col lg="8">
            <base-input
              type="text"
              placeholder="Search by tag name"
              v-model="searchTagName"
              addon-left-icon="ni ni-tag"
            ></base-input>
          </b-col>
          <b-col lg="4" class="d-flex">
            <b-button type="submit" variant="primary" class="gcp-btn flex-grow-1">
              <i class="ni ni-zoom-split-in mr-2"></i> Search
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <b-card class="gcp-search-panel mb-4">
      <h6 class="gcp-section-title gcp-section-title--success mb-3">Create New Tag</h6>
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <b-form role="form" @submit.prevent="handleSubmit(createTag)">
          <b-row>
            <b-col lg="8">
              <base-input
                alternative
                type="text"
                placeholder="Enter tag name"
                v-model="newTagName"
                name="newTagName"
                :rules="{ required: true }"
                addon-left-icon="ni ni-tag"
              ></base-input>
            </b-col>
            <b-col lg="4" class="d-flex">
              <b-button type="submit" variant="success" class="gcp-btn gcp-btn--success flex-grow-1">
                <i class="ni ni-fat-add mr-2"></i> Create
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-card>

    <b-card class="gcp-card-surface p-0" no-body>
      <el-table
        class="gcp-table"
        :data="tags"
        empty-text="No tags found. Create one above."
      >
        <el-table-column label="Tag Name" min-width="310px" prop="name">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div class="gcp-avatar gcp-avatar--primary mr-3">
                <i class="ni ni-tag"></i>
              </div>
              <span class="font-weight-600">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Created" prop="time" min-width="200px">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <i class="ni ni-calendar-grid-58 mr-2 text-muted"></i>
              <span>{{ row.time }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </b-card>
  </div>
</template>

<script>
import { Table, TableColumn } from 'element-ui';
export default {
  name: 'tag-table',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      currentPage: 1,
      searchTagName: '',
      tags: [],
      newTagName: '',
    };
  },
  methods: {
    listTags() {
      const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/tags';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        params: { name: this.searchTagName },
      };

      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.tags = response.data.map((tag) => ({
              name: tag.name,
              time: new Date(tag.created_at).toLocaleString(),
            }));
          }
        })
        .catch(() => {});
    },
    createTag() {
      const url = process.env.VUE_APP_KOL_API_URL + '/api/v1/tags';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };

      this.axios.post(url, { name: this.newTagName }, config)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast('Tag created successfully', {
              title: 'Success',
              variant: 'success',
              solid: true,
              autoHideDelay: 3000,
              toaster: 'b-toaster-top-right',
            });
            this.newTagName = '';
            this.listTags();
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error_code === 'DUPLICATED_RESOURCE') {
            this.$bvToast.toast(`Tag "${this.newTagName}" already exists`, {
              title: 'Error',
              variant: 'danger',
              solid: true,
              autoHideDelay: 3000,
              toaster: 'b-toaster-top-right',
            });
          } else {
            this.$bvToast.toast('Failed to create tag', {
              title: 'Error',
              variant: 'danger',
              solid: true,
              autoHideDelay: 3000,
              toaster: 'b-toaster-top-right',
            });
          }
        });
    },
  },
  mounted() {
    this.listTags();
  },
};
</script>

<style scoped>
.gcp-section-title {
  color: #1a73e8;
  font-weight: 600;
  font-size: 0.9375rem;
}
.gcp-section-title--success {
  color: #1e8e3e;
}
.gcp-btn {
  height: 42px;
  font-weight: 500;
  font-size: 0.875rem;
  background-color: #1a73e8;
  border-color: #1a73e8;
}
.gcp-btn--success {
  background-color: #1e8e3e;
  border-color: #1e8e3e;
}
.gcp-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
}
.gcp-avatar--primary {
  background-color: #1a73e8;
}
</style>
