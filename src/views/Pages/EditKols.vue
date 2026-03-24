<template>
  <div>
    <b-container fluid>
      <b-row>
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
