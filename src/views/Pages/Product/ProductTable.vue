<template>
  <div>
    <b-card class="gcp-search-panel mb-4">
      <b-form @submit.prevent="listProducts">
        <b-row>
          <b-col lg="8">
            <base-input type="text" placeholder="Search by product name"
              v-model="searchProductName" addon-left-icon="ni ni-zoom-split-in"></base-input>
          </b-col>
          <b-col lg="4" class="d-flex">
            <b-button type="submit" variant="primary" class="gcp-btn mr-3 flex-grow-1">
              <i class="ni ni-zoom-split-in mr-2"></i> Search
            </b-button>
            <a href="#/products-edit" class="btn flex-grow-1 text-center" style="background:#1e8e3e;border-color:#1e8e3e;color:#fff;height:42px;line-height:28px;font-weight:500;">
              <i class="ni ni-fat-add mr-2"></i> Create
            </a>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <b-card class="gcp-card-surface p-0" no-body>
      <el-table class="gcp-table" :data="products"
        empty-text="No products found. Create one or modify your search.">
        <el-table-column label="Product Name" min-width="310px" prop="name">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div class="gcp-avatar mr-3"><i class="ni ni-box-2"></i></div>
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

        <el-table-column label="Actions" min-width="120px" align="center">
          <template v-slot="{ row }">
            <a :href="`#/products-edit?id=${row.id}`" class="btn btn-sm btn-outline-primary">
              <i class="ni ni-settings mr-1"></i> Edit
            </a>
          </template>
        </el-table-column>
      </el-table>
    </b-card>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
export default {
  name: "product-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      currentPage: 1,
      products: [],
      searchProductName: "",
    };
  },
  mounted() {
    this.listProducts();
  },
  methods: {
    listProducts() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/products";
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { name: this.searchProductName },
      };
      this.axios.get(url, config)
        .then((response) => {
          if (response.status === 200) {
            this.products = response.data.map((product) => ({
              id: product.id,
              name: product.name,
              time: new Date(product.created_at).toLocaleString(),
            }));
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.gcp-btn { height: 42px; font-weight: 500; font-size: 0.875rem; }
.gcp-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; background-color: #1e8e3e; }
</style>
