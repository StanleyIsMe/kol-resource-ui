<template>
    <b-card no-body class="bg-default shadow">
        <b-card-header class="bg-transparent border-0">
            <b-row align-v="center" slot="header" >
                <b-col cols="8">
                    <h3 class="mb-0 text-white">Search Products</h3>
                </b-col>
            </b-row>
            <b-row>
                <b-form @submit.prevent="updateProfile">
                    <div class="pl-lg-4 align-items-center">
                        <b-row>
                            <b-col lg="12">
                                <base-input
                                    type="text"
                                    placeholder="product name"
                                    v-model="product.name"
                                >
                                </base-input>
                            </b-col>

                            <b-col cols="4">
                                <!-- <b-col cols="4" > -->
                                    <a href="#!" class="btn btn-sm btn-primary">Search</a>
                                <!-- </b-col> -->
                            </b-col>
                        </b-row>
                    </div>
                </b-form>
            </b-row>
        </b-card-header>

        <el-table class="table-responsive table table-dark"
                  header-row-class-name="thead-dark"
                  :data="projects">
            <!-- Product.Name -->
            <el-table-column label="Name"
                             min-width="310px"
                             prop="name">
                <template v-slot="{row}">
                    <b-media no-body class="align-items-center">
                        <a href="#" class="mr-3">
                            <b-img class="avatar" rounded="circle" alt="Image placeholder" :src="row.img" />
                        </a>
                        <b-media-body>
                            <span class="font-weight-600 name mb-0 text-sm">{{row.title}}</span>
                        </b-media-body>
                    </b-media>
                </template>
            </el-table-column>

            <!-- Product.Description -->
            <el-table-column label="Description"
                             prop="description"
                             min-width="140px">
            </el-table-column>

            <!-- Product.Time -->
            <el-table-column label="Time"
                             prop="time"
                             min-width="140px">
            </el-table-column>
        </el-table>

        <!-- Pagination -->
        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
        <!-- End Pagination -->
    </b-card>
</template>
<script>
  import projects from './projects'
  import { Table, TableColumn} from 'element-ui'
  export default {
    name: 'product-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        projects,
        currentPage: 1,
        product: {
            name: ''
        }
      };
    },
    methods: {
        updateProfile() {
    //   alert('Your data: ' + JSON.stringify(this.user));
    }
  }
  }
</script>
