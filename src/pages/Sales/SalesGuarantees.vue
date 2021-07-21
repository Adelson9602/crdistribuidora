<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="warranties" label="Garantías" icon="check_circle_outline"/>
        <q-tab name="add_warranties" label="Agregar garantía" icon="add_task"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="warranties">
          <component-table
            proptitle="Garantías"
            :propgrid="false"
            :propflat="true"
            :propdata="data"
            :propcolumns="columns"
          />
        </q-tab-panel>

        <q-tab-panel name="add_warranties">
          <component-add-sales-warranties />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
import ComponentTable from 'components/Generals/ComponentTable';
import ComponentAddSalesWarranties from 'components/Sales/ComponentAddSalesWarranties';
export default {
  name: 'SaleswithoutBalance',
  components: {
    ComponentTable,
    ComponentAddSalesWarranties
  },
  data(){
    return {
      tab: 'warranties',
      columns: [],
      data: []
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('sales', [
      'getWarranties'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo metas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_warranties = await this.getWarranties().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get garantías',
            data: res_warranties
          });
          if(res_warranties.ok){
            if(res_warranties.result){
              this.data.length = 0 ;
              res_warranties.data.forEach( metas => {
                this.data.push()
              });
            } else {
              this.$q.notify({
                message: res_warranties.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_metas.message);
          }
        } catch (e) {
          console.log(e);
          if (e.message === "Network Error") {
            e = e.message;
          }
          if (e.message === "Request failed with status code 404") {
            e = "URL de solicitud no existe, err 404";
          } else if (e.message) {
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000)
    }
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
