<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <component-table
        proptitle="Creditos proveedor"
        :propgrid="true"
        :propflat="true"
        :propdata="data"
        :propexcel="excel"
        :propcolumns="columns"
        :propbtns="btns"
        :propactions="true"
        @ondetails="viewDetail"
        v-if="rendercomponent"
      >
        <template v-slot:toggle>
          <q-toggle v-model="filter_pendientes" label="saldos pendientes" />
        </template>
      </component-table>
      <q-dialog v-model="dialog_detalle_credit" persistent full-width>
        <q-card>
          <q-bar dark class="bg-primary text-white">
            <div class="cursor-pointer non-selectable">
              <div class="text-bold">
                <q-icon name="menu" />
                Menú
              </div>
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
                    v-model="det_credit.Dcc_Valor_abono"
                    type="text"
                    label="Valor abonado"
                    :rules="[val => !!val || 'Valor abonado es requerido']"
                    mask="#########"
                  />
                </div>
                <div class="col-xs-12 col-md-3 q-px-sm">
                  <q-input
                    v-model="det_credit.Dcc_Aumento_plazo"
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
                    v-model="det_credit.Dcc_Observaciones"
                    type="textarea"
                    label="Observaciones"
                    rows="2"
                    :rules="[val => !!val || 'Observació es requerido']"
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
import ComponentTable from "components/Generals/ComponentTable";
import { mapActions, mapState } from "vuex";
import CryptoJS from "crypto-js";
export default {
  name: "ProviderCredits",
  components: {
    ComponentTable
  },
  data() {
    return {
      columns: [
        {
          name: "Ecb_Id",
          align: "center",
          label: "Crédito No.",
          sortable: true,
          field: "Ecb_Id"
        },
        {
          name: "Enc_num_comprobante",
          align: "center",
          label: "Numero comprobante",
          sortable: true,
          field: "Enc_num_comprobante"
        },
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
          label: "Razon social",
          sortable: true,
          field: "CP_Razon_social"
        },
        {
          name: "tota_abonos",
          align: "center",
          label: "Total abonos",
          sortable: true,
          field: "tota_abonos"
        },
        {
          name: "Enc_total_compra",
          align: "center",
          label: "Total compra",
          sortable: true,
          field: "Enc_total_compra"
        },
        {
          name: "Enc_dias_credito",
          align: "center",
          label: "Días de crédito",
          sortable: true,
          field: "Enc_dias_credito"
        },
        {
          name: "dias_mas",
          align: "center",
          label: "Días de más",
          sortable: true,
          field: "dias_mas"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Nombre vendedor",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "Enc_User_control",
          align: "center",
          label: "Documento vendedor",
          sortable: true,
          field: "Enc_User_control"
        },
        {
          name: "Dcc_Observaciones",
          align: "center",
          label: "Observaciones",
          sortable: true,
          field: "Dcc_Observaciones"
        },
        {
          name: "Fecha_compra",
          align: "center",
          label: "Fecha compra",
          sortable: true,
          field: "Fecha_compra"
        },
        {
          name: "Estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "Estado"
        }
      ],
      excel: {
        columns: [
          {
            label: "NIT",
            field: "CP_Nit"
          },
          {
            label: "Razon social",
            field: "CP_Razon_social"
          },
          {
            label: "Documento vendedor",
            field: "Dcc_Aumento_plazo"
          },
          {
            label: "Observaciones",
            field: "Dcc_Observaciones"
          },
          {
            label: "Valor abono",
            field: "Dcc_Valor_abono"
          },
          {
            label: "Ecb_Id",
            field: "Ecb_Id"
          },
          {
            label: "Enc_Estado",
            field: "Enc_Estado"
          },
          {
            label: "Enc_dias_credito",
            field: "Enc_dias_credito"
          },
          {
            label: "Numero comprobante",
            field: "Enc_num_comprobante"
          },
          {
            label: "Total compra",
            field: "Enc_total_compra"
          },
          {
            label: "Fecha compra",
            field: "Fecha_compra"
          },
          {
            label: "Nombre vendedor",
            field: "Per_Nombre"
          },
          {
            label: "Días de crédito",
            field: "dcredito"
          },
          {
            label: "Días de más",
            field: "dias_mas"
          },
          {
            label: "Estado",
            field: "Estado"
          }
        ],
        data: [],
        title: "Creditos Proveedor"
      },
      data: [],
      filter_pendientes: false,
      column_historico: [
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Abono realizado por',
          sortable: true,
          field: 'Per_Nombre'
        },
        {
          name: 'Dcc_User_control',
          align: 'center',
          label: 'Documento',
          sortable: true,
          field: 'Dcc_User_control'
        },
        {
          name: 'dias_mas',
          align: 'center',
          label: 'Días de crédito',
          sortable: true,
          field: 'dias_mas'
        },
        {
          name: 'tota_abonos',
          align: 'center',
          label: 'Total abono',
          sortable: true,
          field: 'tota_abonos'
        },
        {
          name: 'Dcc_Observaciones',
          align: 'center',
          label: 'Observaciones',
          sortable: true,
          field: 'Dcc_Observaciones'
        },
        {
          name: 'Dcc_Fecha_control',
          align: 'center',
          label: 'Fecha abono',
          sortable: true,
          field: 'Dcc_Fecha_control'
        },
      ],
      data_historico: [],
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
      data_product: [],
      btns: {
        range_date: true,
        btn_export_pdf: false,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      },
      credit_selected: {
        CP_Nit: null,
        CP_Razon_social: null,
        Dcc_Aumento_plazo: null,
        Dcc_Id: null,
        Dcc_Observaciones: null,
        Dcc_Valor_abono: null,
        Ecb_Id: null,
        Enc_Estado: null,
        Enc_User_control: null,
        Enc_dias_credito: null,
        Enc_num_comprobante: null,
        Enc_total_compra: null,
        Fecha_compra: null,
        Per_Nombre: null,
        dcredito: null,
        dias_mas: null,
        status: null,
        status_credito: null
      },
      datageneral: [],
      rendercomponent: true,
      encabezado_credito: null,
      dialog_detalle_credit: false,
      form_abono: false,
      det_credit: {
        base: null,
        Dcc_Id: null,
        Enc_Id: null,
        Dcc_Valor_abono: null,
        Dcc_Observaciones: null,
        Dcc_Aumento_plazo: null,
        Dcc_User_control: null,
      },
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
      if (value) {
        this.rendercomponent = false;
        let dataselect = this.datageneral.filter(
          credit => credit.status_credito == 0
        );
        this.data.length = 0;

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
      "getAllCreditsProvider",
      "getDetailCredProvider",
      "saveAbonoCredit"
    ]),
    ...mapActions("notifications", [
      "PostInsertNotification",
    ]),
    ...mapActions("sales", ["getDetailSales"]),
    ...mapActions('shopping', ['insertEncEntry']),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_credits = await this.getAllCreditsProvider(
            this.data_user
          ).then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get creditos",
            data: res_credits
          });
          if (res_credits.ok) {
            if (res_credits.result) {
              this.data.length = 0;
              this.datageneral.length = 0;
              res_credits.data.forEach(credit => {
                this.data.push({
                  CP_Nit: credit.CP_Nit,
                  CP_Razon_social: credit.CP_Razon_social,
                  Dcc_Aumento_plazo: credit.Dcc_Aumento_plazo,
                  Dcc_Id: credit.Dcc_Id,
                  Dcc_Observaciones: credit.Dcc_Observaciones,
                  tota_abonos: credit.tota_abonos,
                  Ecb_Id: credit.Ecb_Id,
                  Tc_Id: credit.Tc_Id,
                  Mp_Id: credit.Mp_Id,
                  Enc_impuesto: credit.Enc_impuesto,
                  Enc_subtotal_compra: credit.Enc_subtotal_compra,
                  Enc_Estado: credit.Enc_Estado,
                  Enc_User_control: credit.Enc_User_control,
                  Enc_dias_credito: credit.Enc_dias_credito,
                  Enc_num_comprobante: credit.Enc_num_comprobante,
                  Enc_total_compra: credit.Enc_total_compra,
                  Fecha_compra: credit.Fecha_compra,
                  Per_Nombre: credit.Per_Nombre,
                  dcredito: credit.dcredito,
                  dias_mas: credit.dias_mas,
                  status: credit.Enc_Estado,
                  status_credito: credit.status_credito,
                  Id: credit.Ecb_Id,
                  Estado: credit.status_credito == 0 ? "Saldado" : "Con saldo pendiente", //Estado de la venta
                  title: credit.CP_Razon_social,
                  btn_details: true,
                  icon_btn_details: "mdi-eye-settings"
                });
              });
              this.data.forEach( element => {
                this.datageneral.push(element);
              })
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_credits.message);
          }
          this.excel.data = this.data;
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
          this.encabezado_credito = {
            ID: row.Ecb_Id,
            Nit: row.CP_Nit,
            "Razon social": row.CP_Razon_social,
            "Documento vendedor": row.Dcc_Aumento_plazo,
            "Número comprobante": row.Enc_num_comprobante,
            "Dias de crédito": row.dcredito,
            "Dias de más": row.dias_mas,
            "Total abonado": row.tota_abonos,
            "Total compra": row.Enc_total_compra,
            "Nombre vendedor": row.Per_Nombre,
            "Fecha compra": row.Fecha_compra,
            "Estado del credito": row.Estado,
            Observaciones: row.Dcc_Observaciones
          };
          const res_det = await this.getDetailCredProvider(row.Ecb_Id).then(
            res => {
              return res.data;
            }
          );
          // console.log({
          //   msg: "Respuesta get detalle crédito",
          //   data: res_det
          // });
          this.data_historico.length = 0;
          if (res_det.ok) {
            if (res_det.result) {
              res_det.data.forEach(det => {
                this.data_historico.push(det);
              });
            } else {
              this.$q.notify({
                message: "Sin abonos realizados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_det.message);
          }
          const res_deta = await this.getDetailSales(row.Ecb_Id).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get detalle venta",
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
      this.$q.dialog({
        title: "Verificación de identidad",
        message: "Ingrese su contraseña",
        prompt: {
          model: "",
          type: "password" // optional
        },
        cancel: true,
        persistent: true
      }).onOk(async data => {
        let password = this.aesEncrypt(data);
        if (password == this.data_user.Usu_Clave_verificacion) {
          if(Number(this.det_credit.Dcc_Valor_abono) <= Number(this.credit_selected.Enc_total_compra - this.credit_selected.tota_abonos)){
            this.$q.loading.show({
              message: "Realizando abono, por favor espere..."
            });
            setTimeout(async () => {
              try {
                this.det_credit.base = process.env.__BASE__;
                this.det_credit.Enc_Id = this.credit_selected.Ecb_Id;
                this.det_credit.Dcc_User_control = this.data_user.Per_Num_documento;
                const res_abono = await this.saveAbonoCredit(this.det_credit).then(res => {
                  return res.data;
                });
                // console.log({
                //   msg: "Respuesta insert update abono",
                //   data: res_abono
                // });
                if (!res_abono.ok) {
                  throw new Error(res_abono.message);
                }
                if((this.credit_selected.tota_abonos + Number(this.det_credit.Dcc_Valor_abono)) == this.credit_selected.Enc_total_compra){
                  this.credit_selected.base = process.env.__BASE__;
                  this.credit_selected.Enc_Estado = 1;
                  this.credit_selected.Enc_User_control = this.data_user.Per_Num_documento;
                  const res_upd_credit = await this.insertEncEntry(this.credit_selected).then( res => {
                    return res.data;
                  });
                  console.log({
                    msg: 'respuesta update credito',
                    data: res_upd_credit
                  });
                  if(!res_upd_credit.ok){
                    throw new Erro(res_upd_credit.message);
                  }
                }
                let notificacion = {
                  nt_id: null,
                  nt_titulo: 'Abono realizado',
                  nt_descripcion: `Se ha ralizado un abono a la cuenta del proveedor ${this.credit_selected.CP_Razon_social}, Crédito No. ${this.credit_selected.Ecb_Id}`,
                  nt_usuario_notificado: this.data_user.Per_Num_documento,
                  nt_estado: 1,
                  nt_usuario_control: this.data_user.Per_Num_documento,
                  base: process.env.__BASE__,
                }
                const res_in_not = await this.PostInsertNotification(notificacion).then( res => {
                  return res.data;
                }).catch( e => {
                  throw new Error(e)
                })
                // console.log({
                //   msg: 'Respuesta insert notificación',
                //   data: res_in_not
                // })
                this.$emit('reloadNotifications')
                this.$q.notify({
                  message: "Abono realizado",
                  type: "positive"
                });
                this.onReset();
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
              message: 'El valor a abonar es mayor al saldo pendiente por pagar',
              type: 'warning'
            })
          }
        } else {
          this.$q.notify({
            message: "Las contraseñas no coinciden",
            type: "warning"
          });
        }
      })
    },
    onReset() {
      this.det_credit = {
        base: null,
        Dcc_Id: null,
        Enc_Id: null,
        Dcc_Valor_abono: null,
        Dcc_Observaciones: null,
        Dcc_Aumento_plazo: null,
        Dcc_User_control: null,
      };
      this.dialog_detalle_credit = false;
      setTimeout(() => {
        this.getData();
      }, 400)
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
p {
  font-size: 55px;
}
</style>
