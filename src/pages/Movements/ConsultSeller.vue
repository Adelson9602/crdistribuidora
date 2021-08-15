<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section class="q-gutter-y-md">
        <div class="row q-gutter-y-md">
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
            <q-field
              stack-label
              class="date_training"
              hint="Seleccione un rango de fecha"
            >
              <template v-slot:control>
                <div
                  class="self-center full-width no-outline row justify-between"
                  tabindex="0"
                >
                  <label class="self-center">
                    Desde {{ date_range.from }} Hasta {{ date_range.to }}
                  </label>
                  <q-btn
                    icon="event"
                    round
                    color="primary"
                    class="self-end"
                    size="xs"
                  >
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="date_range" range mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn
                            label="Borrar"
                            color="primary"
                            flat
                            @click="date_range = { to: '', from: '' }"
                          />
                          <q-btn
                            v-close-popup
                            label="Ok"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
            <q-select
              v-model="seller_selecte"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              hint="Vendedor"
              :options="options_seller"
              @filter="filterSeller"
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
          </div>
        </div>
        <div class="row">
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Procentaje</q-item-label>
                      <q-item-label class="number_card">{{comision.percent_commission}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Comisión
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-primary-gradient"
                        text-color="white"
                        icon="trending_up"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Comisión</q-item-label>
                      <q-item-label class="number_card">{{comision.commission}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Alcanzado
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-danger-gradient"
                        text-color="white"
                        icon="mdi-rocket-launch"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Total ventas</q-item-label>
                      <q-item-label class="number_card">{{comision.total_sales}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Facturadas
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-secondary-gradient"
                        text-color="white"
                        icon="attach_money"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- Tabla de las ventas realizadas -->
        <q-table
          class="q-mt-md height-table"
          title="Ventas realizadas"
          :data="data"
          :columns="columns"
          row-key="name"
          flat
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
let all_seller = []; //Contiene todos los vendedores
export default {
  name: "ConsultSeller",
  data() {
    return {
      seller_selecte: null,
      options_seller: all_seller,
      date_range: {
        to: null,
        from: null,
      },
      columns: [
        {
          name: 'Per_Num_documento',
          align: 'center',
          label: 'Documento vendedor',
          sortable: true,
          field: 'Per_Num_documento'
        },
        {
          name: 'CP_Nit',
          align: 'center',
          label: 'NIT',
          sortable: true,
          field: 'CP_Nit'
        },
        {
          name: 'Ev_dias_credito',
          align: 'center',
          label: 'Días de credito',
          sortable: true,
          field: 'Ev_dias_credito'
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
          name: 'Ev_Des_total_art',
          align: 'center',
          label: 'Descuento total artículo',
          sortable: true,
          field: 'Ev_Des_total_art'
        },
        {
          name: 'Ev_Descuentog',
          align: 'center',
          label: 'Ev_Descuentog',
          sortable: true,
          field: 'Ev_Descuentog'
        },
        {
          name: 'Ev_Des_gen_venta',
          align: 'center',
          label: 'Ev_Des_gen_venta',
          sortable: true,
          field: 'Ev_Des_gen_venta'
        },
        {
          name: 'Ev_Total_venta',
          align: 'center',
          label: 'Total venta',
          sortable: true,
          field: 'Ev_Total_venta'
        },
        {
          name: 'Ev_Estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'Ev_Estado'
        },
        {
          name: 'Ev_conf_pago',
          align: 'center',
          label: 'Confirmación pago',
          sortable: true,
          field: 'Ev_conf_pago'
        },
        {
          name: 'Ev_Entregado',
          align: 'center',
          label: 'Entregado',
          sortable: true,
          field: 'Ev_Entregado'
        },
        {
          name: 'Ev_Fecha_control',
          align: 'center',
          label: 'Fecha venta',
          sortable: true,
          field: 'Ev_Fecha_control'
        },
      ],
      data: [],
      comision: {
        commission: 0,
        total_sales: 0,
        percent_commission: 0,
      }
    };
  },
  created(){
    this.getData();
  },
  watch: {
    seller_selecte(value){
      if(value){
        if(typeof(this.date_range) == 'object' && !this.date_range.to){
          this.$q.notify({
            message: 'Seleccione un rango de fecha',
            type: 'warning'
          });
          return;
        }
        this.$q.loading.show({
          message: 'Obteniendo datos, por favor espere....'
        })
        setTimeout(async() => {
          try {
            let params = {
              Per_Num_documento: value,
              to: null,
              from: null
            }
            params.from = typeof(this.date_range) == 'object' ? this.date_range.from : this.date_range;
            params.to = typeof(this.date_range) == 'object' ? this.date_range.to : this.date_range;
            const res_data = await this.getCommissionSeller(params).then( res => {
              return res.data;
            });
            // console.log({
            //   msg: 'Repuesta comision vendedor',
            //   data: res_data
            // })
            if(res_data.ok){
              if(res_data.result){
                this.comision = {
                  commission: res_data.data.comision ? res_data.data.comision : 0,
                  total_sales: res_data.data.vt ? res_data.data.vt : 0,
                  percent_commission: res_data.data.pc ? res_data.data.pc : 0,
                }
              } else {
                this.$q.notify({
                  message: 'Sin resultados',
                  type: 'warning'
                });
              }
            } else {
              throw new Error(res_data.message)
            }
            const res_deta = await this.getCommissionSellerDet(params).then( res => {
              return res.data;
            });
            // console.log({
            //   msg: 'Repuesta detalle comision vendedor',
            //   data: res_deta
            // })
            if(res_deta.ok){
              if(res_deta.result){
                this.data.length = 0;
                res_deta.data.forEach( venta => {
                  this.data.push({
                    Ev_Id: venta.Ev_Id,
                    CP_Nit: venta.CP_Nit,
                    Mov_Id: venta.Mov_Id,
                    Mp_Id: venta.Mp_Id,
                    Tc_Id: venta.Tc_Id,
                    Per_Num_documento: venta.Per_Num_documento,
                    Ev_dias_credito: venta.Ev_dias_credito,
                    Ev_Impuesto: venta.Ev_Impuesto,
                    Ev_Subtotal: venta.Ev_Subtotal,
                    Ev_Des_total_art: venta.Ev_Des_total_art,
                    Ev_Descuentog: venta.Ev_Descuentog,
                    Ev_Des_gen_venta: venta.Ev_Des_gen_venta,
                    Ev_Total_venta: venta.Ev_Total_venta,
                    Ev_Estado: venta.Ev_Estado,
                    Ev_conf_pago: venta.Ev_conf_pago,
                    Ev_Entregado: venta.Ev_Entregado,
                    Ev_Usuario_control: venta.Ev_Usuario_control,
                    Ev_Fecha_control: venta.Ev_Fecha_control,
                  })
                })
              } else {
                this.$q.notify({
                  message: 'Sin resultados',
                  type: 'warning'
                });
              }
            } else {
              throw new Error(res_deta.message)
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
      }
    }
  },
  methods: {
    ...mapActions('access', [
      'getPersons',
    ]),
    ...mapActions('movements', [
      'getCommissionSeller',
      'getCommissionSellerDet'
    ]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_persons = await this.getPersons().then(res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get personal',
            data: res_persons
          });
          if(res_persons.ok){
            if(res_persons.result){
              all_seller.length = 0;
              res_persons.data.forEach( persona => {
                if(persona.Usu_Estado == 1){
                  all_seller.push({
                    label: persona.Per_Nombre,
                    value: persona.Per_Num_documento
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_persons.message,
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_persons.message);
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
      }, 1000);
    },
    // Buscador del select vendedor
    filterSeller(val, update, abort){
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_seller = all_seller
          }
          else {
            const needle = val.toLowerCase()
            this.options_seller = all_seller.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
          }
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        })
      }, 300)
    }
  },
};
</script>
<style scoped>
.my-card{
  border-radius: 10px;
  height: 120px;
}
.number_card{
  font-weight: 600 !important;
  font-size: 1.5rem;
}
.bg-primary-gradient {
  background: linear-gradient(to bottom right, #9e88f5 0%, #6259ca 100%) !important;
}
.bg-danger-gradient {
  background-image: linear-gradient(to bottom right, #f1bf64 0%, #f71d36 100%) !important;
}
.bg-secondary-gradient {
  background: linear-gradient(to bottom right, #9070ff 0%, #ff5d9e 100%) !important;
}
.bg-success-gradient {
  background: linear-gradient(to bottom right, #4be8d4 0%, #129bd2 100%) !important;
}
</style>