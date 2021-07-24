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
            :propgrid="true"
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
      columns: [
        {
          name: 'Art_Id',
          align: 'center',
          label: 'ID articulo',
          sortable: true,
          field: 'Art_Id'
        },
        {
          name: 'Art_Nombre',
          align: 'center',
          label: 'Nombre articulo',
          sortable: true,
          field: 'Art_Nombre'
        },
        {
          name: 'Dg_Cant',
          align: 'center',
          label: 'Dg_Cant',
          sortable: true,
          field: 'Dg_Cant'
        },
        {
          name: 'Eg_Fecha_control',
          align: 'center',
          label: 'Fecha',
          sortable: true,
          field: 'Eg_Fecha_control'
        },
        {
          name: 'Eg_Id',
          align: 'center',
          label: 'Eg_Id',
          sortable: true,
          field: 'Eg_Id'
        },
        {
          name: 'Eg_Observacion',
          align: 'center',
          label: 'Observación',
          sortable: true,
          field: 'Eg_Observacion'
        },
        {
          name: 'Eg_Quien_autoriza',
          align: 'center',
          label: 'Autorizado',
          sortable: true,
          field: 'Eg_Quien_autoriza'
        },
        {
          name: 'Eg_User_control',
          align: 'center',
          label: 'Documento autoriza',
          sortable: true,
          field: 'Eg_User_control'
        },
        {
          name: 'estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'estado'
        },
        {
          name: 'Ev_Id',
          align: 'center',
          label: 'ID venta',
          sortable: true,
          field: 'Ev_Id'
        },
      ],
      data: [],
      buscador: {
        input: false,
        label: ''
      }
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
              res_warranties.data.forEach( garantia => {
                this.data.push({
                  Art_Id: garantia.Art_Id,
                  Art_Nombre: garantia.Art_Nombre,
                  Dg_Cant: garantia.Dg_Cant,
                  Eg_Fecha_control: garantia.Eg_Fecha_control,
                  Eg_Id: garantia.Eg_Id,
                  Eg_Observacion: garantia.Eg_Observacion,
                  Eg_Quien_autoriza: garantia.Eg_Quien_autoriza,
                  Eg_User_control: garantia.Eg_User_control,
                  Eg_estado: garantia.Eg_estado,
                  estado: garantia.Eg_estado == 1 ? 'APROVADO' : 'NO APROVADO',
                  Ev_Id: garantia.Ev_Id,
                  Per_Nombre: garantia.Per_Nombre,
                })
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
