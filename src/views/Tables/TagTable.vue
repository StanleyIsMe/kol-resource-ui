<template>
  <b-card no-body class="bg-default shadow">
    <b-card-header class="bg-transparent border-0">
      <b-row align-v="center" slot="header">
        <b-col cols="8">
          <h3 class="mb-0 text-white">Tags Search</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-form @submit.prevent="listTags">
          <div class="pl-lg-4 align-items-center">
            <b-row>
              <b-col lg="4">
                <base-input
                  type="text"
                  placeholder="tag name"
                  v-model="searchTagName"
                >
                </base-input>
              </b-col>

              <b-col cols="4">
                <!-- <b-col cols="4" > -->
                <b-button type="submit" variant="primary" class="mt-4">Search</b-button>
                <!-- </b-col> -->
              </b-col>
            </b-row>
            <!-- <b-row>
              
              <b-col lg="4">
                <base-input
                  type="text"
                  placeholder="tag name"
                  v-model="tag.name"
                >
                </base-input>
              </b-col>

              <b-col cols="4">

                <base-button type="primary" native-type="submit" class="my-4"
                  >New Tag</base-button
                >

              </b-col>
            </b-row> -->
          </div>
        </b-form>
      </b-row>
      <b-row>
        <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <b-form role="form" @submit.prevent="handleSubmit(createTag)">
                    <div class="pl-lg-4 align-items-center">
            <b-row>
              <b-col lg="4">
                <base-input
                  alternative
                  type="text"
                  placeholder="tag name"
                  v-model="newTagName"
                  name="newTagName"
                  :rules="{required: true}"
                >
                </base-input>
              </b-col>

              <b-col cols="4">
                <!-- <b-col cols="4" > -->
                    <b-button type="submit" variant="primary" class="mt-4">New Tag</b-button>
                <!-- </b-col> -->
              </b-col>
            </b-row>
        
          </div>
                  <!-- <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="Name"
                    name="Name"
                    :rules="{ required: true }"
                    v-model="model.name"
                  >
                  </base-input>

                
                  <div class="text-center">
                    <b-button type="submit" variant="primary" class="mt-4"
                      >Create account</b-button
                    >
                  </div> -->
                </b-form>
              </validation-observer>
      </b-row>
    </b-card-header>

    <el-table
      class="table-responsive table table-dark"
      header-row-class-name="thead-dark"
      :data="tags"
    >
      <!-- Tag.Name -->
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
      <!-- Tag.Time -->
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
      <base-pagination
        v-model="currentPage"
        :per-page="10"
        :total="50"
      ></base-pagination>
    </b-card-footer> -->
    <!-- End Pagination -->
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

      this.axios.post(url, { name: this.newTagName }, config)
        .then((response) => {
          if (response.status == 200) {
            alert("Create tag success");
            this.listTags();
          }
        })
        .catch((error) => {
          if (error.response.data.error_code == 'DUPLICATED_RESOURCE') {
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
