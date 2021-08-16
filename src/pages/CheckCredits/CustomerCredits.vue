<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section>
        <component-table
          proptitle="Créditos"
          :propdata="data"
          :propcolumns="columns"
          :propgrid="false"
          :propflat="true"
          :propactions="true"
          @ondetails="viewDetail"
          v-if="rendercomponent"
        >
          <template v-slot:toggle>
            <div class="row q-gutter-y-md">
              <div class="col-xs-12 col-md-3 col-lg-3 q-px-md">
                <q-select
                  dense
                  v-model="filter_pendientes"
                  :options="options_state"
                  hint="Estados Movimiento"
                  map-options
                  emit-value
                />
              </div>
            </div>
            <!-- <q-toggle v-model="filter_pendientes" label="Ver Pentientes" /> -->
          </template>
        </component-table>
      </q-card-section>
      <q-dialog v-model="dialog_detalle_credit" persistent full-width>
        <q-card>
          <q-bar dark class="bg-primary text-white">
            <div class="cursor-pointer non-selectable">
              Menú
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section @click="form_abono = true"
                      >Realizar abono</q-item-section
                    >
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup>
                    <q-item-section @click="form_abono = false"
                      >Cancelar abono</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </div>
            <div class="col text-center text-weight-bold">
              Detalle del crédito
            </div>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-bar>
          <q-separator />
          <q-card-section class="row">
            <div
              class="col-xs-12 col-md-3 col-lg-2 q-px-sm"
              v-for="(value, index) in encabezado_credito"
              :key="index"
            >
              <q-field :hint="index" stack-label dense>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    {{ value }}
                  </div>
                </template>
              </q-field>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              @submit="doPay"
              class="q-gutter-md"
              v-if="credit_selected.status_credito && form_abono"
            >
              <div class="row">
                <div class="col-xs-12 col-md-3 q-px-sm">
                  <q-input
                    v-model="det_credit.Dc_Valor_abono"
                    type="text"
                    label="Valor abonado"
                    :rules="[val => !!val || 'Valor abonado es requerido']"
                    mask="#########"
                  />
                </div>
                <div class="col-xs-12 col-md-3 q-px-sm">
                  <q-input
                    v-model="det_credit.Dc_Aumento_plazo"
                    type="text"
                    label="Días de aumento crédito"
                    :rules="[
                      val => !!val || 'Días de aumento crédito es requerido'
                    ]"
                    mask="##"
                  />
                </div>
                <div class="col-xs-12 q-px-sm">
                  <q-input
                    v-model="det_credit.Dc_Observaciones"
                    type="textarea"
                    label="Observaciones"
                  />
                </div>
              </div>
              <div class="row justify-end">
                <q-btn
                  label="Abonar"
                  type="submit"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="row">
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-table
                title="Histórico crédito"
                :data="data_historico"
                :columns="column_historico"
                row-key="name"
                flat
                style="height: 70vh"
              >
                <!-- Btns en modo normal -->
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width />

                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width>
                      <q-btn
                        color="primary"
                        icon="paid"
                        round
                        @click="confimPayment(props.row)"
                        v-if="props.row.Dc_Conf_pago == 0"
                        size="sm"
                      >
                        <q-tooltip>
                          Confirmar pago
                        </q-tooltip>
                      </q-btn>
                    </q-td>

                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.value }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-table
                title="Productos adquiridos"
                :data="data_product"
                :columns="columns_product"
                row-key="name"
                flat
                style="height: 70vh"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import componentTable from "components/Generals/ComponentTable";
import { mapActions, mapState } from "vuex";
import CryptoJS from "crypto-js";
export default {
  name: "CheckPurchases",
  components: {
    componentTable
  },
  data() {
    return {
      columns: [
        {
          name: "CP_Nit",
          align: "center",
          label: "NIT",
          sortable: true,
          field: "CP_Nit"
        },
        {
          name: "CP_Razon_social",
          align: "center",
          label: "Cliente",
          sortable: true,
          field: "CP_Razon_social"
        },
        {
          name: "Ev_Estado",
          align: "center",
          label: "Ev_Estado",
          sortable: true,
          field: "Ev_Estado"
        },
        {
          name: "Ev_Fecha_venta",
          align: "center",
          label: "Fecha venta",
          sortable: true,
          field: "Ev_Fecha_venta"
        },
        {
          name: "Ev_Total_venta",
          align: "center",
          label: "Total venta",
          sortable: true,
          field: "Ev_Total_venta"
        },
        {
          name: "Ev_dias_credito",
          align: "center",
          label: "Días crédito",
          sortable: true,
          field: "Ev_dias_credito"
        },
        {
          name: "Mov_Descripcion",
          align: "center",
          label: "Nombre movil",
          sortable: true,
          field: "Mov_Descripcion"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Vendedor",
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
          name: "dcredito",
          align: "center",
          label: "Días crédito",
          sortable: true,
          field: "dcredito"
        },
        {
          name: "dias_mas",
          align: "center",
          label: "Días más",
          sortable: true,
          field: "dias_mas"
        },
        {
          name: "conf_pago",
          align: "center",
          label: "Pagos por confirmar",
          sortable: true,
          field: "conf_pago"
        },
        {
          name: "tota_abonos",
          align: "center",
          label: "Total abonos",
          sortable: true,
          field: "tota_abonos"
        },
        {
          name: "Estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "Estado"
        }
      ],
      data: [],
      dialog_detalle_credit: false,
      form_abono: false,
      filter_pendientes: 5,
      options_state: [
        {
          label: "Aceptado",
          value: 1
        },
        {
          label: "Pendiente",
          value: 2
        },
        {
          label: "No tiene pagos por confirmar",
          value: 3
        },
        {
          label: "Tiene pagos por confirmar",
          value: 4
        },
        {
          label: "Todos",
          value: 5
        }
      ],
      credit_selected: {
        CP_Nit: null,
        CP_Razon_social: null,
        Dc_Id: null,
        Ev_Estado: null,
        Ev_Fecha_venta: null,
        Ev_Id: null,
        Ev_Total_venta: null,
        Ev_dias_credito: null,
        Mov_Descripcion: null,
        Mov_Id: null,
        Per_Nombre: null,
        Per_Num_documento: null,
        dcredito: null,
        dias_mas: null,
        pdt_conf_pago: null,
        conf_pago: null,
        status_credito: null,
        tota_abonos: null
      }, //Almacena todos los datos del encabezado del crédito seleccionado
      encabezado_credito: {}, //ALmacena los datos filtrados del encabezado del crédito seleccionado, se usa para mostrar al usuario en el dialog
      column_historico: [
        {
          name: "Dc_Id",
          align: "center",
          label: "ID",
          sortable: true,
          field: "Dc_Id"
        },
        {
          name: "name_verecibe_pago_cliente",
          align: "center",
          label: "Pago recibido por",
          sortable: true,
          field: "name_verecibe_pago_cliente"
        },
        {
          name: "Dc_User_Recibe_abono",
          align: "center",
          label: "Documento recibe pago",
          sortable: true,
          field: "Dc_User_Recibe_abono"
        },
        {
          name: "Dc_Observaciones",
          align: "center",
          label: "Observaciones",
          sortable: true,
          field: "Dc_Observaciones"
        },
        {
          name: "Dc_Conf_pago",
          align: "center",
          label: "Confirmación pago",
          sortable: true,
          field: "Dc_Conf_pago"
        },
        {
          name: "Dc_Fecha_conf_pago",
          align: "center",
          label: "Fecha confirmación pago",
          sortable: true,
          field: "Dc_Fecha_conf_pago"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Nombre confirma pago",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "Dc_User_conf_pago",
          align: "center",
          label: "Documento confirma pago",
          sortable: true,
          field: "Dc_User_conf_pago"
        },
        {
          name: "dias_mas",
          align: "center",
          label: "Días más",
          sortable: true,
          field: "dias_mas"
        },
        {
          name: "tota_abonos",
          align: "center",
          label: "Total abono",
          sortable: true,
          field: "tota_abonos"
        }
      ],
      rendercomponent: true,
      data_historico: [],
      data_product: [],
      datageneral: [],
      columns_product: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID Artículo",
          sortable: true,
          field: "Art_Id"
        },
        {
          name: "Art_Descripcion",
          align: "center",
          label: "Descripción artículo",
          sortable: true,
          field: "Art_Descripcion"
        },
        {
          name: "Dv_Cant",
          align: "center",
          label: "Cantidad vendida",
          sortable: true,
          field: "Dv_Cant"
        },
        {
          name: "Dv_Precio_compra",
          align: "center",
          label: "Precio compra",
          sortable: true,
          field: "Dv_Precio_compra"
        },
        {
          name: "Dv_precio_venta",
          align: "center",
          label: "Precio venta",
          sortable: true,
          field: "Dv_precio_venta"
        },
        {
          name: "Dv_valor_descuento",
          align: "center",
          label: "Valor descuento",
          sortable: true,
          field: "Dv_valor_descuento"
        },
        {
          name: "categoria",
          align: "center",
          label: "Categoría producto",
          sortable: true,
          field: "categoria"
        }
      ],
      det_credit: {
        base: null,
        Dc_Id: null,
        Ev_Id: null,
        Dc_Valor_abono: null,
        Dc_Observaciones: null,
        Dc_Aumento_plazo: null,
        Dc_User_Recibe_abono: null, //vendedor recibe pago
        Dc_Conf_pago: 0,
        Dc_User_conf_pago: 0 //Recibe plata en bodega
      }
    };
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  watch: {
    filter_pendientes(value) {
      if (value == 1) {
        this.rendercomponent = false;
        let dataselect = this.datageneral.filter(credit => credit.status == 1);
        this.data.length = 0;

        setTimeout(() => {
          this.data = dataselect;

          this.rendercomponent = true;
        }, 300);
      } else if (value == 2) {
        this.rendercomponent = false;
        let dataselect = this.datageneral.filter(credit => credit.status == 2);
        this.data.length = 0;

        console.log(this.datageneral);
        setTimeout(() => {
          this.data = dataselect;

          this.rendercomponent = true;
        }, 300);
      } else if (value == 3) {
        this.rendercomponent = false;
        let dataselect = this.datageneral.filter(
          credit => credit.pdt_conf_pago == 0
        );
        this.data.length = 0;

        console.log(this.datageneral);
        setTimeout(() => {
          this.data = dataselect;

          this.rendercomponent = true;
        }, 300);
      } else if (value == 4) {
        this.rendercomponent = false;
        let dataselect = this.datageneral.filter(
          credit => credit.pdt_conf_pago == 1
        );
        this.data.length = 0;

        console.log(this.datageneral);
        setTimeout(() => {
          this.data = dataselect;

          this.rendercomponent = true;
        }, 300);
      } else {
        setTimeout(this.getData(), 300);
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("credits", [
      "getAllCredits",
      "getDetailCredit",
      "insertUpdateCredito"
    ]),
    ...mapActions("sales", ["getDetailSales"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_credits = await this.getAllCredits(this.data_user).then(
            res => {
              return res.data;
            }
          );
          console.log({
            msg: "Respuesta get creditos",
            data: res_credits
          });
          if (res_credits.ok) {
            if (res_credits.result) {
              this.data.length = 0;
              this.datageneral.length = 0;
              // Create our number formatter.
              var formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "COP"

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
              });

              res_credits.data.forEach(credit => {
                this.data.push({
                  CP_Nit: credit.CP_Nit,
                  CP_Razon_social: credit.CP_Razon_social,
                  Dc_Id: credit.Dc_Id,
                  Ev_Estado: credit.Ev_Estado, //Estado de la venta
                  Ev_Fecha_venta: credit.Ev_Fecha_venta,
                  Ev_Id: credit.Ev_Id,
                  Ev_Total_venta: `$ ${formatter.format(
                    credit.Ev_Total_venta
                  )}`,
                  Ev_dias_credito: credit.Ev_dias_credito,
                  Mov_Descripcion: credit.Mov_Descripcion,
                  Mov_Id: credit.Mov_Id,
                  Per_Nombre: credit.Per_Nombre,
                  Per_Num_documento: credit.Per_Num_documento,
                  dcredito: credit.dcredito,
                  dias_mas: credit.dias_mas,
                  pdt_conf_pago: credit.pdt_conf_pago, //0 sin pagos por confirmar y 1 es con pagos por confirmar
                  conf_pago: credit.pdt_conf_pago
                    ? "Tiene pagos por confirmar"
                    : "No tiene pagos por confirmar", //0 sin pagos por confirmar y 1 es con pagos por confirmar
                  status_credito: credit.status_credito, // Validación si el crédito debe o no, 1 saldo y 0 sin saldo
                  tota_abonos: credit.tota_abonos,
                  status: credit.Ev_Estado,
                  Estado: credit.name_estado, //Estado de la venta
                  title: credit.CP_Razon_social,
                  btn_details: true,
                  icon_btn_details: "mdi-eye-settings"
                });

                this.datageneral.push({
                  CP_Nit: credit.CP_Nit,
                  CP_Razon_social: credit.CP_Razon_social,
                  Dc_Id: credit.Dc_Id,
                  Ev_Estado: credit.Ev_Estado, //Estado de la venta
                  Ev_Fecha_venta: credit.Ev_Fecha_venta,
                  Ev_Id: credit.Ev_Id,
                  Ev_Total_venta: `$ ${formatter.format(
                    credit.Ev_Total_venta
                  )}`,
                  Ev_dias_credito: credit.Ev_dias_credito,
                  Mov_Descripcion: credit.Mov_Descripcion,
                  Mov_Id: credit.Mov_Id,
                  Per_Nombre: credit.Per_Nombre,
                  Per_Num_documento: credit.Per_Num_documento,
                  dcredito: credit.dcredito,
                  dias_mas: credit.dias_mas,
                  pdt_conf_pago: credit.pdt_conf_pago, //0 sin pagos por confirmar y 1 es con pagos por confirmar
                  conf_pago: credit.pdt_conf_pago
                    ? "Tiene pagos por confirmar"
                    : "No tiene pagos por confirmar", //0 sin pagos por confirmar y 1 es con pagos por confirmar
                  status_credito: credit.status_credito, // Validación si el crédito debe o no, 1 saldo y 0 sin saldo
                  tota_abonos: credit.tota_abonos,
                  status: credit.Ev_Estado,
                  Estado: credit.name_estado, //Estado de la venta
                  title: credit.CP_Razon_social,
                  btn_details: true,
                  icon_btn_details: "mdi-eye-settings"
                });
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_credits.message);
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
            type: "negative"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
    },
    viewDetail(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle del crédito"
      });
      setTimeout(async () => {
        try {
          this.credit_selected = row;
          for (const key in this.credit_selected) {
            if (
              key !== "Dc_Id" &&
              key !== "Ev_Id" &&
              key !== "Mov_Id" &&
              key !== "status_credito" &&
              key !== "Id" &&
              key !== "Ev_Estado" &&
              key !== "title" &&
              key !== "btn_edit" &&
              key !== "btn_status" &&
              key !== "btn_details" &&
              key !== "icon_btn_edit" &&
              key !== "icon_btn_status" &&
              key !== "icon_btn_details"
            ) {
              let key_no_dash = key.replace(/_|#|-|@|<>/g, " "); //Reemplaza los guines con espacios
              let key_capitalized = key_no_dash.replace(/\b\w/g, l =>
                l.toUpperCase()
              ); //Capitaliza el primer caracter de cada palabra
              let column = this.columns.find(column => column.field == key);
              if (column) {
                let key_obj = column.label;
                Object.defineProperty(this.encabezado_credito, key_obj, {
                  value: this.credit_selected[key],
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              }
            }
          }
          const res_det = await this.getDetailCredit(row.Ev_Id).then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get detalle crédito",
            data: res_det
          });
          this.data_historico.length = 0;
          if (res_det.ok) {
            if (res_det.result) {
              res_det.data.forEach(det => {
                this.data_historico.push(det);
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_det.message);
          }
          const res_deta = await this.getDetailSales(row.Ev_Id).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get detalle venta',
          //   data: res_deta
          // });
          this.data_product.length = 0;
          if (res_deta.ok) {
            if (res_deta.result) {
              res_deta.data.forEach(producto => {
                this.data_product.push(producto);
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_deta.message);
          }
          this.dialog_detalle_credit = true;
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
      }, 2000);
    },
    // Realiza el abono
    doPay() {
      this.$q.loading.show({
        message: "Realizando abono, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.det_credit.base = process.env.__BASE__;
          this.det_credit.Dc_Id = this.credit_selected.Dc_Id;
          this.det_credit.Ev_Id = this.credit_selected.Ev_Id;
          this.det_credit.Dc_User_Recibe_abono = this.data_user.Per_Num_documento;
          const res_update = await this.insertUpdateCredito(
            this.det_credit
          ).then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta insert update abono",
            data: res_update
          });
          if (!res_update.ok) {
            throw new Error(res_update.message);
          }
          this.$q.notify({
            message: "Abono realizado",
            type: "positive"
          });
          this.onReset();
          this.dialog_detalle_credit = false;
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
        setTimeout(this.getData(), 1000);
      }, 1000);
    },
    confimPayment(row) {
      console.log(row);
      this.$q
        .dialog({
          title: "Verificación de identidad",
          message: "Ingrese su contraseña",
          prompt: {
            model: "",
            type: "text" // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk(async data => {
          let password = this.aesEncrypt(data);
          if (password == this.data_user.Usu_Clave_verificacion) {
            this.$q.loading.show({
              message: "Confirmando abono, por favor espere.."
            });
            setTimeout(async () => {
              try {
                this.det_credit = {
                  base: process.env.__BASE__,
                  Dc_Id: row.Dc_Id,
                  Ev_Id: row.Dc_Id,
                  Dc_Valor_abono: row.tota_abonos,
                  Dc_Observaciones: row.Dc_Observaciones,
                  Dc_Aumento_plazo: row.Dc_Aumento_plazo,
                  Dc_User_Recibe_abono: row.Dc_User_Recibe_abono, //vendedor recibe pago
                  Dc_Conf_pago: 1,
                  Dc_User_conf_pago: this.data_user.Per_Num_documento //Recibe plata en bodega
                };
                const res_update = await this.insertUpdateCredito(
                  this.det_credit
                ).then(res => {
                  return res.data;
                });
                console.log({
                  msg: "Respuesta insert update abono",
                  data: res_update
                });
                if (!res_update.ok) {
                  throw new Error(res_update.message);
                }
                this.$q.notify({
                  message: "Abono confirmado",
                  type: "positive"
                });
                this.dialog_detalle_credit = false;
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
          } else {
            this.$q.notify({
              message: "Las contraseñas no coinciden",
              type: "warning"
            });
          }
        });
    },
    onReset() {
      this.det_credit = {
        base: null,
        Dc_Id: null,
        Ev_Id: null,
        Dc_Valor_abono: null,
        Dc_Observaciones: null,
        Dc_Aumento_plazo: null,
        Dc_User_Recibe_abono: null, //vendedor recibe pago
        Dc_Conf_pago: 0,
        Dc_User_conf_pago: 0 //Recibe plata en bodega
      };
    },
    // Encripta contraseñas o strings
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(
        txt,
        CryptoJS.enc.Utf8.parse(process.env.__KEY__),
        {
          iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
          mode: CryptoJS.mode.CBC
        }
      ).toString();
      return cipher.toString();
    }
  }
};
</script>
<style scoped>
.card_detalle {
  width: 70vw;
}
</style>
