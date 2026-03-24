<template>
  <div>
    <b-container fluid>
      <b-row>
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
