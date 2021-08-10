<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section>
        <component-table 
          proptitle='Ventas registradas'
          :propdata="data"
          :propcolumns="columns"
          :propgrid="false"
          :propflat="true"
          :propbtns="btns"
          :proppagination="initial_pagination"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import componentTable from 'components/Generals/ComponentTable';
import { mapActions } from 'vuex';
export default {
  name: 'CheckPurchases',
  components: {
    componentTable
  },
  data(){
    return {
      columns: [
        {
          name: 'CP_Nit',
          align: 'center',
          label: 'NIT Proveedor',
          sortable: true,
          field: 'CP_Nit',
        },
        {
          name: 'CP_Razon_social',
          align: 'center',
          label: 'Razon social',
          sortable: true,
          field: 'CP_Razon_social',
        },
        {
          name: 'Ev_Des_total_art',
          align: 'center',
          label: 'Descuento articulo',
          sortable: true,
          field: 'Ev_Des_total_art',
        },
        {
          name: 'Ev_Des_gen_venta',
          align: 'center',
          label: 'Descuento total',
          sortable: true,
          field: 'Ev_Des_gen_venta',
        },
        {
          name: 'Ev_Descuentog',
          align: 'center',
          label: 'Ev_Descuentog',
          sortable: true,
          field: 'Ev_Descuentog',
        },
        {
          name: 'Ev_Entregado',
          align: 'center',
          label: 'Ev_Entregado',
          sortable: true,
          field: 'Ev_Entregado',
        },
        {
          name: 'Ev_Estado',
          align: 'center',
          label: 'Ev_Estado',
          sortable: true,
          field: 'Ev_Estado',
        },
        {
          name: 'Ev_Fecha_control',
          align: 'center',
          label: 'Ev_Fecha_control',
          sortable: true,
          field: 'Ev_Fecha_control',
        },
        {
          name: 'Ev_Fecha_venta',
          align: 'center',
          label: 'Fecha venta',
          sortable: true,
          field: 'Ev_Fecha_venta',
        },
        {
          name: 'Ev_Impuesto',
          align: 'center',
          label: 'Impuesto',
          sortable: true,
          field: 'Ev_Impuesto',
        },
        {
          name: 'Ev_Subtotal',
          align: 'center',
          label: 'Subtotal',
          sortable: true,
          field: 'Ev_Subtotal',
        },
        {
          name: 'Ev_Total_venta',
          align: 'center',
          label: 'Total',
          sortable: true,
          field: 'Ev_Total_venta',
        },
        {
          name: 'Ev_conf_pago',
          align: 'center',
          label: 'Confirmación pago',
          sortable: true,
          field: 'Ev_conf_pago',
        },
        {
          name: 'Ev_dias_credito',
          align: 'center',
          label: 'Días de crédito',
          sortable: true,
          field: 'Ev_dias_credito',
        },
        {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Nombre móvil',
          sortable: true,
          field: 'Mov_Descripcion',
        },
        {
          name: 'name_estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'name_estado',
        },
        {
          name: 'name_mp',
          align: 'center',
          label: 'Medio pago',
          sortable: true,
          field: 'name_mp',
        },
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Vendedor',
          sortable: true,
          field: 'Per_Nombre',
        },
        {
          name: 'Per_Num_documento',
          align: 'center',
          label: 'Documento vendedor',
          sortable: true,
          field: 'Per_Num_documento',
        },
        {
          name: 'name_qautorizqa',
          align: 'center',
          label: 'name_qautorizqa',
          sortable: true,
          field: 'name_qautorizqa',
        },
        {
          name: 'Eg_Fecha_control',
          align: 'center',
          label: 'Eg_Fecha_control',
          sortable: true,
          field: 'Eg_Fecha_control',
        },
        {
          name: 'Eg_Observacion',
          align: 'center',
          label: 'Eg_Observacion',
          sortable: true,
          field: 'Eg_Observacion',
        },
        {
          name: 'Eg_Quien_autoriza',
          align: 'center',
          label: 'Eg_Quien_autoriza',
          sortable: true,
          field: 'Eg_Quien_autoriza',
        },
        {
          name: 'Eg_estado',
          align: 'center',
          label: 'Eg_estado',
          sortable: true,
          field: 'Eg_estado',
        },
        {
          name: 'Eg_User_control',
          align: 'center',
          label: 'Eg_User_control',
          sortable: true,
          field: 'Eg_User_control',
        },
      ],
      data: [],
      btns: {
        range_date: true,
        btn_export_pdf: true,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9,
      },
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('salesinquiries', [
      'getSales'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos, por favor espere...'
      });
      setTimeout(async() => {
        try {
          const res_sales = await this.getSales().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ventas',
            data: res_sales
          });
          if(res_sales.ok){
            this.data.length = 0;
            if(res_sales.result){
              res_sales.data.forEach( venta => {
                this.data.push({
                  CP_Nit: venta.CP_Nit,
                  CP_Razon_social: venta.CP_Razon_social,
                  Eg_Fecha_control: venta.Eg_Fecha_control,
                  Eg_Id: venta.Eg_Id,
                  Eg_Observacion: venta.Eg_Observacion,
                  Eg_Quien_autoriza: venta.Eg_Quien_autoriza,
                  Eg_User_control: venta.Eg_User_control,
                  Eg_estado: venta.Eg_estado,
                  Ev_Des_gen_venta: venta.Ev_Des_gen_venta,
                  Ev_Des_total_art: venta.Ev_Des_total_art,
                  Ev_Descuentog: venta.Ev_Descuentog,
                  Ev_Entregado: venta.Ev_Entregado,
                  Ev_Estado: venta.Ev_Estado,
                  Ev_Fecha_control: venta.Ev_Fecha_control,
                  Ev_Fecha_venta: venta.Ev_Fecha_venta,
                  Ev_Id: venta.Ev_Id,
                  Ev_Impuesto: venta.Ev_Impuesto,
                  Ev_Subtotal: venta.Ev_Subtotal,
                  Ev_Total_venta: venta.Ev_Total_venta,
                  Ev_conf_pago: venta.Ev_conf_pago,
                  Ev_dias_credito: venta.Ev_dias_credito,
                  Mov_Descripcion: venta.Mov_Descripcion,
                  Mov_Id: venta.Mov_Id,
                  Mp_Id: venta.Mp_Id,
                  Per_Nombre: venta.Per_Nombre,
                  Per_Num_documento: venta.Per_Num_documento,
                  name_estado: venta.name_estado,
                  name_mp: venta.name_mp,
                  name_qautorizqa: venta.name_qautorizqa,
                })
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_sales.message)
          }
        } catch (e) {
          
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
