<template>
  <card>
    <b-row align-v="center" slot="header">
      <b-col cols="8">
        <h3 class="mb-0">Create/Edit Product</h3>
      </b-col>
    </b-row>

    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
      <b-form @submit.prevent="handleSubmit(createProduct)">
        <h6 class="heading-small text-muted mb-4">Information</h6>

        <div class="pl-lg-4">
          <b-row>
            <b-col lg="6">
              <base-input
                type="text"
                label="Name"
                placeholder="Name"
                v-model="product.name"
                name="name"
                :rules="{ required: true, max: 50 }"
              >
              </base-input>
            </b-col>
          </b-row>
        </div>

        <div class="pl-lg-4">
          <b-form-group
            label="Description"
            label-class="form-control-label"
            class="mb-0"
            label-for="about-form-textaria"
          >
            <!--  <label class="form-control-label">About Me</label> -->
            <b-form-textarea
              rows="4"
              value="A beautiful premium dashboard for BootstrapVue."
              id="about-form-textaria"
              placeholder="A few words about you ..."
              v-model="product.description"
              name="description"
              :rules="{ required: true, max: 500 }"
            ></b-form-textarea>
          </b-form-group>
        </div>
        <hr class="my-4" />
        <div class="pl-lg-4">
          <b-button type="submit" variant="primary" class="mt-4">Submit</b-button>
        </div>
      </b-form>
    </validation-observer>
  </card>
</template>
<script>
export default {
  data() {
    return {
      product: {
        name: "史丹",
        description: "愛吃愛玩愛旅行",
      },
    };
  },
  computed: {},
  methods: {
    createProduct() {
      const url = process.env.VUE_APP_KOL_API_URL + "/api/v1/products";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      this.axios
        .post(
          url,
          { name: this.product.name, description: this.product.description },
          config
        )
        .then((response) => {
          if (response.status == 200) {
            alert("Create tag success");
          }
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$router.push({name: 'login'}) 

            return;
          }

          if (error.response.data.error_code == "DUPLICATED_RESOURCE") {
            alert(`Tag [${this.product.name}] already exists`);
          } else {
            alert("Create tag failed");
          }

          console.error("Error:", error);
        });
    },
  },
};
</script>
<style></style>
