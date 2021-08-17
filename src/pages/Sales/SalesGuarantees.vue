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
        <q-tab
          name="warranties"
          label="Garantías"
          icon="check_circle_outline"
        />
        <!-- <q-tab name="add_warranties" label="Agregar garantía" icon="add_task" /> -->
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="warranties">
          <component-table
            proptitle="Garantías"
            :propgrid="true"
            :propflat="true"
            :propdata="data"
            :propexcel="excel"
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
          <!-- Dialogo del detalle del traslado -->
          <q-dialog
            v-model="dailog_details"
            persistent
            transition-show="flip-down"
            transition-hide="flip-up"
            full-width
          >
            <q-card>
              <q-form @submit="updateTraslado">
                <q-bar>
                  <div class="text-center">
                    <q-icon name="description" size="sm" color="primary" />
                    Detalle del traslado
                  </div>
                  <q-space />
                  <q-btn dense flat icon="close" v-close-popup />
                </q-bar>
                <q-card-section class="row">
                  <div
                    class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-sm"
                    v-for="(value, index) in encabezado_entrada"
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
                  </div> </q-card-section
                >

               
                <q-card-section>
                  <q-table
                    title="Productos "
                    :data="data_details"
                    row-key="name"
                    flat
                    :pagination="initial_pagination"
                    style="height: 50vh"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          style="text-align: center !important"
                        >
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body-cell="props">
                      <q-td
                        :props="props"
                        style="text-align: center !important"
                      >
                        {{ props.value }}
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-form>
            </q-card>
          </q-dialog>
        </q-tab-panel>

        <q-tab-panel name="add_warranties">
          <component-add-sales-warranties />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import ComponentTable from "components/Generals/ComponentTable";
// import ComponentAddSalesWarranties from "components/Sales/ComponentAddSalesWarranties";
export default {
  name: "SaleswithoutBalance",
  components: {
    ComponentTable,
    // ComponentAddSalesWarranties
  },
  data() {
    return {
      tab: "warranties",
      columns: [
        {
          name: "Eg_Id",
          align: "center",
          label: "ID movimiento",
          sortable: true,
          field: "Eg_Id"
        },
        {
          name: "Eg_Fecha_control",
          align: "center",
          label: "Fecha",
          sortable: true,
          field: "Eg_Fecha_control"
        },
        {
          name: "Ev_Id",
          align: "center",
          label: "ID Venta",
          sortable: true,
          field: "Ev_Id"
        },
        {
          name: "CP_Nit",
          align: "center",
          label: "ID Cliente",
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
          name: "Mov_Descripcion",
          align: "center",
          label: "Movil",
          sortable: true,
          field: "Mov_Descripcion"
        },
        {
          name: "name_integrnate",
          align: "center",
          label: "Vendedor",
          sortable: true,
          field: "name_integrnate"
        },

        {
          name: "Eg_Observacion",
          align: "center",
          label: "Observación",
          sortable: true,
          field: "Eg_Observacion"
        },
        {
          name: "Eg_Quien_autoriza",
          align: "center",
          label: "Autorizado",
          sortable: true,
          field: "Eg_Quien_autoriza"
        },
        {
          name: "name_autoriza",
          align: "center",
          label: "Name Autorizado",
          sortable: true,
          field: "name_autoriza"
        },
        {
          name: "name_estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "name_estado"
        },
        {
          name: "Eg_User_control",
          align: "center",
          label: "Documento control",
          sortable: true,
          field: "Eg_User_control"
        },

        {
          name: "Per_Nombre",
          align: "center",
          label: "Nombre control",
          sortable: true,
          field: "Per_Nombre"
        }
      ],
      excel: {
        columns: [
          {
            label: "ID movimiento",
            field: "Eg_Id"
          },
          {
            label: "Fecha",
            field: "Eg_Fecha_control"
          },
          {
            label: "ID Venta",
            field: "Ev_Id"
          },
          {
            label: "ID Cliente",
            field: "CP_Nit"
          },
          {
            label: "Cliente",
            field: "CP_Razon_social"
          },
          {
            label: "Movil",
            field: "Mov_Descripcion"
          },
          {
            label: "Vendedor",
            field: "name_integrnate"
          },

          {
            label: "Observación",
            field: "Eg_Observacion"
          },
          {
            label: "Autorizado",
            field: "Eg_Quien_autoriza"
          },
          {
            label: "Name Autorizado",
            field: "name_autoriza"
          },
          {
            label: "Estado",
            field: "name_estado"
          },
          {
            label: "Documento control",
            field: "Eg_User_control"
          },

          {
            label: "Nombre control",
            field: "Per_Nombre"
          }
        ],
        data: [],
        title: "Salidas Garantias"
      },
      data: [],
      dailog_details: false, //Dialogo para el detalle de las garantias
      data_details: [], //Productos garantias
      encabezado_entrada: {}, //Encabezado de las garantias formateado para el frontend
      options_state: [
        {
          label: "Pendiente",
          value: 0
        },
        {
          label: "Entregado",
          value: 1
        },
        {
          label: "Descontado",
          value: 2
        },
        {
          label: "Todos",
          value: 3
        }
      ],
      filter_pendientes: 3,
      buscador: {
        input: false,
        label: ""
      },
      btns: {
        range_date: true,
        btn_export_pdf: false,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      }
    };
  },
  created() {
    this.getData();
  },
  watch: {
    filter_pendientes(value) {
      if (value == 3) {
        setTimeout(this.getData(), 300);
      } else {
        setTimeout(this.getDataSelect(value), 300);
      }
    }
  },
  methods: {
    ...mapActions("sales", [
      "getWarranties",
      "getWarrantiesSelect",
      "getDetailsGuarantess",
      "insertUpdateEncGarantia",
      "insertUpdateStcok_garantias"
    ]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo garantias, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_warranties = await this.getWarranties().then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get garantías",
            data: res_warranties
          });
          if (res_warranties.ok) {
            if (res_warranties.result) {
              this.data.length = 0;

              res_warranties.data.forEach(garantia => {
                this.data.push({
                  Eg_Id: garantia.Eg_Id,
                  Ev_Id: garantia.Ev_Id,
                  CP_Nit: garantia.CP_Nit,
                  Mov_Id: garantia.Mov_Id,
                  EvCP_Razon_social_Id: garantia.CP_Razon_social,
                  Mov_Descripcion: garantia.Mov_Descripcion,
                  name_integrnate: garantia.name_integrnate,
                  Eg_Fecha_control: garantia.Eg_Fecha_control,
                  Eg_Observacion: garantia.Eg_Observacion,
                  Eg_Quien_autoriza: garantia.Eg_Quien_autoriza,
                  name_autoriza: garantia.name_autoriza,
                  Eg_estado: garantia.Eg_estado,
                  name_estado: garantia.name_estado,
                  Eg_User_control: garantia.Eg_User_control,
                  Per_Nombre: garantia.Per_Nombre,
                  title: `Movimiento No. ${garantia.Eg_Id}`,
                  btn_edit: false,
                  icon_btn_details: "visibility",
                  btn_details: true,
                  icon_btn_edit: "edit"
                });
              });
            } else {
              this.$q.notify({
                message: res_warranties.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_metas.message);
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
      }, 2000);
    },
    detailsEntry(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle del ingreso, por favor espere..."
      });
      setTimeout(async () => {
        try {
          // Modificamos muestra el encabezado de la entrada
          this.encabezado_entrada = {
            "Movimiento No.": row.Eg_Id,
            "Fecha Movimiento": row.Eg_Fecha_control,
            Nit: row.CP_Nit,
            "Razon social": row.CP_Razon_social,
            "Venta No.": row.Ev_Id,
            "ID Movil": row.Mov_Id,
            Movil: row.Mov_Descripcion,
            "Cc Autoriza": row.Eg_Quien_autoriza,
            Vendedor: row.name_integrnate,
            Observacion: row.Eg_Observacion,
            "Name autoriza": row.name_autoriza,
            Estado: row.name_estado
          };

          const res_detail = await this.getDetailsGuarantess(row.Ev_Id).then(
            res => {
              return res.data;
            }
          );
          console.log({
            msg: "Respuesta get detalle ingreso",
            data: res_detail
          });
          if (res_detail.ok) {
            if (res_detail.result) {
              this.data_details.length = 0;
              res_detail.data.forEach(garantias => {
                this.data_details.push({
                  "Id producto": garantias.Art_Id,
                  "Codigo producto": garantias.Art_Codigo_inv,
                  Descripción: garantias.Art_Nombre,
                  Cantidad: garantias.Dg_Cant
                });
              });
            } else {
              this.$q.notify({
                message: res_detail.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_detail.message);
          }
          this.dailog_details = true;
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
    getDataSelect(value) {
      this.$q.loading.show({
        message: "Obteniendo garantias, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_warranties = await this.getWarrantiesSelect(value).then(
            res => {
              return res.data;
            }
          );
          console.log({
            msg: "Respuesta get garantías",
            data: res_warranties
          });
          if (res_warranties.ok) {
            if (res_warranties.result) {
              this.data.length = 0;

              res_warranties.data.forEach(garantia => {
                this.data.push({
                  Eg_Id: garantia.Eg_Id,
                  Ev_Id: garantia.Ev_Id,
                  CP_Nit: garantia.CP_Nit,
                  Mov_Id: garantia.Mov_Id,
                  EvCP_Razon_social_Id: garantia.CP_Razon_social,
                  Mov_Descripcion: garantia.Mov_Descripcion,
                  name_integrnate: garantia.name_integrnate,
                  Eg_Fecha_control: garantia.Eg_Fecha_control,
                  Eg_Observacion: garantia.Eg_Observacion,
                  Eg_Quien_autoriza: garantia.Eg_Quien_autoriza,
                  name_autoriza: garantia.name_autoriza,
                  Eg_estado: garantia.Eg_estado,
                  name_estado: garantia.name_estado,
                  Eg_User_control: garantia.Eg_User_control,
                  Per_Nombre: garantia.Per_Nombre,
                  title: `Movimiento No. ${garantia.Eg_Id}`,
                  btn_edit: false,
                  icon_btn_details: "visibility",
                  btn_details: true,
                  icon_btn_edit: "edit"
                });
              });
            } else {
              this.$q.notify({
                message: res_warranties.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_metas.message);
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
      }, 2000);
    },
    // Actualizamos el estado del traslado
    updateTraslado() {
      this.$q.loading.show({
        message: "Realizando entrega, por favor espere..."
      });
      this.timer = setTimeout(async () => {
        try {
          let updatagarantia = {
            base: process.env.__BASE__,
            Eg_Id: this.encabezado_entrada["Movimiento No."],
            Eg_Quien_autoriza: this.encabezado_entrada["Cc Autoriza"],
            Ev_Id: this.encabezado_entrada["Venta No."],
            Eg_Observacion: this.encabezado_entrada.Observacion,
            Eg_estado: 1,
            Eg_User_control: this.encabezado_entrada["Cc Autoriza"]
          };
          // console.log(updatagarantia);

          const res_enc = await this.insertUpdateEncGarantia(
            updatagarantia
          ).then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta insert update encabezado traslado",
            data: res_enc
          });
          if (!res_enc.ok) {
            throw new Error(res_enc.message);
          }

          let update_cant = []; // Array de promesas para actulizar las cantidades de los productos a actualizar
          this.data_details.forEach(producto => {
            // Resta los productos de la movil origen
            let sumapro = {
              base: process.env.__BASE__,
              simbol: "-",
              Mov_Id: this.encabezado_entrada["ID Movil"],
              Sg_Cant: producto.Cantidad,
              Art_Id: producto["Id producto"]
            };

            let res_produ = this.insertUpdateStcok_garantias(sumapro).then(
              res => {
                return res.data;
              }
            );
            update_cant.push(res_produ);
            // Suma los productos en la movil destino  Art_Id, Mov_Id, Sg_Cant

            let restapro = {
              base: process.env.__BASE__,
              simbol: "+",
              Mov_Id: 1,
              Sg_Cant: producto.Cantidad,
              Art_Id: producto["Id producto"]
            };

            let suma_produ = this.insertUpdateStcok_garantias(restapro).then(
              res => {
                return res.data;
              }
            );
            update_cant.push(suma_produ);
          });
          // Actualizamos las cantidades si el estado es entregado
          Promise.all(update_cant).then(res_det => {
            res_det.forEach(res => {
              console.log({
                msg: "Respuesta insert update cantidades garantias",
                data: res.data
              });
              if (!res.ok) {
                throw new Error(res.message);
              }
            });
          });
          this.$q.notify({
            message: "Guardado",
            type: "positive"
          });
          this.dailog_details = false;
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
        this.timer = setTimeout(this.getData(), 1000);
      }, 1000);
    }
  }
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
