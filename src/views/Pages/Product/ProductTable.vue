<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h3 class="mb-0 text-white">Search Products</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-form @submit.prevent="listProducts">
          <div class="pl-lg-4 align-items-center">
            <b-row>
              <b-col lg="12">
                <base-input
                  type="text"
                  placeholder="product name"
                  v-model="searchProductName"
                >
                </base-input>
              </b-col>

              <b-col cols="4">
                <!-- <b-col cols="4" > -->
                    <b-button type="submit" variant="primary" class="mt-4">Search</b-button>
                <!-- </b-col> -->
              </b-col>
              <b-col cols="4" class="text-right">
                <a href="#/products-edit" class="btn btn-sm btn-primary">create</a>
              </b-col>
            </b-row>
          </div>
        </b-form>
      </b-row>
    </b-card-header>

    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="products"
    >
      <!-- Product.Name -->
      <el-table-column label="Name" min-width="310px" prop="name">
        <template v-slot="{ row }">
          <b-media no-body class="align-items-center">
            <!-- <a href="#" class="mr-3">
                            <b-img class="avatar" rounded="circle" alt="Image placeholder" :src="row.img" />
                        </a> -->
            <b-media-body>
              <span class="font-weight-600 name mb-0 text-sm">{{
                row.name
              }}</span>
            </b-media-body>
          </b-media>
        </template>
      </el-table-column>
      <!-- Product.Time -->
      <el-table-column label="Time" prop="budget" min-width="140px">
        <template v-slot="{ row }">
          <b-media no-body class="align-items-center">
            <b-media-body>
              <span class="font-weight-600 name mb-0 text-sm">{{
                row.time
              }}</span>
            </b-media-body>
          </b-media>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <!-- <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer> -->
    <!-- End Pagination -->
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
            this.$router.push({name: 'login'}) 

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
