<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section class="q-gutter-y-md">
        <div>
          <q-radio
            v-model="tipo_consulta"
            :val="true"
            label="Consulta general"
            color="orange"
          />
          <q-radio
            v-model="tipo_consulta"
            :val="false"
            label="Consulta vendedor"
            color="green"
          />
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-input v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="date"
                      default-view="Years"
                      :emit-immediately="true"
                      @input="hidePopupDate"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          @click="getDataRange"
                          label="Ok"
                          color="primary"
                          flat
                          v-if="tipo_consulta"
                        />
                        <q-btn
                          @click="consultDataSeller"
                          label="Ok"
                          color="primary"
                          flat
                          v-else
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm" v-if="!tipo_consulta">
            <q-select
              v-model="seller_selecte"
              :options="options_seller"
              hint="Vendedor"
              map-options
              emit-value
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
                      <q-item-label class="number_card"
                        >$
                        {{
                          new Intl.NumberFormat().format(utilidad.total_abonos)
                        }}</q-item-label
                      >
                      <q-item-label>
                        <q-icon name="info" color="positive" /> Total
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
                      <q-item-label class="number_card"
                        >$
                        {{
                          new Intl.NumberFormat().format(
                            utilidad.total_creditos
                          )
                        }}</q-item-label
                      >
                      <q-item-label>
                        <q-icon name="info" color="positive" /> Total
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
                      <q-item-label class="number_card"
                        >$
                        {{
                          new Intl.NumberFormat().format(
                            utilidad.total_facturas
                          )
                        }}</q-item-label
                      >
                      <q-item-label>
                        <q-icon name="info" color="positive" /> Facturadas
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
                      <q-item-label class="number_card"
                        >$
                        {{
                          new Intl.NumberFormat().format(utilidad.total_contado)
                        }}</q-item-label
                      >
                      <q-item-label>
                        <q-icon name="money" color="positive" /> Contado
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
          v-if="render_component && tipo_consulta"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <q-icon name="attach_money" size="1.2em" v-if="props.col.money" />
              {{
                props.col.money
                  ? new Intl.NumberFormat().format(props.value)
                  : props.value
              }}
            </q-td>
          </template>
        </q-table>

        <q-table
          class="q-mt-md height"
          title="Detalle ventas"
          :data="data_dis_ventas"
          :columns="columns_dis_ventas"
          flat
          :visible-columns="visible_columns"
          v-if="render_component"
          row-key="Ev_Id"
          selection="multiple"
          :selected.sync="selected_pay"
        >
          <template v-slot:top-right v-if="selected_pay.length > 0">
            <q-btn color="green" icon="paid" label="Pagar" @click="doPayment" />
          </template>
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <q-icon name="attach_money" size="1.2em" v-if="props.col.money" />
              {{
                props.col.money
                  ? new Intl.NumberFormat().format(props.value)
                  : props.value
              }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { date } from "quasar";
let all_seller = []; //Contiene todos los vendedores
export default {
  name: "ConsultSeller",
  data() {
    return {
      seller_selecte: null,
      options_seller: all_seller,
      date: null,
      utilidad: {
        total_abonos: null,
        total_creditos: null,
        total_facturas: null,
        total_contado: null
      },
      columns_creditos: [
        {
          name: "Per_Num_documento",
          align: "center",
          label: "Documento vendedor",
          sortable: true,
          field: "Per_Num_documento"
        },
        {
          name: "porcen_meta",
          align: "center",
          label: "Porcentaje meta",
          sortable: true,
          field: "porcen_meta"
        },
        {
          name: "total_base_bonificacion",
          align: "center",
          label: "Total base bonificación",
          sortable: true,
          field: "total_base_bonificacion",
          money: true
        },
        {
          name: "total_facturas",
          align: "center",
          label: "Total facturas",
          sortable: true,
          field: "total_facturas",
          money: true
        },
        {
          name: "total_credito",
          align: "center",
          label: "Total créditos",
          sortable: true,
          field: "total_credito",
          money: true
        },
        {
          name: "total_abonos",
          align: "center",
          label: "Total abonos",
          sortable: true,
          field: "total_abonos",
          money: true
        },
        {
          name: "total_pagado",
          align: "center",
          label: "Total pagado",
          sortable: true,
          field: "total_pagado",
          money: true
        },
        {
          name: "bonificacion_real",
          align: "center",
          label: "Bonificación real",
          sortable: true,
          field: "bonificacion_real",
          money: true
        },
        {
          name: "bonificaion_posible",
          align: "center",
          label: "Bonificación posible",
          sortable: true,
          field: "bonificaion_posible",
          money: true
        }
      ],
      data_creditos: [],
      columns_dis_ventas: [
        {
          name: "Ev_Id",
          align: "center",
          label: "No. Venta",
          sortable: true,
          field: "Ev_Id"
        },
        {
          name: "Mov_Descripcion",
          align: "center",
          label: "Nombre móvil",
          sortable: true,
          field: "Mov_Descripcion"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Nombre vendedor",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "Per_Num_documento",
          align: "center",
          label: "Documento vendedor",
          sortable: true,
          field: "Per_Num_documento"
        },
        {
          name: "dias_credito",
          align: "center",
          label: "Días de crédito",
          sortable: true,
          field: "dias_credito"
        },
        {
          name: "porcen_meta",
          align: "center",
          label: "Porcentaje meta",
          sortable: true,
          field: "porcen_meta",
          money: true
        },
        {
          name: "total_abonos",
          align: "center",
          label: "Total abonos",
          sortable: true,
          field: "total_abonos",
          money: true
        },
        {
          name: "fecha_ultimo_abono",
          align: "center",
          label: "Fecha último abono",
          sortable: true,
          field: "fecha_ultimo_abono"
        },
        {
          name: "total_credito",
          align: "center",
          label: "total_credito",
          sortable: true,
          field: "total_credito",
          money: true
        },
        {
          name: "total_facturas",
          align: "center",
          label: "Total facturas",
          sortable: true,
          field: "total_facturas",
          money: true
        },
        {
          name: "total_pagado",
          align: "center",
          label: "Total pagado",
          sortable: true,
          field: "total_pagado",
          money: true
        },
        {
          name: "total_base_bonificacion",
          align: "center",
          label: "Total base bonificación",
          sortable: true,
          field: "total_base_bonificacion",
          money: true
        },
        {
          name: "bonificacion_real",
          align: "center",
          label: "Bonificación real",
          sortable: true,
          field: "bonificacion_real",
          money: true
        },
        {
          name: "bonificaion_posible",
          align: "center",
          label: "Bonificación posible",
          sortable: true,
          field: "bonificaion_posible",
          money: true
        },
        {
          name: "fecha_venta",
          align: "center",
          label: "Fecha venta",
          sortable: true,
          field: "fecha_venta"
        }
      ],
      data_dis_ventas: [],
      visible_columns: [],
      render_component: false,
      tipo_consulta: true,
      selected_pay: []
    };
  },
  watch: {
    seller_selecte(value) {
      if (value) {
        this.consultDataSeller();
      }
    }
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("access", ["getPersons"]),
    ...mapActions("movements", [
      "getResumenUtilidad",
      "getTotalCreGeneral",
      "getDisVentaGeneral",
      "getResumenUtilidadRange",
      "getTotalCreGeneralRange",
      "getDisVentaGeneralRange",
      "getDisVentaSingleRange",
      "insertBonificacion"
    ]),
    async getData() {
      this.render_component = false;
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      try {
        const res_persons = await this.getPersons().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get personal',
        //   data: res_persons
        // });
        if (res_persons.ok) {
          if (res_persons.result) {
            all_seller.length = 0;
            res_persons.data.forEach(persona => {
              if (persona.Usu_Estado == 1) {
                all_seller.push({
                  label: persona.Per_Nombre,
                  value: persona.Per_Num_documento
                });
              }
            });
          } else {
            this.$q.notify({
              message: res_persons.message,
              type: "warning"
            });
          }
        } else {
          throw new Error(res_persons.message);
        }

        const res_resumen = await this.getResumenUtilidad().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get resumen utilidad',
        //   data: res_resumen
        // });
        if (res_resumen.ok) {
          if (res_resumen.result) {
            this.utilidad = {
              total_abonos: res_resumen.data.total_abonos,
              total_creditos: res_resumen.data.total_creditos,
              total_facturas: res_resumen.data.total_facturas,
              total_contado:
                res_resumen.data.total_facturas -
                res_resumen.data.total_creditos
            };
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_resumen.message);
        }

        const res_venta = await this.getTotalCreGeneral().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get abonos créditos',
        //   data: res_venta
        // });
        this.data_creditos.length = 0;
        if (res_venta.ok) {
          if (res_venta.result) {
            res_venta.data.forEach(element => {
              this.data_creditos.push(element);
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_venta.message);
        }

        const res_dis = await this.getDisVentaGeneral().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get ventas discriminadas',
        //   data: res_dis
        // });
        this.data_dis_ventas.length = 0;
        this.visible_columns.length = 0;
        if (res_dis.ok) {
          if (res_dis.result) {
            this.visible_columns = [
              "Ev_Id",
              "Mov_Descripcion",
              "Per_Nombre",
              "Per_Num_documento",
              "dias_credito",
              "porcen_meta",
              "total_abonos",
              "fecha_ultimo_abono",
              "total_credito",
              "total_facturas",
              "total_pagado",
              "total_base_bonificacion",
              "bonificacion_real",
              "bonificaion_posible"
            ];
            res_dis.data.forEach(element => {
              let timeStamp = new Date(element.fecha_ultimo_abono);
              let formattedString = date.formatDate(timeStamp, "YYYY/MM/DD");
              element.fecha_ultimo_abono = element.fecha_ultimo_abono
                ? formattedString
                : element.fecha_ultimo_abono;
              this.data_dis_ventas.push(element);
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_dis.message);
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async getDataRange() {
      this.render_component = false;
      let fecha = new Date(this.date);
      let month = fecha.getMonth() + 1;
      let year = fecha.getFullYear();
      this.$refs.qDateProxy.hide();
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      try {
        let date_consult = {
          month,
          year
        };
        const res_resumen = await this.getResumenUtilidadRange(
          date_consult
        ).then(res => {
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
          total_contado: null
        };
        if (res_resumen.ok) {
          if (res_resumen.result) {
            this.utilidad = {
              total_abonos: res_resumen.data.total_abonos,
              total_creditos: res_resumen.data.total_creditos,
              total_facturas: res_resumen.data.total_facturas,
              total_contado:
                res_resumen.data.total_facturas -
                res_resumen.data.total_creditos
            };
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_resumen.message);
        }

        const res_venta = await this.getTotalCreGeneralRange(date_consult).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: 'Respuesta get abonos créditos',
        //   data: res_venta
        // });
        this.data_creditos.length = 0;
        if (res_venta.ok) {
          if (res_venta.result) {
            res_venta.data.forEach(element => {
              this.data_creditos.push(element);
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_venta.message);
        }

        const res_dis = await this.getDisVentaGeneralRange(date_consult).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: 'Respuesta get ventas discriminadas',
        //   data: res_dis
        // });
        this.data_dis_ventas.length = 0;
        this.visible_columns.length = 0;
        if (res_dis.ok) {
          if (res_dis.result) {
            this.visible_columns = [
              "Ev_Id",
              "Mov_Descripcion",
              "Per_Nombre",
              "Per_Num_documento",
              "dias_credito",
              "porcen_meta",
              "total_abonos",
              "fecha_ultimo_abono",
              "total_credito",
              "total_facturas",
              "total_pagado",
              "total_base_bonificacion",
              "bonificacion_real",
              "bonificaion_posible"
            ];
            res_dis.data.forEach(element => {
              this.data_dis_ventas.push(element);
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_dis.message);
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async doPayment() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      try {
        let promesas = [];
        this.selected_pay.forEach(venta => {
          let pago = {
            base: process.env.__BASE__,
            pb_id_venta: venta.Ev_Id,
            Pb_porc_meta: venta.porcen_meta,
            Pb_valor_pagar: venta.bonificaion_real,
            pb_valor_pagado: venta.total_pagado,
            Pb_user_control: this.data_user.Per_Num_documento
          };
          promesas.push(
            this.insertBonificacion(pago)
              .then(res => {
                return res.data;
              })
              .catch(e => {
                throw new Error(e);
              })
          );
        });
        Promise.all(promesas)
          .then(data => {
            data.forEach(res => {
              console.log(res);
            });
            this.$q.notify({
              message: "Pagado",
              type: "positive"
            });
            this.selected_pay.length = 0;
            setTimeout(() => {
              this.getData();
            }, 300);
          })
          .catch(e => {
            throw new Errro(e);
          });
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
    },
    async consultDataSeller() {
      this.render_component = false;
      this.$refs.qDateProxy.hide();
      if (!this.date) {
        this.$q.notify({
          message: "Seleccione una fecha",
          type: "warning"
        });
        return;
      }
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere...."
      });
      try {
        let fecha = new Date(this.date);
        let month = fecha.getMonth() + 1;
        let year = fecha.getFullYear();
        let date_consult = {
          documento: this.seller_selecte,
          month,
          year
        };
        const res_data = await this.getDisVentaSingleRange(date_consult).then(
          res => {
            return res.data;
          }
        );
        console.log({
          msg: "Respuesta get utilidad vendedor",
          data: res_data
        });
        this.data_dis_ventas.length = 0;
        this.visible_columns.length = 0;
        if (res_data.ok) {
          if (res_data.result) {
            this.visible_columns = [
              "Ev_Id",
              "Mov_Descripcion",
              "Per_Nombre",
              "Per_Num_documento",
              "dias_credito",
              "porcen_meta",
              "total_abonos",
              "fecha_ultimo_abono",
              "total_credito",
              "total_facturas",
              "total_pagado",
              "total_base_bonificacion",
              "bonificacion_real",
              "bonificaion_posible",
              "fecha_venta"
            ];
            res_data.data.forEach(element => {
              this.data_dis_ventas.push(element);
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_data.message);
        }

        const res_resumen = await this.getResumenUtilidadRange(
          date_consult
        ).then(res => {
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
          total_contado: null
        };
        if (res_resumen.ok) {
          if (res_resumen.result) {
            this.utilidad = {
              total_abonos: res_resumen.data.total_abonos,
              total_creditos: res_resumen.data.total_creditos,
              total_facturas: res_resumen.data.total_facturas,
              total_contado:
                res_resumen.data.total_facturas -
                res_resumen.data.total_creditos
            };
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_resumen.message);
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    hidePopupDate(val, reason, details) {
      if (reason === "month") {
        this.$refs.qDateProxy.hide();
        if (!this.tipo_consulta) {
          this.consultDataSeller();
        }
      }
    }
  }
};
</script>
<style scoped>
.height {
  height: 450px;
}
.my-card {
  border-radius: 10px;
  height: 120px;
}
.number_card {
  font-weight: 600 !important;
  font-size: 1.5rem;
}
.bg-primary-gradient {
  background: linear-gradient(
    to bottom right,
    #9e88f5 0%,
    #6259ca 100%
  ) !important;
}
.bg-danger-gradient {
  background-image: linear-gradient(
    to bottom right,
    #f1bf64 0%,
    #f71d36 100%
  ) !important;
}
.bg-secondary-gradient {
  background: linear-gradient(
    to bottom right,
    #9070ff 0%,
    #ff5d9e 100%
  ) !important;
}
.bg-success-gradient {
  background: linear-gradient(
    to bottom right,
    #4be8d4 0%,
    #129bd2 100%
  ) !important;
}
</style>
