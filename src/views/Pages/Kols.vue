<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
    </base-header>
    <b-container fluid class="mt--7">
      <!-- <b-row>
        <b-col>
          <light-table/>
        </b-col>
      </b-row> -->
      <div class="mt-5"></div>
      <kol-table></kol-table>
    </b-container>
  </div>
</template>
<script>
  import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn } from 'element-ui';
  // import LightTable from "../Tables/RegularTables/LightTable";
  import KolTable from "./Kol/KolTable";

  export default {
    components: {
      // LightTable,
      KolTable,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
      };
    }
  };
</script>
<style>
.el-table.table-dark{
  background-color: #172b4d;
  color: #f8f9fe;
}

.el-table.table-dark th,
.el-table.table-dark tr{
  background-color: #172b4d;
}

.el-table.table-dark td,
.el-table.table-dark th.is-leaf{
  border-bottom: none;
}
</style>
