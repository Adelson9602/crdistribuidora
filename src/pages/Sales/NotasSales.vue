<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <component-table
        class="q-mt-md"
        proptitle="Ventas"
        :propdata="data"
        :propcolumns="columns"
        :propgrid="true"
        :propflat="true"
        :propexcel="excel"
        :proppdf="optionpdf"
        :propbtns="btns"
        :proppagination="initial_pagination"
        :propactions="true"
        @range="getSalesByRange"
        @ondetails="detatilSale"
        @onpdf="generatePdf"
      >
        <template v-slot:input_one>
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
        </template>
      </component-table>
      <!-- Dialogo para ver el detalle de la venta -->
      <q-dialog v-model="dialog_detail" persistent full-height full-width>
        <q-card>
          <q-bar dark class="bg-primary text-white">
            <div class="col text-center text-weight-bold">
              Detalle de la venta
            </div>
            <q-btn text-color="white" icon="close" round flat v-close-popup />
          </q-bar>
          <q-card-section>
            <q-tabs
              v-model="tab_detail"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab
                class="text-purple"
                name="notas_credito"
                icon="mail"
                label="Notas crédito"
              />
              <q-tab
                class="text-orange"
                name="notas_debito"
                icon="alarm"
                label="Notas débito"
              />
            </q-tabs>

            <q-tab-panels v-model="tab_detail" animated>
              <q-tab-panel name="notas_credito">
                <q-list bordered separator>
                  <q-expansion-item
                    expand-separator
                    icon="fiber_manual_record"
                    :label="
                      `Nota crédito No. ${data.encabezado['Nota crédito N°']}`
                    "
                    :caption="`${data.encabezado['Fecha generada']}`"
                    v-for="(data, index) in detail_nota_credito"
                    :key="index"
                  >
                    <q-card>
                      <q-card-section>
                        <!-- Encabezado -->
                        <div class="row">
                          <div
                            class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-sm"
                            v-for="(value, index) in data.encabezado"
                            :key="index"
                          >
                            <!-- Items para entregados -->
                            <q-field :hint="index" stack-label dense>
                              <template v-slot:control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >
                                  {{ value }}
                                </div>
                              </template>
                            </q-field>
                          </div>
                        </div>
                        <q-table
                          title="Productos"
                          :data="data.detalle"
                          :columns="columns_products"
                          flat
                          class="q-mt-md"
                        />
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </q-tab-panel>
              <q-tab-panel name="notas_debito">
                <q-list bordered separator>
                  <q-expansion-item
                    expand-separator
                    icon="fiber_manual_record"
                    :label="
                      `Nota débito No. ${data.encabezado['Nota débito N°']}`
                    "
                    :caption="`${data.encabezado['Fecha generada']}`"
                    v-for="(data, index) in detail_nota_debito"
                    :key="index"
                  >
                    <q-card>
                      <q-card-section>
                        <!-- Encabezado -->
                        <div class="row">
                          <div
                            class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-sm"
                            v-for="(value, index) in data.encabezado"
                            :key="index"
                          >
                            <!-- Items para entregados -->
                            <q-field :hint="index" stack-label dense>
                              <template v-slot:control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >
                                  {{ value }}
                                </div>
                              </template>
                            </q-field>
                          </div>
                        </div>
                        <q-table
                          title="Productos"
                          :data="data.detalle"
                          :columns="columns_products"
                          flat
                          class="q-mt-md"
                        />
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import componentTable from "components/Generals/ComponentTable";
import ComponentAddNoteDebit from "components/Sales/ComponentAddNoteDebit";
import ComponentAddNoteCredit from "src/components/Sales/ComponentAddNoteCredit";
import { mapActions } from "vuex";
import jsPDF from "jspdf";
import "jspdf-autotable";
let all_clients = []; //Contiene todos los clientes
export default {
  name: "DeparturesGuarantees",
  components: {
    componentTable,
    ComponentAddNoteDebit,
    ComponentAddNoteCredit
  },
  data() {
    return {
      tab_detail: "notas_credito",
      columns: [
        {
          name: "Ev_Id",
          align: "center",
          label: "Venta N°",
          sortable: true,
          field: "Ev_Id"
        },
        {
          name: "CP_Nit",
          align: "center",
          label: "NIT",
          sortable: true,
          field: "CP_Nit"
        },
        {
          name: "Ev_Des_gen_venta",
          align: "center",
          label: "Descuento general venta",
          sortable: true,
          field: "Ev_Des_gen_venta"
        },
        {
          name: "Ev_Des_total_art",
          align: "center",
          label: "Descuento total artículo",
          sortable: true,
          field: "Ev_Des_total_art"
        },
        {
          name: "Ev_Impuesto",
          align: "center",
          label: "Impuesto",
          sortable: true,
          field: "Ev_Impuesto"
        },
        {
          name: "Ev_Subtotal",
          align: "center",
          label: "Subtotal",
          sortable: true,
          field: "Ev_Subtotal"
        },
        {
          name: "Ev_Total_venta",
          align: "center",
          label: "Venta total",
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
          name: "name_qautorizqa",
          align: "center",
          label: "Autoriza garantía",
          sortable: true,
          field: "name_qautorizqa"
        },
        {
          name: "Eg_Quien_autoriza",
          align: "center",
          label: "Documento autoriza garantía",
          sortable: true,
          field: "Eg_Quien_autoriza"
        },
        {
          name: "Eg_Observacion",
          align: "center",
          label: "Observación",
          sortable: true,
          field: "Eg_Observacion"
        },
        {
          name: "Eg_Fecha_control",
          align: "center",
          label: "Fecha garantía",
          sortable: true,
          field: "Eg_Fecha_control"
        },
        {
          name: "Ev_Fecha_venta",
          align: "center",
          label: "Fecha venta",
          sortable: true,
          field: "Ev_Fecha_venta"
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
            label: "Venta N°",
            field: "Ev_Id"
          },
          {
            label: "NIT",
            field: "CP_Nit"
          },
          {
            label: "Descuento general venta",
            field: "Ev_Des_gen_venta"
          },
          {
            label: "Descuento total artículo",
            field: "Ev_Des_total_art"
          },
          {
            label: "Impuesto",
            field: "Ev_Impuesto"
          },
          {
            label: "Subtotal",
            field: "Ev_Subtotal"
          },
          {
            label: "Venta total",
            field: "Ev_Total_venta"
          },
          {
            label: "Días crédito",
            field: "Ev_dias_credito"
          },
          {
            label: "Nombre movil",
            field: "Mov_Descripcion"
          },
          {
            label: "Nombre vendedor",
            field: "Per_Nombre"
          },
          {
            label: "Documento vendedor",
            field: "Per_Num_documento"
          },
          {
            label: "Autoriza garantía",
            field: "name_qautorizqa"
          },
          {
            label: "Documento autoriza garantía",
            field: "Eg_Quien_autoriza"
          },
          {
            label: "Observación",
            field: "Eg_Observacion"
          },
          {
            label: "Fecha garantía",
            field: "Eg_Fecha_control"
          },
          {
            label: "Fecha venta",
            field: "Ev_Fecha_venta"
          },
          {
            label: "Estado",
            field: "Estado"
          }
        ],
        data: [],
        title: "Ventas"
      },
      data: [],
      optionpdf: {
        columns: [
          { header: "Art_Codigo_inv", datakey: "Art_Codigo_inv" },
          { header: "Art_Id", datakey: "Art_Id" },
          { header: "Art_Nombre", datakey: "Art_Nombre" },
          { header: "Mov_Descripcion", datakey: "Mov_Descripcion" },
          { header: "Mov_Id", datakey: "Mov_Id" },
          { header: "Si_Cant", datakey: "Si_Cant" },
          { header: "id", datakey: "id" }
        ],
        data: [],
        orientation: "l", // l => landscape, p => portrait
        title: {
          title: "Inventario actual",
          potitionx: 300,
          potitiony: 30
        },
        styles: {
          font_size: 7
        }
      },
      btns: {
        range_date: true,
        btn_export_pdf: false,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      },
      id_sale: null,
      options_clientes: all_clients,
      client_selected: null, //Cliente seleccionado
      dialog_detail: false,
      encabezado_selected: null,
      encebezado_venta: null,
      data_products: [],
      data_notas_credit: [],
      columns_products: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID Artículo",
          sortable: true,
          field: "Art_Id"
        },
        {
          name: "Art_Nombre",
          align: "center",
          label: "Descripción articulo",
          sortable: true,
          field: "Art_Nombre"
        },
        {
          name: "Dv_Precio_compra",
          align: "center",
          label: "Precio de compra",
          sortable: true,
          field: "Dv_Precio_compra"
        },
        {
          name: "Dv_precio_venta",
          align: "center",
          label: "Precio de venta",
          sortable: true,
          field: "Dv_precio_venta"
        },
        {
          name: "Dv_valor_descuento",
          align: "center",
          label: "Porcentaje descuento",
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
      detail_nota_credito: null,
      detail_nota_debito: null
    };
  },
  created() {
    this.getData();
  },
  watch: {
    async client_selected(value) {
      if (value) {
        this.$q.loading.show({
          message: "Obteniendo ventas del cliente, por favor espere..."
        });
        try {
          const res_client = await this.getSalesClient(value).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get ventas al cliente",
          //   data: res_client
          // });
          if (res_client.ok) {
            if (res_client.result) {
              this.data.length = 0;
              res_client.data.forEach(venta => {
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
            throw new Error(res_client.message);
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
      }
    }
  },
  methods: {
    ...mapActions("sales", [
      "getSearchSales",
      "getSalesRange",
      "getSales",
      "getSales",
      "getSalesClient",
      "getDetailSales",
      "getDetailsGuarantess",
      "getEncNotaCredSingle",
      "getDetNotaCredSingle",
      "getEncNotaDebitoSingle",
      "getDetNotaDebitoSingle"
    ]),
    ...mapActions("shopping", ["getProviders"]),
    async getData() {
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere..."
      });
      try {
        const res_sales = await this.getSales().then(res => {
          return res.data;
        });
        console.log({
          msg: "Respuesta get ventas",
          data: res_sales
        });
        if (res_sales.ok) {
          this.data.length = 0;
          if (res_sales.result) {
            res_sales.data.forEach(venta => {
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
                Tc_Id: venta.Tc_Id,
                Per_Nombre: venta.Per_Nombre,
                Per_Num_documento: venta.Per_Num_documento,
                Estado: venta.name_estado,
                status: venta.Ev_Estado,
                Id: venta.Ev_Id,
                title: venta.CP_Razon_social,
                name_mp: venta.name_mp,
                name_qautorizqa: venta.name_qautorizqa,
                // btn_edit: true,
                // btn_status: true,
                btn_details: true,
                btn_pdf: true,
                // icon_btn_edit: "mdi-pencil",
                // icon_btn_status: "power_settings_new",
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
          throw new Error(res_sales.message);
        }

        const res_provider = await this.getProviders().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get clientes",
        //   data: res_provider
        // });
        if (res_provider.ok) {
          if (res_provider.result) {
            all_clients.length = 0;
            res_provider.data.forEach(cliente => {
              if (cliente.name_tp == "CLIENTE" && cliente.CP_Razon_social) {
                all_clients.push({
                  label: cliente.CP_Razon_social,
                  value: cliente.CP_Nit
                });
              }
            });
          } else {
            this.$q.notify({
              message: res_provider.message,
              type: "warning"
            });
          }
        } else {
          throw new Error(res_provider.message);
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
    },
    async detatilSale(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle de la venta, por favor espere.."
      });
      try {
        this.encabezado_selected = row;
        const res_enc = await this.getEncNotaCredSingle(row.Ev_Id).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta encabezado nota credito",
        //   data: res_enc,
        // });
        this.data_notas_credit.length = 0;
        if (res_enc.ok) {
          let promesas = [];
          res_enc.data.forEach(nota => {
            // console.log(nota)
            let enc_nota = {
              "Nota crédito N°": nota.Ev_nc_Id,
              "Venta N°": nota.Ev_Id,
              NIT: nota.CP_Nit,
              "Razón social": nota.CP_Razon_social,
              "Descuento general venta": nota.Ev_Des_gen_venta,
              "Descuento total articulos": nota.Ev_Des_total_art,
              Impuesto: nota.Ev_Impuesto,
              Subtotal: nota.Ev_Subtotal,
              "Total venta": nota.Ev_Total_venta,
              "Días de crédito": nota.Ev_dias_credito,
              Descripción: nota.Mov_Descripcion,
              "Nombre vendedor": nota.Per_Nombre,
              "Documento vendedor": nota.Per_Num_documento,
              "Autoriza garantía": nota.name_qautorizqa,
              "Quién autoriza": nota.Eg_Quien_autoriza,
              Observación: nota.Eg_Observacion,
              "Fecha venta": nota.Ev_Fecha_venta,
              "Fecha generada": nota.Ev_Fecha_control,
              Estado: nota.Estado
            };
            promesas.push(
              this.getDetNotaCredSingle(row.Ev_Id).then(res => {
                res.data.id = nota.Ev_nc_Id;
                res.data.encabezado = enc_nota;
                return res.data;
              })
            );
          });
          Promise.all(promesas).then(data => {
            let temp_obj = [];
            data.forEach(element => {
              temp_obj.push({
                detalle: element.data,
                encabezado: element.encabezado
              });
            });
            this.detail_nota_credito = temp_obj;
          });
        } else {
          throw new Error(res_enc.message);
        }

        const res_enc_deb = await this.getEncNotaDebitoSingle(row.Ev_Id).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: 'Respuesta encabezado nota débito',
        //   data: res_enc_deb
        // });
        if (res_enc_deb.ok) {
          let promesas = [];
          res_enc_deb.data.forEach(nota => {
            // console.log(nota)
            let enc_nota = {
              "Nota débito N°": nota.Ev_nd_Id,
              "Venta N°": nota.Ev_Id,
              NIT: nota.CP_Nit,
              "Razón social": nota.CP_Razon_social,
              "Descuento general venta": nota.Ev_Des_gen_venta,
              "Descuento total articulos": nota.Ev_Des_total_art,
              Impuesto: nota.Ev_Impuesto,
              Subtotal: nota.Ev_Subtotal,
              "Total venta": nota.Ev_Total_venta,
              "Días de crédito": nota.Ev_dias_credito,
              Descripción: nota.Mov_Descripcion,
              "Nombre vendedor": nota.Per_Nombre,
              "Documento vendedor": nota.Per_Num_documento,
              "Autoriza garantía": nota.name_qautorizqa,
              "Quién autoriza": nota.Eg_Quien_autoriza,
              Observación: nota.Eg_Observacion,
              "Fecha venta": nota.Ev_Fecha_venta,
              "Fecha generada": nota.Ev_Fecha_control,
              Estado: nota.Estado
            };
            promesas.push(
              this.getDetNotaDebitoSingle().then(res => {
                res.data.encabezado = enc_nota;
                res.data.id = nota.Ev_nd_Id;
                return res.data;
              })
            );
          });
          Promise.all(promesas).then(data => {
            let temp_obj = [];
            data.forEach(element => {
              temp_obj.push({
                detalle: element.data,
                encabezado: element.encabezado
              });
            });
            this.detail_nota_debito = temp_obj;
          });
        } else {
          throw new Error(res_enc_deb.message);
        }

        this.dialog_detail = true;
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
    async generatePdf(row) {
      try {
        this.data_products.length = 0;
        const res_deta = await this.getDetailSales(row.Ev_Id).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get detalle venta pdf",
        //   data: res_deta
        // });
        if (res_deta.ok) {
          if (res_deta.result) {
            res_deta.data.forEach((product, index) => {
              this.data_products.push({
                item: parseInt(index + 1),
                Art_Codigo_inv: product.Art_Codigo_inv,
                Art_Descripcion: product.Art_Descripcion,
                Art_Id: product.Art_Id,
                Dv_Cant: product.Dv_Cant,
                Dv_Precio_compra: product.Dv_Precio_compra,
                Dv_precio_venta: product.Dv_precio_venta,
                Dv_valor_descuento: product.Dv_valor_descuento,
                subtotal: product.Dv_valor_descuento * product.Dv_Cant,
                categoria: product.categoria
              });
            });
            // var img = new Image();
            // if (process.env.__CARP__ == "co" || process.env.__CARP__ == "ps") {
            //   img.src = "/images/Logo.png";
            // } else {
            //   img.src = "/images/GYA.png";
            // }

            var doc = new jsPDF("p", "mm", "a4");

            function addWaterMark(doc) {
              var totalPages = doc.internal.getNumberOfPages();

              for (i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                //doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
                doc.setFontSize(38);
                doc.setTextColor(175);
                doc.text(
                  50,
                  doc.internal.pageSize.height - 130,
                  "CR DISTRIBUIDORA",
                  null,
                  45
                );
              }

              return doc;
            }
            doc.autoTable({
              body: this.data_products,
              columns: [
                { header: "Item", dataKey: "item" },
                { header: "Codigo", dataKey: "Art_Codigo_inv" },
                { header: "Descripcion item", dataKey: "Art_Descripcion" },
                { header: "Cant", dataKey: "Dv_Cant" },
                { header: "Valor und", dataKey: "Dv_precio_venta" },
                { header: "Descuento", dataKey: "Dv_valor_descuento" },
                { header: "subtotal", dataKey: "subtotal" }
              ],
              margin: { top: 64, right: 10, left: 10, bottom: 50 },
              styles: {
                overflow: "linebreak",
                fontSize: 7,
                lineWidth: 1,
                lineColor: [150, 152, 154],
                overflowColumns: "linebreak"
              }
            });

            const pageCount = doc.internal.getNumberOfPages();

            for (var i = 1; i <= pageCount; i++) {
              doc.setFontSize(8);

              //MARCO DONDE MUESTRA LA INFORMACION DEL CLIENTE FACTURA Y FECHA
              doc.text(15, 32, "CLIENTE");
              doc.text(15, 37, "Razon social: " + row.CP_Razon_social);
              if (row.contacto) {
                doc.text(15, 42, "Nombre: " + row.contacto);
              } else {
                doc.text(15, 42, "Nombre: ");
              }
              if (row.CP_Direccion) {
                doc.text(15, 47, "Domicilio: " + row.CP_Direccion);
              } else {
                doc.text(15, 47, "Domicilio: ");
              }

              doc.text(15, 52, "Nit o CC: " + row.CP_Nit);
              if (row.CP_Email) {
                doc.text(15, 57, "Email: " + row.CP_Email);
              } else {
                doc.text(15, 57, "Email: ");
              }

              doc.setFontSize(11);
              // doc.setTextColor(255, 215, 0);
              doc.setFillColor("#F7C66D");
              doc.roundedRect(168, 26, 30, 9, 5.5, 5.5, "FD");
              doc.setTextColor("#000000");
              doc.text(172, 32, "Fecha Venta");
              // doc.setTextColor('#000000');
              doc.text(172, 39, row.Ev_Fecha_venta);
              doc.setFillColor("#33ff42");
              doc.roundedRect(168, 41, 30, 9, 5.5, 5.5, "FD");
              doc.text(172, 47, "Remisión");

              doc.text(172, 54, "" + row.Ev_Id);
              doc.rect(10, 24, 190, 40);

              //INICIA EL MARCO DE TODO EL FORMATO
              // Descripcion_trabajo  Observacion_encontrada
              // doc.addImage(img, "PNG", 10, 10, 20, 12, "sicte", "SLOW", 0);
              doc.rect(10, 10, 20, 12);
              doc.setFontSize(16);
              doc.text(60, 17.5, "FORMATO DE VENTA");
              doc.rect(30, 10, 135, 12); //rect(x,y,width, height)
              doc.setFontSize(8);
              doc.text(167, 13.5, "Codigo");
              doc.rect(165, 10, 15, 6);
              doc.text(182, 13.5, "HSEQ-F-002");
              doc.rect(180, 10, 20, 6);
              doc.text(167, 19.5, "Versión");
              doc.rect(165, 16, 15, 6);
              doc.text(190, 19.5, "01");
              doc.rect(180, 16, 20, 6);

              doc.roundedRect(10, 243, 190, 11, 5.5, 5.5, "S");
              doc.text(15, 249, "IMPORTE TOTAL CON LETRA");
              doc.roundedRect(10, 254, 90, 30, 5.5, 5.5, "S");
              doc.line(55, 254, 55, 284, "S");
              doc.text(12, 258, "Firma Autoriza");
              doc.text(57, 258, "Firma Cliente");
              doc.roundedRect(100, 254, 50, 30, 5.5, 5.5, "S");
              doc.line(100, 269, 150, 269, "S");
              doc.text(101, 258, "Total Abonos");
              doc.text(101, 273, "Total Saldos");
              doc.roundedRect(150, 254, 50, 30, 5.5, 5.5, "S");
              doc.text(177, 258, "Totales");
              doc.line(175, 254, 175, 284, "S");
              doc.text(152, 263, "Subtotal"); //Ev_Impuesto, Ev_Subtotal, Ev_Des_total_art, Ev_Descuentog, Ev_Des_gen_venta, Ev_Total_venta,
              doc.text(177, 263, "$ " + row.Ev_Subtotal);
              doc.text(152, 268, "Descuento");
              doc.text(177, 268, "$ " + row.Ev_Des_gen_venta);
              doc.text(152, 273, "igv %");
              doc.text(177, 273, "" + row.Ev_Descuentog);
              doc.text(152, 278, "Total a pagar");
              doc.text(177, 278, "$ " + row.Ev_Total_venta);
              doc.setPage(i);
              //Print Page 1 of 4 for example
              doc.text(
                "Pagina " + String(i) + " de " + String(pageCount),
                210 - 100,
                297 - 10,
                null,
                null,
                "right"
              );
            }
            doc = addWaterMark(doc);
            doc.save("Venta N° " + row.Ev_Id + ".pdf");
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_deta.message);
        }
      } catch (e) {
        console.log(e);
        if (e.message === "Network Error") {
          e = e.message;
        } else if (e.message === "Request failed with status code 404") {
          e = "Error 404 al hacer la petición al servidor";
        } else if (e.message) {
          e = e.message;
        }
        this.$q.notify({
          message: e,
          type: "negative"
        });
      }
    },
    async getSalesByRange(date) {
      this.$q.loading.show({
        message: "Obteniendo ventas, por favor espere..."
      });
      try {
        const res_sales = await this.getSalesRange(date).then(res => {
          return res.data;
        });
        console.log({
          msg: "Respuesta get ventas por rango",
          data: res_sales
        });
        if (res_sales.ok) {
          if (res_sales.result) {
            this.data.length = 0;
            res_sales.data.forEach(cat => {
              this.data.push({
                CP_Nit: sale.CP_Nit,
                contacto: sale.contacto,
                CP_Email: sale.CP_Email,
                CP_Direccion: sale.CP_Direccion,
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
                Tc_Id: venta.Tc_Id,
                Per_Nombre: sale.Per_Nombre,
                Per_Num_documento: sale.Per_Num_documento,
                Estado: venta.name_estado,
                Id: venta.Ev_Id,
                name_mp: sale.name_mp,
                name_qautorizqa: sale.name_qautorizqa,
                status: sale.Ev_Estado,
                btn_edit: true,
                icon_btn_details: "visibility",
                btn_details: true,
                btn_pdf: true,
                icon_btn_edit: "edit"
              });
            });
          } else {
            this.$q.notify({
              message: res_sales.message,
              type: "warning"
            });
          }
        } else {
          throw new Error(res_sales.message);
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
    },
    async searchSale() {
      this.$q.loading.show({
        message: "Buscando venta, por favor espere..."
      });
      try {
        const res_sales = await this.getSearchSales(this.id_sale).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get venta",
        //   data: res_sales
        // });
        if (res_sales.ok) {
          if (res_sales.result) {
            this.data.length = 0;
            res_sales.data.forEach(cat => {
              this.data.push({
                CP_Nit: sale.CP_Nit,
                contacto: sale.contacto,
                CP_Email: sale.CP_Email,
                CP_Direccion: sale.CP_Direccion,
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
                Tc_Id: venta.Tc_Id,
                Per_Nombre: sale.Per_Nombre,
                Per_Num_documento: sale.Per_Num_documento,
                Estado: venta.name_estado,
                name_mp: sale.name_mp,
                name_qautorizqa: sale.name_qautorizqa,
                status: sale.Ev_Estado,
                btn_edit: true,
                icon_btn_details: "visibility",
                btn_details: true,
                icon_btn_edit: "edit"
              });
            });
          } else {
            this.$q.notify({
              message: res_sales.message,
              type: "warning"
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    reload() {
      this.dialog_detail = false;
      this.tab = "sales";
      setTimeout(() => {
        this.getData();
      }, 200);
    },
    // Busca o filtra las opciones del select categorias articulo
    filterClientes(val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(
          () => {
            if (val === "") {
              this.options_clientes = all_clients;
            } else {
              const needle = val.toLowerCase();
              this.options_clientes = all_clients.filter(
                v =>
                  v.label.toLowerCase().indexOf(needle) > -1 ||
                  v.value
                    .toString()
                    .toLowerCase()
                    .indexOf(needle) > -1
              );
            }
          },
          ref => {
            if (val !== "" && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    }
  }
};
</script>

<style scoped>
p {
  font-size: 55px;
}
.alto_tabla {
  height: 450px;
}
</style>
