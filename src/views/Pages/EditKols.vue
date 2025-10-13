<template>
  <div>

    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="4" class="order-xl-2 mb-5">
          <!-- <user-card></user-card> -->
        </b-col>
        <b-col xl="8" class="order-xl-1">
          <edit-kol-form></edit-kol-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import EditKolForm from './Kol/EditKolForm.vue';

  export default {
    components: {
      EditKolForm,
    }
  };
</script>
<style>
</style>
