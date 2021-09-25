<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section class="q-gutter-y-lg">
        <div class="row">
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-input  v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="date"
                      default-view="Years"
                      :emit-immediately="true"
                    >
                      <div class="row items-center justify-end">
                        <q-btn @click="getDataRange" label="Ok" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-select
              v-model="seller_selecte"
              :options="options_seller"
              hint="Origen"
            />
          </div>
        </div>
        <div class="row">
          <div class="q-pa-sm col-xs-12 col-sm-6 col-lg-3">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Abonos créditos</q-item-label>
                      <q-item-label class="number_card">$ {{new Intl.NumberFormat().format(utilidad.total_abonos)}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Total
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
          <div class="q-pa-sm col-xs-12 col-sm-6 col-lg-3">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Ventas crédito</q-item-label>
                      <q-item-label class="number_card">$ {{new Intl.NumberFormat().format(utilidad.total_creditos)}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Total
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-danger-gradient"
                        text-color="white"
                        icon="credit_card"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-sm col-xs-12 col-sm-6 col-lg-3">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Total ventas</q-item-label>
                      <q-item-label class="number_card">$ {{new Intl.NumberFormat().format(utilidad.total_facturas)}}</q-item-label>
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
          <div class="q-pa-sm col-xs-12 col-sm-6 col-lg-3">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Total ventas</q-item-label>
                      <q-item-label class="number_card">$ {{new Intl.NumberFormat().format(utilidad.total_contado)}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="money"
                          color="positive"
                        /> Contado
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-success-gradient"
                        text-color="white"
                        icon="shopping_basket"
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
          class="q-mt-md height"
          title="Resumen ventas a crédito"
          :data="data_creditos"
          :columns="columns_creditos"
          flat
          v-if="render_component"
        />

        <q-table
          class="q-mt-md height"
          title="Detalle ventas"
          :data="data_dis_ventas"
          :columns="columns_dis_ventas"
          flat
          v-if="render_component"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
import { date } from 'quasar'
let all_seller = []; //Contiene todos los vendedores
export default {
  name: "ConsultSeller",
  data() {
    return {
      seller_selecte: null,
      options_seller: all_seller,
      date: null,
      columns: [
        {
          name: "name",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        {
          name: "carbs",
          label: "Carbs (g)",
          field: "carbs",
        },
        {
          name: "protein",
          label: "Protein (g)",
          field: "protein",
        },
        {
          name: "sodium",
          label: "Sodium (mg)",
          field: "sodium",
        },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ],
      utilidad: {
        total_abonos: null,
        total_creditos: null,
        total_facturas: null,
        total_contado: null,
      },
      columns_creditos: [
        {
          name: 'Per_Num_documento',
          align: 'center',
          label: 'Documento vendedor',
          sortable: true,
          field: 'Per_Num_documento'
        },
        {
          name: 'porcen_meta',
          align: 'center',
          label: 'Porcentaje meta',
          sortable: true,
          field: 'porcen_meta'
        },
        {
          name: 'total_base_bonificacion',
          align: 'center',
          label: 'Total base bonificación',
          sortable: true,
          field: 'total_base_bonificacion'
        },
        {
          name: 'total_facturas',
          align: 'center',
          label: 'Total facturas',
          sortable: true,
          field: 'total_facturas'
        },
        {
          name: 'total_credito',
          align: 'center',
          label: 'Total créditos',
          sortable: true,
          field: 'total_credito'
        },
        {
          name: 'total_abonos',
          align: 'center',
          label: 'Total abonos',
          sortable: true,
          field: 'total_abonos'
        },
        {
          name: 'total_pagado',
          align: 'center',
          label: 'Total pagado',
          sortable: true,
          field: 'total_pagado'
        },
        {
          name: 'bonificacion_real',
          align: 'center',
          label: 'Bonificación real',
          sortable: true,
          field: 'bonificacion_real'
        },
        {
          name: 'bonificaion_posible',
          align: 'center',
          label: 'Bonificación posible',
          sortable: true,
          field: 'bonificaion_posible'
        },
      ],
      data_creditos: [],
      columns_dis_ventas: [
        {
          name: 'Ev_Id',
          align: 'center',
          label: 'No. Venta',
          sortable: true,
          field: 'Ev_Id'
        },
        {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Nombre móvil',
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
          name: 'dias_credito',
          align: 'center',
          label: 'Días de crédito',
          sortable: true,
          field: 'dias_credito'
        },
        {
          name: 'porcen_meta',
          align: 'center',
          label: 'Porcentaje meta',
          sortable: true,
          field: 'porcen_meta'
        },
        {
          name: 'total_abonos',
          align: 'center',
          label: 'Total abonos',
          sortable: true,
          field: 'total_abonos'
        },
        {
          name: 'fecha_ultimo_abono',
          align: 'center',
          label: 'Fecha último abono',
          sortable: true,
          field: 'fecha_ultimo_abono'
        },
        {
          name: 'total_credito',
          align: 'center',
          label: 'total_credito',
          sortable: true,
          field: 'total_credito'
        },
        {
          name: 'total_facturas',
          align: 'center',
          label: 'Total facturas',
          sortable: true,
          field: 'total_facturas'
        },
        {
          name: 'total_pagado',
          align: 'center',
          label: 'Total pagado',
          sortable: true,
          field: 'total_pagado'
        },
        {
          name: 'total_base_bonificacion',
          align: 'center',
          label: 'Total base bonificación',
          sortable: true,
          field: 'total_base_bonificacion'
        },
        {
          name: 'bonificacion_real',
          align: 'center',
          label: 'Bonificación real',
          sortable: true,
          field: 'bonificacion_real'
        },
        {
          name: 'bonificaion_posible',
          align: 'center',
          label: 'Bonificación posible',
          sortable: true,
          field: 'bonificaion_posible'
        },
      ],
      data_dis_ventas: [],
      render_component: false,
    };
  },
  watch: {
    seller_selecte(value){
      if(value){
        if(typeof(this.date) == 'object' && !this.date.to){
          this.$q.notify({
            message: 'Seleccione un rango de fecha',
            type: 'warning'
          });
          return;
        }
        this.$q.loading.show({
          message: 'Obteniendo datos, por favor espere....'
        })
        this.render_table = false;
        setTimeout(async() => {
          try {
            let params = {
              Per_Num_documento: value,
              to: null,
              from: null
            }
            params.from = typeof(this.date) == 'object' ? this.date.from : this.date;
            params.to = typeof(this.date) == 'object' ? this.date.to : this.date;
            
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
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('access', [
      'getPersons',
    ]),
    ...mapActions('movements', [
      'getResumenUtilidad',
      'getTotalCreGeneral',
      'getDisVentaGeneral',
      'getResumenUtilidadRange',
      'getTotalCreGeneralRange',
      'getDisVentaGeneralRange'
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
          // console.log({
          //   msg: 'Respuesta get personal',
          //   data: res_persons
          // });
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

          const res_resumen = await this.getResumenUtilidad().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get resumen utilidad',
          //   data: res_resumen
          // });
          if(res_resumen.ok){
            if(res_resumen.result){
              this.utilidad = {
                total_abonos: res_resumen.data.total_abonos,
                total_creditos: res_resumen.data.total_creditos,
                total_facturas: res_resumen.data.total_facturas,
                total_contado: res_resumen.data.total_facturas - res_resumen.data.total_creditos,
              };
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_resumen.message)
          }

          const res_venta = await this.getTotalCreGeneral().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get abonos créditos',
          //   data: res_venta
          // });
          this.data_creditos.length = 0;
          if(res_venta.ok){
            if(res_venta.result){
              res_venta.data.forEach( element => {
                this.data_creditos.push({
                  Per_Num_documento: element.Per_Num_documento,
                  bonificacion_real: element.bonificacion_real,
                  bonificaion_posible: element.bonificaion_posible,
                  porcen_meta: element.porcen_meta,
                  total_abonos: element.total_abonos,
                  total_base_bonificacion: element.total_base_bonificacion,
                  total_credito: element.total_credito,
                  total_facturas: element.total_facturas,
                  total_pagado: element.total_pagado,
                })
              })
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_venta.message)
          }

          const res_dis = await this.getDisVentaGeneral().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get ventas discriminadas',
          //   data: res_dis
          // });
          this.data_dis_ventas.length = 0;
          if(res_dis.ok){
            if(res_dis.result){
              res_dis.data.forEach( element => {
                this.data_dis_ventas.push({
                  Ev_Id: element.Ev_Id,
                  Mov_Descripcion: element.Mov_Descripcion,
                  Per_Nombre: element.Per_Nombre,
                  Per_Num_documento: element.Per_Num_documento,
                  dias_credito: element.dias_credito,
                  porcen_meta: element.porcen_meta,
                  total_abonos: element.total_abonos,
                  fecha_ultimo_abono: element.fecha_ultimo_abono,
                  total_credito: element.total_credito,
                  total_facturas: element.total_facturas,
                  total_pagado: element.total_pagado,
                  total_base_bonificacion: element.total_base_bonificacion,
                  bonificacion_real: element.bonificacion_real,
                  bonificaion_posible: element.bonificaion_posible,
                })
              })
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_dis.message)
          }
          this.render_component = true;
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
    getDataRange(){
      this.render_component = false;
      let fecha = new Date(this.date);
      let month = fecha.getMonth()+1;
      let year = fecha.getFullYear();
      this.$refs.qDateProxy.hide()
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          let date_consult = {
            month,
            year
          }
          const res_resumen = await this.getResumenUtilidadRange(date_consult).then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get resumen utilidad',
          //   data: res_resumen
          // });
          this.utilidad = {
            total_abonos: null,
            total_creditos: null,
            total_facturas: null,
            total_contado: null,
          }
          if(res_resumen.ok){
            if(res_resumen.result){
              this.utilidad = {
                total_abonos: res_resumen.data.total_abonos,
                total_creditos: res_resumen.data.total_creditos,
                total_facturas: res_resumen.data.total_facturas,
                total_contado: res_resumen.data.total_facturas - res_resumen.data.total_creditos,
              };
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_resumen.message)
          }

          const res_venta = await this.getTotalCreGeneralRange(date_consult).then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get abonos créditos',
          //   data: res_venta
          // });
          this.data_creditos.length = 0;
          if(res_venta.ok){
            if(res_venta.result){
              res_venta.data.forEach( element => {
                this.data_creditos.push({
                  Per_Num_documento: element.Per_Num_documento,
                  bonificacion_real: element.bonificacion_real,
                  bonificaion_posible: element.bonificaion_posible,
                  porcen_meta: element.porcen_meta,
                  total_abonos: element.total_abonos,
                  total_base_bonificacion: element.total_base_bonificacion,
                  total_credito: element.total_credito,
                  total_facturas: element.total_facturas,
                  total_pagado: element.total_pagado,
                })
              })
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_venta.message)
          }

          const res_dis = await this.getDisVentaGeneralRange(date_consult).then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get ventas discriminadas',
          //   data: res_dis
          // });
          this.data_dis_ventas.length = 0;
          if(res_dis.ok){
            if(res_dis.result){
              res_dis.data.forEach( element => {
                this.data_dis_ventas.push({
                  Ev_Id: element.Ev_Id,
                  Mov_Descripcion: element.Mov_Descripcion,
                  Per_Nombre: element.Per_Nombre,
                  Per_Num_documento: element.Per_Num_documento,
                  dias_credito: element.dias_credito,
                  porcen_meta: element.porcen_meta,
                  total_abonos: element.total_abonos,
                  fecha_ultimo_abono: element.fecha_ultimo_abono,
                  total_credito: element.total_credito,
                  total_facturas: element.total_facturas,
                  total_pagado: element.total_pagado,
                  total_base_bonificacion: element.total_base_bonificacion,
                  bonificacion_real: element.bonificacion_real,
                  bonificaion_posible: element.bonificaion_posible,
                })
              })
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_dis.message)
          }
          this.render_component = true;
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
    }
  },
};
</script>
<style scoped>
.height{
  height: 450px;
}
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