<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section>
        <component-table 
          proptitle='Ventas registradas'
          :propdata="data"
          :propcolumns="columns"
          :propflat="true"
          :propbtns="btns"
          :proppagination="initial_pagination"
        >
          <q-select
            v-model="client_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Cliente"
            :options="options_clientes"
            @filter="filterClientes"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </component-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import componentTable from 'components/Generals/ComponentTable';
import { mapActions } from 'vuex';
let all_clients = []; //Contiene todos los clientes
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
          label: 'NIT',
          sortable: true,
          field: 'CP_Nit',
        },
        {
          name: 'CP_Razon_social',
          align: 'center',
          label: 'Razón social',
          sortable: true,
          field: 'CP_Razon_social',
        },
        {
          name: 'Ev_Des_total_art',
          align: 'center',
          label: 'Descuento total articulo',
          sortable: true,
          field: 'Ev_Des_total_art',
        },
        {
          name: 'Ev_Des_gen_venta',
          align: 'center',
          label: 'Descuento general',
          sortable: true,
          field: 'Ev_Des_gen_venta',
        },
        {
          name: 'Ev_Descuentog',
          align: 'center',
          label: 'Descuento',
          sortable: true,
          field: 'Ev_Descuentog',
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
          label: 'Total venta',
          sortable: true,
          field: 'Ev_Total_venta',
        },
        {
          name: 'Ev_Fecha_venta',
          align: 'center',
          label: 'Fecha venta',
          sortable: true,
          field: 'Ev_Fecha_venta',
        },
        {
          name: 'Estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'Estado',
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
      options_clientes: all_clients,
      client_selected: null, //Cliente seleccionado
    }
  },
  watch: {
    client_selected(value){
      if(value){
        this.$q.loading.show({
          message: 'Obteniendo ventas del cliente, por favor espere...',
        });
        setTimeout(async() => {
          try {
            const res_client = await this.getSalesClient(value).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Respuesta get ventas al cliente',
              data: res_client
            });
            if(res_client.ok){
              if(res_client.result){
                this.data.length = 0;
                res_client.data.forEach( venta => {
                  this.data.push({
                    CP_Nit: venta.CP_Nit,
                    CP_Razon_social: venta.CP_Razon_social,
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
                    Estado: venta.name_estado,
                    status: venta.Ev_Estado,
                    title: venta.CP_Razon_social,
                    name_mp: venta.name_mp,
                    name_qautorizqa: venta.name_qautorizqa,
                    // btn_edit: true,
                    // btn_status: true,
                    btn_details: true,
                    // btn_pdf: true,
                    // icon_btn_edit: "mdi-pencil",
                    // icon_btn_status: "power_settings_new",
                    icon_btn_details: "mdi-eye-settings",
                  })
                });
              } else {
                this.$q.notify({
                  message: 'Sin resultados',
                  type: 'warning'
                })
              }
            } else {
              throw new Error(res_client.message);
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
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('salesinquiries', [
      'getSales',
      'getSalesClient'
    ]),
    ...mapActions('shopping', [
      'getProviders'
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
                  Estado: venta.name_estado,
                  status: venta.Ev_Estado,
                  title: venta.CP_Razon_social,
                  name_mp: venta.name_mp,
                  name_qautorizqa: venta.name_qautorizqa,
                  // btn_edit: true,
                  // btn_status: true,
                  btn_details: true,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  icon_btn_details: "mdi-eye-settings",
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

          const res_provider = await this.getProviders().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get clientes',
            data: res_provider
          });
          if(res_provider.ok){
            if(res_provider.result){
              all_clients.length = 0 ;
              res_provider.data.forEach( cliente => {
                if(cliente.name_tp == 'CLIENTE' && cliente.CP_Razon_social){
                  all_clients.push({
                    label: cliente.CP_Razon_social,
                    value: cliente.CP_Nit
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_provider.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_provider.message);
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
    // Busca o filtra las opciones del select categorias articulo
    filterClientes (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_clientes = all_clients
          }
          else {
            const needle = val.toLowerCase()
            this.options_clientes = all_clients.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
          }
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        })
      }, 300)
    },
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
