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
        <q-tab name="warranties" label="Garantias" icon="task_alt" />
        <q-tab name="ouputs" label="Salidas" icon="task_alt" />
        <q-tab name="add_warranties" label="Agregar salida" icon="add_task" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="warranties">
          <component-table
            class="q-mt-md"
            proptitle="Garantías"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :propexcel="excel"
            :propbtns="btns"
            :proppagination="initial_pagination"
            @onedit="viewDetailGarantia"
          />
        </q-tab-panel>

        <q-tab-panel name="ouputs">
          <component-table
            class="q-mt-md"
            proptitle="Salidas"
            :propdata="data_salidas"
            :propcolumns="columns_salidas"
            :propgrid="true"
            :propflat="true"
            :propexcel="excel_salidas"
            :propbtns="btns"
            :proppagination="initial_pagination"
            @ondetails="viewDetailSalida"
            @onrange="getSalidasProveedorRange"
            :propactions="true"
          />
          <q-dialog v-model="detail_salida_pro" persistent>
            <q-card style="width: 700px; max-width: 80vw">
              <q-bar dark class="bg-primary text-white">
                <div class="col text-center text-weight-bold">
                  Detalle de la salida
                </div>
                <q-btn flat round icon="close" color="white" v-close-popup />
              </q-bar>
              <q-card-section class="row q-gutter-y-md">
                <div
                  class="col-xs-12 col-sm-6 col-md-3 q-px-xs"
                  v-for="(value, key) in salida_selecte"
                  :key="key"
                >
                  <q-field :hint="key" stack-label dense>
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
              </q-card-section>
              <q-card-section>
                <q-table
                  title="Productos"
                  :data="data_products"
                  :columns="columns_products"
                  row-key="name"
                  flat
                />
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-tab-panel>

        <q-tab-panel name="add_warranties">
          <component-add-warranties @reload="reload" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddWarranties from "components/Purchase/ComponentAddWarranties";
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from "vuex";
export default {
  name: "DeparturesGuarantees",
  components: {
    ComponentAddWarranties,
    componentTable
  },
  data() {
    return {
      tab: "warranties",
      columns: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID articulo",
          sortable: true,
          field: "Art_Id"
        },
        {
          name: "Art_Nombre",
          align: "center",
          label: "Nombre articulo",
          sortable: true,
          field: "Art_Nombre"
        },
        {
          name: "Mov_Id",
          align: "center",
          label: "ID movimiento",
          sortable: true,
          field: "Mov_Id"
        },
        {
          name: "Mov_Descripcion",
          align: "center",
          label: "Descripción movimiento",
          sortable: true,
          field: "Mov_Descripcion"
        },
        {
          name: "Sg_Cant",
          align: "center",
          label: "Cantidad",
          sortable: true,
          field: "Sg_Cant"
        }
      ],
      excel: {
        columns: [
          {
            label: "ID articulo",
            field: "Art_Id"
          },
          {
            label: "Nombre articulo",
            field: "Art_Nombre"
          },
          {
            label: "ID movimiento",
            field: "Mov_Id"
          },
          {
            label: "Descripción movimiento",
            field: "Mov_Descripcion"
          },
          {
            label: "Cantidad",
            field: "Sg_Cant"
          }
        ],
        data: [],
        title: "Salidas proveedor"
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
      data_salidas: [],
      columns_salidas: [
        {
          name: "Id",
          align: "center",
          label: "Salida No.",
          sortable: true,
          field: "Id"
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
          label: "Razón social",
          sortable: true,
          field: "CP_Razon_social"
        },
        {
          name: "Esp_Cedula_Autoriza",
          align: "center",
          label: "Documento autoriza",
          sortable: true,
          field: "Esp_Cedula_Autoriza"
        },
        {
          name: "Esp_Autoriza_cliente",
          align: "center",
          label: "Cliente autoriza",
          sortable: true,
          field: "Esp_Autoriza_cliente"
        },
        {
          name: "Esp_Nombre_Recibe",
          align: "center",
          label: "Cliente recibe",
          sortable: true,
          field: "Esp_Nombre_Recibe"
        },
        {
          name: "Esp_Observacion",
          align: "center",
          label: "Observación",
          sortable: true,
          field: "Esp_Observacion"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Realizado por",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "Esp_User_control",
          align: "center",
          label: "Documento",
          sortable: true,
          field: "Esp_User_control"
        },
        {
          name: "Esp_Fecha_control",
          align: "center",
          label: "Fecha salida",
          sortable: true,
          field: "Esp_Fecha_control"
        }
      ],
      excel_salidas: {
        columns: [
          {
            label: "Salida No.",
            field: "Id"
          },
          {
            label: "NIT",
            field: "CP_Nit"
          },
          {
            label: "Razón social",
            field: "CP_Razon_social"
          },
          {
            label: "Documento autoriza",
            field: "Esp_Cedula_Autoriza"
          },
          {
            label: "Cliente autoriza",
            field: "Esp_Autoriza_cliente"
          },
          {
            label: "Cliente recibe",
            field: "Esp_Nombre_Recibe"
          },
          {
            label: "Observación",
            field: "Esp_Observacion"
          },
          {
            label: "Realizado por",
            field: "Per_Nombre"
          },
          {
            label: "Documento",
            field: "Esp_User_control"
          },
          {
            label: "Fecha salida",
            field: "Esp_Fecha_control"
          }
        ],
        data: [],
        title: "Salidas proveedor"
      },
      salida_selecte: null,
      detail_salida_pro: false,
      columns_products: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID Artículo",
          field: "Art_Id"
        },
        {
          name: "Art_Nombre",
          align: "center",
          label: "Nombre artículo",
          field: "Art_Nombre"
        },
        {
          name: "Dsp_Cant",
          align: "center",
          label: "Cantidad",
          field: "Dsp_Cant"
        },
        {
          name: "Dsp_Observacion",
          align: "center",
          label: "Observación",
          field: "Dsp_Observacion"
        }
      ],
      data_products: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("shopping", [
      "getWaraniesOutput",
      "getOuputProvider",
      "getOuputProviderRange",
      "getDetailOuputProvider"
    ]),
    async getData() {
      this.$q.loading.show({
        message: "Obteniendo salidas, por favor espere..."
      });
      try {
        const res_waranties = await this.getWaraniesOutput().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get garantias',
        //   data: res_waranties
        // });
        if (res_waranties.ok) {
          if (res_waranties.result) {
            this.data.length = 0;
            res_waranties.data.forEach(warranty => {
              this.data.push({
                Art_Id: warranty.Art_Id,
                Art_Nombre: warranty.Art_Nombre,
                Mov_Descripcion: warranty.Mov_Descripcion,
                Mov_Id: warranty.Mov_Id,
                Sg_Cant: warranty.Sg_Cant,
                title: warranty.Art_Nombre,
                btn_edit: true,
                icon_btn_details: "visibility",
                btn_details: true,
                icon_btn_edit: "edit"
              });
            });
            this.excel.data = this.data;
          } else {
            this.$q.notify({
              message: "No hay salidas a garantía",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_waranties.message);
        }

        const res_ouputs = await this.getOuputProvider().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get garantias',
        //   data: res_ouputs
        // });
        if (res_ouputs.ok) {
          if (res_ouputs.result) {
            this.data_salidas.length = 0;
            res_ouputs.data.forEach(salida => {
              this.data_salidas.push({
                Id: salida.id,
                CP_Nit: salida.CP_Nit,
                CP_Razon_social: salida.CP_Razon_social,
                Esp_Autoriza_cliente: salida.Esp_Autoriza_cliente,
                Esp_Cedula_Autoriza: salida.Esp_Cedula_Autoriza,
                Esp_Nombre_Recibe: salida.Esp_Nombre_Recibe,
                Esp_Observacion: salida.Esp_Observacion,
                Esp_User_control: salida.Esp_User_control,
                Per_Nombre: salida.Per_Nombre,
                Esp_Fecha_control: salida.Esp_Fecha_control,
                title: salida.CP_Razon_social,
                btn_details: true,
                icon_btn_details: "visibility"
              });
            });
            this.excel_salidas.data = this.data_salidas;
          } else {
            this.$q.notify({
              message: "No hay salidas",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_ouputs.message);
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
    async viewDetailGarantia() {
      this.$q.loading.show({
        message: "Obteniendo detalle, por favor espere.."
      });
      try {
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
    async getSalidasProveedorRange(data) {
      this.$q.loading.show({
        message:
          "Obteniendo salidas en el rango seleccionado, por favor espere.."
      });
      try {
        const res_data = await this.getOuputProviderRange(range).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get salidas por rango",
        //   data: res_data
        // });
        if (res_data.ok) {
          if (res_data.result) {
            this.data_salidas.length = 0;
            res_data.data.forEach(salida => {
              this.data_salidas.push({
                Id: salida.id,
                CP_Nit: salida.CP_Nit,
                CP_Razon_social: salida.CP_Razon_social,
                Esp_Autoriza_cliente: salida.Esp_Autoriza_cliente,
                Esp_Cedula_Autoriza: salida.Esp_Cedula_Autoriza,
                Esp_Nombre_Recibe: salida.Esp_Nombre_Recibe,
                Esp_Observacion: salida.Esp_Observacion,
                Esp_User_control: salida.Esp_User_control,
                Per_Nombre: salida.Per_Nombre,
                Esp_Fecha_control: salida.Esp_Fecha_control,
                title: salida.CP_Razon_social,
                btn_details: true,
                icon_btn_details: "visibility"
              });
            });
            this.excel_salidas.data = this.data_salidas;
          } else {
            this.$q.notify({
              message: "No hay salidas a proveedor o almacen",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_data.message);
        }
      } catch (e) {
      } finally {
        this.$q.loading.hide();
      }
    },
    async viewDetailSalida(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle, por favor espere.."
      });
      try {
        this.salida_selecte = {
          "Salida No.": row.Id,
          NIT: row.CP_Nit,
          "Razón social": row.CP_Razon_social,
          "Documento autoriza": row.Esp_Cedula_Autoriza,
          "Cliente autoriza": row.Esp_Autoriza_cliente,
          "Cliente recibe": row.Esp_Nombre_Recibe,
          Observación: row.Esp_Observacion,
          "Realizado por": row.Per_Nombre,
          Documento: row.Esp_User_control,
          "Fecha salida": row.Esp_Fecha_control
        };
        const res_det = await this.getDetailOuputProvider(row.Id).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get detalle salida',
        //   data: res_det
        // });
        if (res_det.ok) {
          if (res_det.result) {
            this.data_products.length = 0;
            res_det.data.forEach(salida => {
              this.data_products.push(salida);
            });
          } else {
            this.$q.notify({
              message: "No hay salidas a proveedor o almacen",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_det.message);
        }
        this.detail_salida_pro = true;
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
      this.tab = "warranties";
      setTimeout(this.getData(), 200);
    }
  }
};
</script>

<style scoped></style>
