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
        <q-tab name="sales" label="Ventas" icon="monetization_on"/>
        <q-tab name="add_sales" label="Agregar venta" icon="shopping_cart"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="sales">          
          <component-table
            class="q-mt-md"
            proptitle="Ventas"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :proppdf="optionpdf"
            :propbtns="btns"
            :proppagination="initial_pagination"
            :propactions="true"
            @range="getSalesByRange"
            @onedit="editSale"
          />
        </q-tab-panel>

        <q-tab-panel name="add_sales">
          <component-add-sales/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddSales from 'components/Sales/ComponentAddSales';
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from 'vuex';
export default {
  name: 'DeparturesGuarantees',
  components: {
    ComponentAddSales,
    componentTable
  },
  data(){
    return {
      tab: 'sales',
      columns: [
        {
          name: 'CP_Nit',
          align: 'center',
          label: 'NIT',
          sortable: true,
          field: 'CP_Nit'
        },
        {
          name: 'Ev_Des_gen_venta',
          align: 'center',
          label: 'Descuento general venta',
          sortable: true,
          field: 'Ev_Des_gen_venta'
        },
        {
          name: 'Ev_Des_total_art',
          align: 'center',
          label: 'Descuento total artículo',
          sortable: true,
          field: 'Ev_Des_total_art'
        },
        {
          name: 'Ev_Impuesto',
          align: 'center',
          label: 'Impuesto',
          sortable: true,
          field: 'Ev_Impuesto'
        },
        {
          name: 'Ev_Subtotal',
          align: 'center',
          label: 'Subtotal',
          sortable: true,
          field: 'Ev_Subtotal'
        },
        {
          name: 'Ev_Total_venta',
          align: 'center',
          label: 'Venta total',
          sortable: true,
          field: 'Ev_Total_venta'
        },
        {
          name: 'Ev_dias_credito',
          align: 'center',
          label: 'Días crédito',
          sortable: true,
          field: 'Ev_dias_credito'
        },
        {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Nombre movil',
          sortable: true,
          field: 'Mov_Descripcion'
        },
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Nombre vendedor',
          sortable: true,
          field: 'Per_Nombre'
        },
        {
          name: 'Per_Num_documento',
          align: 'center',
          label: 'Documento vendedor',
          sortable: true,
          field: 'Per_Num_documento'
        },
        {
          name: 'name_qautorizqa',
          align: 'center',
          label: 'Autoriza garantía',
          sortable: true,
          field: 'name_qautorizqa'
        },
        {
          name: 'Eg_Quien_autoriza',
          align: 'center',
          label: 'Documento autoriza garantía',
          sortable: true,
          field: 'Eg_Quien_autoriza'
        },
        {
          name: 'Eg_Observacion',
          align: 'center',
          label: 'Observación',
          sortable: true,
          field: 'Eg_Observacion'
        },
        {
          name: 'Eg_Fecha_control',
          align: 'center',
          label: 'Fecha garantía',
          sortable: true,
          field: 'Eg_Fecha_control'
        },
        {
          name: 'Ev_Fecha_venta',
          align: 'center',
          label: 'Fecha venta',
          sortable: true,
          field: 'Ev_Fecha_venta'
        },
        {
          name: 'name_estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'name_estado'
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
      id_sale: null,
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('sales', [
      'getSearchSales',
      'getSalesRange',
      'getSales'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo ventas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_sales = await this.getSales().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ventas',
            data: res_sales
          });
          if(res_sales.ok){
            if(res_sales.result){
              this.data.length = 0 ;
              res_sales.data.forEach( sale => {
                this.data.push({
                  CP_Nit: sale.CP_Nit,
                  CP_Razon_social: sale.CP_Razon_social,
                  Eg_Fecha_control: sale.Eg_Fecha_control,
                  Eg_Id: sale.Eg_Id,
                  Eg_Observacion: sale.Eg_Observacion,
                  Eg_Quien_autoriza: sale.Eg_Quien_autoriza,
                  Eg_estado: sale.Eg_estado,
                  Ev_Des_gen_venta: sale.Ev_Des_gen_venta,
                  Ev_Des_total_art: sale.Ev_Des_total_art,
                  Ev_Descuentog: sale.Ev_Descuentog,
                  Ev_Entregado: sale.Ev_Entregado,
                  Ev_Estado: sale.Ev_Estado,
                  Ev_Fecha_control: sale.Ev_Fecha_control,
                  Ev_Fecha_venta: sale.Ev_Fecha_venta,
                  Ev_Id: sale.Ev_Id,
                  Ev_Impuesto: sale.Ev_Impuesto,
                  Ev_Subtotal: sale.Ev_Subtotal,
                  Ev_Total_venta: sale.Ev_Total_venta,
                  Ev_Usuario_control: sale.Ev_Usuario_control,
                  Ev_conf_pago: sale.Ev_conf_pago,
                  Ev_dias_credito: sale.Ev_dias_credito,
                  Mov_Descripcion: sale.Mov_Descripcion,
                  Mov_Id: sale.Mov_Id,
                  Mp_Id: sale.Mp_Id,
                  Per_Nombre: sale.Per_Nombre,
                  Per_Num_documento: sale.Per_Num_documento,
                  name_estado: sale.name_estado.toUpperCase(),
                  name_mp: sale.name_mp,
                  name_qautorizqa: sale.name_qautorizqa,
                  status: sale.Ev_Estado,
                  btn_edit: true,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_sales.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_sales.message);
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
    getSalesByRange(date){
      this.$q.loading.show({
        message: 'Obteniendo ventas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_sales = await this.getSalesRange(date).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ventas por rango',
            data: res_sales
          });
          if(res_sales.ok){
            if(res_sales.result){
              this.data.length = 0 ;
              res_sales.data.forEach( cat => {
                this.data.push({
                  CP_Nit: sale.CP_Nit,
                  CP_Razon_social: sale.CP_Razon_social,
                  Eg_Fecha_control: sale.Eg_Fecha_control,
                  Eg_Id: sale.Eg_Id,
                  Eg_Observacion: sale.Eg_Observacion,
                  Eg_Quien_autoriza: sale.Eg_Quien_autoriza,
                  Eg_estado: sale.Eg_estado,
                  Ev_Des_gen_venta: sale.Ev_Des_gen_venta,
                  Ev_Des_total_art: sale.Ev_Des_total_art,
                  Ev_Descuentog: sale.Ev_Descuentog,
                  Ev_Entregado: sale.Ev_Entregado,
                  Ev_Estado: sale.Ev_Estado,
                  Ev_Fecha_control: sale.Ev_Fecha_control,
                  Ev_Fecha_venta: sale.Ev_Fecha_venta,
                  Ev_Id: sale.Ev_Id,
                  Ev_Impuesto: sale.Ev_Impuesto,
                  Ev_Subtotal: sale.Ev_Subtotal,
                  Ev_Total_venta: sale.Ev_Total_venta,
                  Ev_Usuario_control: sale.Ev_Usuario_control,
                  Ev_conf_pago: sale.Ev_conf_pago,
                  Ev_dias_credito: sale.Ev_dias_credito,
                  Mov_Descripcion: sale.Mov_Descripcion,
                  Mov_Id: sale.Mov_Id,
                  Mp_Id: sale.Mp_Id,
                  Per_Nombre: sale.Per_Nombre,
                  Per_Num_documento: sale.Per_Num_documento,
                  name_estado: sale.name_estado.toUpperCase(),
                  name_mp: sale.name_mp,
                  name_qautorizqa: sale.name_qautorizqa,
                  status: sale.Ev_Estado,
                  btn_edit: true,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_sales.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_sales.message);
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
    searchSale(){
      this.$q.loading.show({
        message: 'Buscando venta, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_sales = await this.getSearchSales(this.id_sale).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get venta',
            data: res_sales
          });
          if(res_sales.ok){
            if(res_sales.result){
              this.data.length = 0 ;
              res_sales.data.forEach( cat => {
                this.data.push({
                  CP_Nit: sale.CP_Nit,
                  CP_Razon_social: sale.CP_Razon_social,
                  Eg_Fecha_control: sale.Eg_Fecha_control,
                  Eg_Id: sale.Eg_Id,
                  Eg_Observacion: sale.Eg_Observacion,
                  Eg_Quien_autoriza: sale.Eg_Quien_autoriza,
                  Eg_estado: sale.Eg_estado,
                  Ev_Des_gen_venta: sale.Ev_Des_gen_venta,
                  Ev_Des_total_art: sale.Ev_Des_total_art,
                  Ev_Descuentog: sale.Ev_Descuentog,
                  Ev_Entregado: sale.Ev_Entregado,
                  Ev_Estado: sale.Ev_Estado,
                  Ev_Fecha_control: sale.Ev_Fecha_control,
                  Ev_Fecha_venta: sale.Ev_Fecha_venta,
                  Ev_Id: sale.Ev_Id,
                  Ev_Impuesto: sale.Ev_Impuesto,
                  Ev_Subtotal: sale.Ev_Subtotal,
                  Ev_Total_venta: sale.Ev_Total_venta,
                  Ev_Usuario_control: sale.Ev_Usuario_control,
                  Ev_conf_pago: sale.Ev_conf_pago,
                  Ev_dias_credito: sale.Ev_dias_credito,
                  Mov_Descripcion: sale.Mov_Descripcion,
                  Mov_Id: sale.Mov_Id,
                  Mp_Id: sale.Mp_Id,
                  Per_Nombre: sale.Per_Nombre,
                  Per_Num_documento: sale.Per_Num_documento,
                  name_estado: sale.name_estado.toUpperCase(),
                  name_mp: sale.name_mp,
                  name_qautorizqa: sale.name_qautorizqa,
                  status: sale.Ev_Estado,
                  btn_edit: true,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_sales.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_sales.message);
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
    editSale(row){
      this.category_edit = row;
    },
    reload(){
      setTimeout(()=> {
        this.getData()
      }, 200)
    }
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
