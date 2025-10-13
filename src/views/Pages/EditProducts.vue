<template>
  <div>
    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="4" class="order-xl-2 mb-5">
          <!-- <user-card></user-card> -->
        </b-col>
        <b-col xl="8" class="order-xl-1">
          <edit-product-form></edit-product-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import EditProductForm from './Product/EditProductForm.vue';

  export default {
    components: {
      EditProductForm,
    }
  };
</script>
<style>
</style>
