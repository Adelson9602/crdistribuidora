<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section>
        <component-table 
          proptitle='Compras registradas'
          :propdata="data"
          :propcolumns="columns"
          :propgrid="false"
          :propflat="true"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import componentTable from 'components/Generals/ComponentTable';
export default {
  name: 'CheckPurchases',
  components: {
    componentTable
  },
  data(){
    return {
      columns: [],
      data: []
    }
  },
  methods: {

  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
