<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <h3 class="mb-4 text-white">Product Management</h3>

      <!-- Search & Create Section -->
      <b-card class="product-card mb-4">
        <b-form @submit.prevent="listProducts">
          <b-row align-items-center>
            <b-col lg="6">
              <base-input
                type="text"
                placeholder="Search by product name"
                v-model="searchProductName"
                addon-left-icon="ni ni-zoom-split-in"
              >
              </base-input>
            </b-col>

            <b-col lg="6" class="d-flex">
              <b-button
                type="submit"
                variant="primary"
                class="product-btn mr-3"
              >
                <i class="ni ni-send mr-2"></i> Search
              </b-button>

              <a href="#/products-edit" class="btn btn-success product-btn">
                <i class="ni ni-fat-add mr-2"></i> Create Product
              </a>
            </b-col>
          </b-row>
        </b-form>
      </b-card>
    </b-card-header>

    <!-- Products Table Section -->
    <div
      class="table-header d-flex justify-content-between align-items-center px-4 py-3"
    >
      <h4 class="mb-0 text-white">Product Catalog</h4>
      <span class="badge badge-primary">{{ products.length }} Products</span>
    </div>

    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="products"
      empty-text="No products found. Create one or modify your search."
    >
      <!-- Product.Name -->
      <el-table-column label="Product Name" min-width="310px" prop="name">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-sm rounded-circle bg-success mr-3">
              <i class="ni ni-box-2 text-white"></i>
            </div>
            <span class="font-weight-600 name mb-0">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Product.Time -->
      <el-table-column label="Created" prop="time" min-width="140px">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <i class="ni ni-calendar-grid-58 mr-2 text-primary"></i>
            <span class="font-weight-600 name mb-0">{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Actions Column -->
      <el-table-column label="Actions" min-width="120px" align="right">
        <template v-slot="{ row }">
          <a
            :href="`#/products-edit?id=${row.id}`"
            class="btn btn-sm btn-primary btn-icon"
          >
            <span class="btn-inner--icon"><i class="ni ni-settings"></i></span>
            <span class="btn-inner--text">Edit</span>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </b-card>
</template>

<script>
//   import projects from './projects'
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
      product: {
        name: "",
      },
      searchProductName: "",
    };
  },
  mounted() {
    console.log("mounted");
    this.listProducts();
  },
  methods: {
    updateProfile() {
      //   alert('Your data: ' + JSON.stringify(this.user));
    },
    listProducts() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/products";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          name: this.searchProductName,
        },
      };
      this.axios
        .get(url, config)
        .then((response) => {
          if (response.status == 200) {
            this.products = [];
            response.data.forEach((product) => {
              this.products.push({
                name: product.name,
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
  },
};
</script>

<style>
/* Card styling */
.product-card {
  background-color: #27293d !important;
  border: none !important;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.15) !important;
  border-left: 4px solid #5e72e4 !important;
}

/* Button styling */
.product-btn {
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
.el-table.table-dark .el-table__body tr:hover .font-weight-600 {
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
