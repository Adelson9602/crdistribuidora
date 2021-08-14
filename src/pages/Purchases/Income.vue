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
          <q-tab name="incomies" label="Articulos" icon="paid"/>
          <q-tab name="add_income" label="Agregar ingresos" icon="account_balance_wallet"/>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="incomies">
            <component-table
              class="q-mt-md"
              proptitle="Inventario actual"
              :propdata="data"
              :propcolumns="columns"
              :propgrid="true"
              :propflat="true"
              :proppdf="optionpdf"
              :propbtns="btns"
              :proppagination="initial_pagination"
              :propactions="true"
              @onedit="editEntry"
              @ondetails="detailsEntry"
              @getrangedata="searchEntryRange"
              :propbuscador="buscador"
            >
              <q-form
                @submit="searchEntry"
              >
                <q-input
                  v-model="id_entry"
                  type="text"
                  hint="Número ingreso"
                  :rules="[val => !!val || 'Número de ingreso es requerido']"
                />
              </q-form>
            </component-table>
          </q-tab-panel>

          <q-tab-panel name="add_income">
            <component-add-income @reload="reload"/>
          </q-tab-panel>
        </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddIncome from 'components/Purchase/ComponentAddIncome';
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from 'vuex';
export default {
  name: 'Categories',
  components: {
    ComponentAddIncome,
    componentTable
  },
  data(){
    return {
      tab: 'incomies',
      columns: [
        {
          name: 'no_ingreso',
          align: 'center',
          label: 'No. Ingreso',
          sortable: true,
          field: 'no_ingreso'
        },
        {
          name: 'CP_Nit',
          align: 'center',
          label: 'NIT',
          sortable: true,
          field: 'CP_Nit'
        },
        {
          name: 'CP_Razon_social',
          align: 'center',
          label: 'RAZON SOCIAL',
          sortable: true,
          field: 'CP_Razon_social'
        },
        {
          name: 'Enc_Fecha_hora',
          align: 'center',
          label: 'Fecha ingreso',
          sortable: true,
          field: 'Enc_Fecha_hora'
        },
        {
          name: 'Enc_dias_credito',
          align: 'center',
          label: 'Días de credito',
          sortable: true,
          field: 'Enc_dias_credito'
        },
        {
          name: 'Enc_num_comprobante',
          align: 'center',
          label: 'Número comprobante',
          sortable: true,
          field: 'Enc_num_comprobante'
        },
        {
          name: 'Enc_subtotal_compra',
          align: 'center',
          label: 'Subtotal compra',
          sortable: true,
          field: 'Enc_subtotal_compra'
        },
        {
          name: 'Enc_total_compra',
          align: 'center',
          label: 'Total compra',
          sortable: true,
          field: 'Enc_total_compra'
        },
        {
          name: 'Enc_User_control',
          align: 'center',
          label: 'Documento',
          sortable: true,
          field: 'Enc_User_control'
        },
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Nombre',
          sortable: true,
          field: 'Per_Nombre'
        },
        {
          name: 'Tc_Descripcion',
          align: 'center',
          label: 'Tipo comprobante',
          sortable: true,
          field: 'Tc_Descripcion'
        },
        {
          name: 'name_estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'name_estado'
        },
        {
          name: 'name_mp',
          align: 'center',
          label: 'Medio pago',
          sortable: true,
          field: 'name_mp'
        },
      ],
      data: [],
      optionpdf: {
        columns: [
          { header: "Art_Codigo_inv", datakey: "Art_Codigo_inv"},
          { header: "Art_Id", datakey: "Art_Id"},
          { header: "Art_Nombre", datakey: "Art_Nombre"},
          { header: "Mov_Descripcion", datakey: "Mov_Descripcion"},
          { header: "Mov_Id", datakey: "Mov_Id"},
          { header: "Si_Cant", datakey: "Si_Cant"},
          { header: "id", datakey: "id"},
        ],
        data: [],
        orientation: 'l', // l => landscape, p => portrait
        title: {
          title: 'Inventario actual',
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        }
      },
      btns: {
        range_date: true,
        btn_export_pdf: true,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9,
      },
      id_entry: null,
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
    ...mapActions('shopping', [
      'getEntries',
      'getDetailsEntry',
      'getSingleEntry',
      'getEntriesRange'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo ingresos, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_ingresos = await this.getEntries().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ingresos',
            data: res_ingresos
          });
          if(res_ingresos.ok){
            if(res_ingresos.result){
              this.data.length = 0 ;
              res_ingresos.data.forEach( ingreso => {
                this.data.push({
                  CP_Nit: ingreso.CP_Nit,
                  CP_Razon_social: ingreso.CP_Razon_social,
                  Ecb_Id: ingreso.Ecb_Id,
                  Enc_Estado: ingreso.Enc_Estado,
                  Enc_Fecha_hora: ingreso.Enc_Fecha_hora,
                  Enc_User_control: ingreso.Enc_User_control,
                  Enc_dias_credito: ingreso.Enc_dias_credito,
                  Enc_impuesto: ingreso.Enc_impuesto,
                  Enc_num_comprobante: ingreso.Enc_num_comprobante,
                  Enc_subtotal_compra: ingreso.Enc_subtotal_compra,
                  Enc_total_compra: ingreso.Enc_total_compra,
                  Mp_Id: ingreso.Mp_Id,
                  Per_Nombre: ingreso.Per_Nombre,
                  Tc_Descripcion: ingreso.Tc_Descripcion,
                  status: ingreso.Enc_Estado,
                  Tc_Id: ingreso.Tc_Id,
                  Id: ingreso.id,
                  no_ingreso: ingreso.id,
                  title: `Ingreso No. ${ingreso.id}`,
                  name_estado: ingreso.name_estado,
                  name_mp: ingreso.name_mp,
                  btn_edit: false,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_ingresos.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_ingresos.message);
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
    },
    detailsEntry(row){
      this.$q.loading.show({
        message: 'Obteniendo detalle del ingreso, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_detail = await this.getDetailsEntry(row.Id).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get detalle ingreso',
            data: res_detail
          });
          if(res_detail.ok){
            if(res_detail.result){
              this.data.length = 0 ;
              res_detail.data.forEach( ingreso => {
                
              });
            } else {
              this.$q.notify({
                message: res_detail.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_detail.message);
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
    },
    searchEntry(){
      this.$q.loading.show({
        message: 'Buscando ingreso, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_ingreso = await this.getSingleEntry(this.id_entry).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ingreso',
            data: res_ingreso
          });
          if(res_ingreso.ok){
            if(res_ingreso.result){
              this.data.length = 0 ;
              res_ingreso.data.forEach( ingreso => {
                this.data.push({
                  CP_Nit: ingreso.CP_Nit,
                  CP_Razon_social: ingreso.CP_Razon_social,
                  Ecb_Id: ingreso.Ecb_Id,
                  Enc_Estado: ingreso.Enc_Estado,
                  Enc_Fecha_hora: ingreso.Enc_Fecha_hora,
                  Enc_User_control: ingreso.Enc_User_control,
                  Enc_dias_credito: ingreso.Enc_dias_credito,
                  Enc_impuesto: ingreso.Enc_impuesto,
                  Enc_num_comprobante: ingreso.Enc_num_comprobante,
                  Enc_subtotal_compra: ingreso.Enc_subtotal_compra,
                  Enc_total_compra: ingreso.Enc_total_compra,
                  Mp_Id: ingreso.Mp_Id,
                  Per_Nombre: ingreso.Per_Nombre,
                  Tc_Descripcion: ingreso.Tc_Descripcion,
                  status: ingreso.Enc_Estado,
                  Tc_Id: ingreso.Tc_Id,
                  Id: ingreso.id,
                  no_ingreso: ingreso.id,
                  title: `Ingreso No. ${ingreso.id}`,
                  name_estado: ingreso.name_estado,
                  name_mp: ingreso.name_mp,
                  btn_edit: false,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_ingreso.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_ingreso.message);
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
      }, 1000)
    },
    editEntry(){

    },
    searchEntryRange(date){
      this.$q.loading.show({
        message: 'Obteniendo ingresos, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_ingresos = await this.getEntriesRange(date).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ingresos',
            data: res_ingresos
          });
          if(res_ingresos.ok){
            if(res_ingresos.result){
              this.data.length = 0 ;
              res_ingresos.data.forEach( ingreso => {
                this.data.push({
                  CP_Nit: ingreso.CP_Nit,
                  CP_Razon_social: ingreso.CP_Razon_social,
                  Ecb_Id: ingreso.Ecb_Id,
                  Enc_Estado: ingreso.Enc_Estado,
                  Enc_Fecha_hora: ingreso.Enc_Fecha_hora,
                  Enc_User_control: ingreso.Enc_User_control,
                  Enc_dias_credito: ingreso.Enc_dias_credito,
                  Enc_impuesto: ingreso.Enc_impuesto,
                  Enc_num_comprobante: ingreso.Enc_num_comprobante,
                  Enc_subtotal_compra: ingreso.Enc_subtotal_compra,
                  Enc_total_compra: ingreso.Enc_total_compra,
                  Mp_Id: ingreso.Mp_Id,
                  Per_Nombre: ingreso.Per_Nombre,
                  Tc_Descripcion: ingreso.Tc_Descripcion,
                  status: ingreso.Enc_Estado,
                  Tc_Id: ingreso.Tc_Id,
                  Id: ingreso.id,
                  no_ingreso: ingreso.id,
                  title: `Ingreso No. ${ingreso.id}`,
                  name_estado: ingreso.name_estado,
                  name_mp: ingreso.name_mp,
                  btn_edit: false,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_ingresos.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_ingresos.message);
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
    },
    reload(){
      this.tab = "incomies"
      setTimeout(()=> {
        this.getData();
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>