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
            :propactions="true"
            :propbtns="btns"
           
            @ondetails="detailsEntry"
         >
         <template v-slot:toggle>
               <div class="row q-gutter-y-md">
               <div class="col-xs-12 col-md-3 col-lg-3 q-px-md">
               <q-select
                        dense
                        v-model="filter_pendientes"
                        :options="options_state"
                        hint="Estados Garantias"
                        map-options
                        emit-value
                      
                      />
               </div>
               </div>
         </template>
      </component-table>
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
          name: 'Eg_Id',
          align: 'center',
          label: 'ID movimiento',
          sortable: true,
          field: 'Eg_Id'
        },
        {
          name: 'Eg_Fecha_control',
          align: 'center',
          label: 'Fecha',
          sortable: true,
          field: 'Eg_Fecha_control'
        },
      {
          name: 'Ev_Id',
          align: 'center',
          label: 'ID Venta',
          sortable: true,
          field: 'Ev_Id'
        },
          {
          name: 'CP_Nit',
          align: 'center',
          label: 'ID Cliente',
          sortable: true,
          field: 'CP_Nit'
        },
          {
          name: 'CP_Razon_social',
          align: 'center',
          label: 'Cliente',
          sortable: true,
          field: 'CP_Razon_social'
        },
          {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Movil',
          sortable: true,
          field: 'Mov_Descripcion'
        },
          {
          name: 'name_integrnate',
          align: 'center',
          label: 'Vendedor',
          sortable: true,
          field: 'name_integrnate'
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
          name: 'name_autoriza',
          align: 'center',
          label: 'Name Autorizado',
          sortable: true,
          field: 'name_autoriza'
        },
        {
          name: 'name_estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'name_estado'
        },
        {
          name: 'Eg_User_control',
          align: 'center',
          label: 'Documento control',
          sortable: true,
          field: 'Eg_User_control'
        },
        
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Nombre control',
          sortable: true,
          field: 'Per_Nombre'
        },
      ],
      data: [],
          options_state: [
        {
          label: 'Pendiente',
          value: 0
        },
         {
          label: 'Entregado',
          value: 1
        },
          {
          label: 'Descontado',
          value: 2
        },
        {
          label: 'Todos',
          value: 3
        },
       
      ],
      filter_pendientes:3,
      buscador: {
        input: false,
        label: ''
      },
      btns: {
        range_date: true,
        btn_export_pdf: true,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      },
    }
  },
  created(){
    this.getData();
  },
    watch: {

     filter_pendientes(value) {
   
     if(value==3){
    setTimeout(this.getData(),300)
  }else{
      setTimeout(this.getDataSelect(value),300)
  }
    },
  },
  methods: {
    ...mapActions('sales', [
      'getWarranties',
      'getWarrantiesSelect'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo garantias, por favor espere...'
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
                 
                  Eg_Id: garantia.Eg_Id,
                  Ev_Id: garantia.Ev_Id,
                  CP_Nit: garantia.CP_Nit,
                  EvCP_Razon_social_Id: garantia.CP_Razon_social,
                  Mov_Descripcion: garantia.Mov_Descripcion,
                  name_integrnate: garantia.name_integrnate,
                  Eg_Fecha_control: garantia.Eg_Fecha_control,
                  Eg_Observacion: garantia.Eg_Observacion,
                  Eg_Quien_autoriza: garantia.Eg_Quien_autoriza,
                  name_autoriza:garantia.name_autoriza,
                  Eg_estado: garantia.Eg_estado,
                  name_estado: garantia.name_estado,
                  Eg_User_control: garantia.Eg_User_control,
                  Per_Nombre: garantia.Per_Nombre,
                  title: `Movimiento No. ${garantia.Eg_Id}`,
                  btn_edit: false,
                  icon_btn_details: "visibility",
                  btn_details: true,
                  icon_btn_edit: "edit"
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
    },
      detailsEntry(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle del ingreso, por favor espere..."
      });
      setTimeout(async () => {
        try {

          // // Modificamos muestra el encabezado de la entrada
          // this.encabezado_entrada = {
          //   "Entrada No.": row.Id,
          //   Nit: row.CP_Nit,
          //   "Razon social": row.CP_Razon_social,
          //   "Fecha Entrada": row.Enc_Fecha_hora,
          //   "Dias credito": row.Enc_dias_credito,
          //   "impuesto %": row.Enc_impuesto,
          //   "N° comprobante": row.Enc_num_comprobante,
          //   "Subtotal compra": row.Enc_subtotal_compra,
          //   "Total compra": row.Enc_total_compra,
          //   "Medio pago": row.name_mp,
          //   Estado: row.name_estado
          // };

          // const res_detail = await this.getDetailsEntry(row.Id).then(res => {
          //   return res.data;
          // });
          // console.log({
          //   msg: "Respuesta get detalle ingreso",
          //   data: res_detail
          // });
          // if (res_detail.ok) {
          //   if (res_detail.result) {
          //     this.data_details.length = 0;
          //     res_detail.data.forEach(ingreso => {
          //       this.data_details.push({
          //         "Id entrada": ingreso.Enc_Id,
          //         "Id producto": ingreso.Art_Id,
          //         "Codigo producto": ingreso.Art_Codigo_inv,
          //         Descripción: ingreso.Art_Nombre,
          //         Cantidad: ingreso.Dei_Cant,
          //         "Precio compra": ingreso.Dei_Precio_compra
          //       });
          //     });
          //   } else {
          //     this.$q.notify({
          //       message: res_detail.message,
          //       type: "warning"
          //     });
          //   }
          // } else {
          //   throw new Error(res_detail.message);
          // }
          // this.dailog_details = true;
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
            type: "negative"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
    },
     getDataSelect(value){
      this.$q.loading.show({
        message: 'Obteniendo garantias, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_warranties = await this.getWarrantiesSelect(value).then( res => {
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
                  estado: garantia.Eg_estado == 1 ? 'APROBADO' : 'NO APROBADO',
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
