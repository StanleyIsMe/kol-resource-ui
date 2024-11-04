<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h3 class="mb-0 text-white">Kol Search</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-form @submit.prevent="listKols">
          <div class="pl-lg-4">
            <b-row>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Kol Name"
                  placeholder="網紅名"
                  v-model="searchKols.name"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Email address"
                  placeholder="mike@email.com"
                  v-model="searchKols.email"
                >
                </base-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
                <base-input
                  type="text"
                  label="Tag Name"
                  placeholder="生活"
                  v-model="searchKols.tag"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input label="Sex">
                  <select class="form-control" v-model="searchKols.sex">
                    <option value="">All</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                  </select>
                </base-input>
              </b-col>
              <b-col cols="4">
                <b-button type="submit" variant="primary" class="mt-4"
                  >Search</b-button
                >
              </b-col>
              <b-col cols="4" >
                <a href="#/kols-edit" class="btn btn-lg btn-primary">create</a>
              </b-col>
            </b-row>
          </div>
        </b-form>
      </b-row>
    </b-card-header>

    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="kols"
      :current-page="currentPage"
    >
      <!-- Kol.Name -->
      <el-table-column label="Name" min-width="120px" prop="name">
        <template v-slot="{ row }">
          <b-media no-body class="align-items-center">
            <b-media-body>
              <span class="font-weight-600 name mb-0 text-sm">{{
                row.name
              }}</span>
            </b-media-body>
          </b-media>
        </template>
      </el-table-column>

      <!-- Kol.Email -->
      <el-table-column label="Email" prop="budget" min-width="140px">
        <template v-slot="{ row }">
          <span class="font-weight-600 name mb-0 text-sm">{{ row.email }}</span>
        </template>
      </el-table-column>

      <!-- Kol.Social Media -->
      <el-table-column label="Social Media" prop="budget" min-width="140px">
        <template v-slot="{ row }">
          <span class="font-weight-600 name mb-0 text-sm">
            <a :href="`${row.social_media}`" target="_blank" class="btn btn-sm btn-primary"
              >check</a
            >
          </span>
          <!-- <a href="#/kols-edit" class="btn btn-lg btn-primary">點我</a> -->
          <!-- <span class="font-weight-600 name mb-0 text-sm">{{
            row.social_media
          }}</span> -->
        </template>
      </el-table-column>

      <!-- Kol.Sex -->
      <el-table-column label="Sex" prop="budget" min-width="80px">
        <template v-slot="{ row }">
          <span class="font-weight-600 name mb-0 text-sm">{{ row.sex }}</span>
        </template>
      </el-table-column>

      <!-- Kol.Description -->
      <el-table-column label="Description" prop="budget" min-width="140px">
        <template v-slot="{ row }">
          <span class="font-weight-600 name mb-0 text-sm">{{
            row.description
          }}</span>
        </template>
      </el-table-column>

      <!-- Kol.Action -->
      <el-table-column label="Action" prop="budget" min-width="80px">
        <template v-slot="{ row }">
          <!-- <span class="font-weight-600 name mb-0 text-sm">{{ row.email }}</span> -->
          <span class="font-weight-600 name mb-0 text-sm">
            <a :href="`#/kols-edit?id=${row.id}`" class="btn btn-sm btn-primary"
              >Edit</a
            >
          </span>
          <!-- <span class="font-weight-600 name mb-0 text-sm">{{
            row.description
          }}</span> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <b-card-footer class="py-4 d-flex justify-content-end">
      <!-- <base-pagination
        v-model="currentPage"
        :per-page="10"
        :total="50"
      ></base-pagination>
      <p class="mt-3">Current Page: {{ currentPage }}</p> -->
    </b-card-footer>
    <!-- End Pagination -->
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
      per_page: 10,
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
        page_size: 1000,
      },
    };
  },
  mounted() {
    this.listKols();
  },
  methods: {
    listKols() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/kols";

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

            // this.total = response.data.total;

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
