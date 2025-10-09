<template>
  <div>
    <div>
      <b-row>
        <b-col xl="4" class="order-xl-2 mb-5">
          <!-- <user-card></user-card> -->
        </b-col>
        <b-col xl="8" class="order-xl-1">
          <edit-email-form></edit-email-form>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import EditEmailForm from './Email/EditEmailForm.vue';

  export default {
    components: {
      EditEmailForm,
    }
  };
</script>
<style>
</style>
