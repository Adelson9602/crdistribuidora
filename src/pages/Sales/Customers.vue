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
        <q-tab name="clients" label="Clientes" icon="groups" />
        <q-tab
          name="add_clients"
          :label="!cliente_edit ? 'Agregar cliente' : 'Editar cliente'"
          icon="person_add"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="clients">
          <q-form @submit="searchProvider" class="q-gutter-md">
            <div class="row q-gutter-y-md">
              <div class="col-xs-12 col-md-3 col-lg-3 q-px-md">
                <q-input
                  v-model="nit_cliente"
                  type="text"
                  hint="Id Cliente"
                  mask="###############"
                  counter
                />
              </div>
              <div class="col-xs-12 col-md-3 col-lg-2 q-px-md row">
                <q-btn
                  label="Buscar"
                  type="submit"
                  icon="search"
                  color="primary"
                  class="self-center"
                />
              </div>
            </div>
          </q-form>
          <component-table
            proptitle="Clientes"
            :propgrid="true"
            :propflat="true"
            :propdata="data"
            :propcolumns="columns"
            :proppdf="optionpdf"
            :propbtns="btns"
            :proppagination="initial_pagination"
            :propactions="true"
            @onedit="editEntry"
            @tostatus="openDialogStatus"
          />
          <!-- Dialogo para activar o inactivar una meta -->
          <component-dialog-enable
            :dialog="enable_diable"
            :options_dialog="options_status"
            @cancel="enable_diable = false"
            @changeStatus="changeStatus"
          />
        </q-tab-panel>

        <q-tab-panel name="add_clients">
          <component-add-client @reload="reload" :edit_data="cliente_edit" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentTable from "components/Generals/ComponentTable";
import ComponentAddClient from "components/Sales/ComponentAddClient";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapState } from "vuex";
export default {
  name: "SaleswithoutBalance",
  components: {
    ComponentTable,
    ComponentAddClient,
    ComponentDialogEnable
  },
  data() {
    return {
      tab: "clients",
      columns: [
        {
          name: "CP_Digito_verificacion",
          align: "center",
          label: "Digito verificación",
          sortable: true,
          field: "CP_Digito_verificacion"
        },
        {
          name: "CP_Fecha_control",
          align: "center",
          label: "Fecha creación",
          sortable: true,
          field: "CP_Fecha_control"
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
          name: "CP_Telefono",
          align: "center",
          label: "Teléfono",
          sortable: true,
          field: "CP_Telefono"
        },
        {
          name: "CP_Direccion",
          align: "center",
          label: "Dirección",
          sortable: true,
          field: "CP_Direccion"
        },
        {
          name: "CP_Email",
          align: "center",
          label: "Email",
          sortable: true,
          field: "CP_Email"
        },
        {
          name: "CP_Urlweb",
          align: "center",
          label: "Sitio web",
          sortable: true,
          field: "CP_Urlweb"
        },
        {
          name: "Ciu_Nombre",
          align: "center",
          label: "Ciudad",
          sortable: true,
          field: "Ciu_Nombre"
        },
        {
          name: "CP_User_control",
          align: "center",
          label: "Documento creador",
          sortable: true,
          field: "CP_User_control"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Creado por",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "Tp_Desc_corta",
          align: "center",
          label: "Tipo documento",
          sortable: true,
          field: "Tp_Desc_corta"
        },
        {
          name: "name_estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "name_estado"
        },
        {
          name: "name_tp",
          align: "center",
          label: "Tipo cliente",
          sortable: true,
          field: "name_tp"
        }
      ],
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
        range_date: false,
        btn_export_pdf: true,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      },
      nit_cliente: null,
      cliente_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      }
    };
  },
  watch: {
    tab(value) {
      if (value == "clients") {
        this.cliente_edit = null;
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
    ...mapActions("sales", ["getClientes"]),
    ...mapActions("shopping", ["addProviders", "searchProviders"]),

    getData() {
      this.$q.loading.show({
        message: "Obteniendo clientes, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_provider = await this.getClientes().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get proveedor",
          //   data: res_provider
          // });
          if (res_provider.ok) {
            if (res_provider.result) {
              this.data.length = 0;
              res_provider.data.forEach(provider => {
                if (provider.Tp_Id == 1) {
                  this.data.push({
                    base: null,
                    CP_Digito_verificacion: provider.CP_Digito_verificacion,
                    CP_Direccion: provider.CP_Direccion,
                    CP_Email: provider.CP_Email,
                    CP_Estado: provider.CP_Estado,
                    CP_Fecha_control: provider.CP_Fecha_control,
                    CP_Nit: provider.CP_Nit,
                    CP_Razon_social: provider.CP_Razon_social,
                    CP_Telefono: provider.CP_Telefono,
                    CP_Urlweb: provider.CP_Urlweb,
                    CP_User_control: provider.CP_User_control,
                    Ciu_Id: provider.Ciu_Id,
                    Ciu_Nombre: provider.Ciu_Nombre,
                    Per_Nombre: provider.Per_Nombre,
                    Td_Id: provider.Td_Id,
                    Tp_Desc_corta: provider.Tp_Desc_corta,
                    Tp_Id: provider.Tp_Id,
                    name_estado: provider.name_estado,
                    name_tp: provider.name_tp,
                    Id: provider.id,
                    status: provider.CP_Estado,
                    title: provider.CP_Razon_social,
                    btn_edit: true,
                    btn_status: true,
                    icon_btn_details: "visibility",
                    btn_details: false,
                    icon_btn_edit: "edit",
                    icon_btn_status: "power_settings_new"
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
      }, 2000);
    },
    detailsEntry(id) {
      this.$q.loading.show({
        message: "Obteniendo detalle del ingreso, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_detail = await this.getDetailsEntry(id).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get detalle ingreso",
          //   data: res_detail
          // });
          if (res_detail.ok) {
            if (res_detail.result) {
              this.data.length = 0;
              res_detail.data.forEach(ingreso => {
                this.data.push({});
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
    searchProvider() {
      this.$q.loading.show({
        message: "Buscando proveedor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_provider = await this.searchProviders(
            this.nit_cliente
          ).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get proveedor",
          //   data: res_provider
          // });
          if (res_provider.ok) {
            if (res_provider.result) {
              this.data.length = 0;
              this.data.push({
                base: null,
                CP_Digito_verificacion:
                  res_provider.data.CP_Digito_verificacion,
                CP_Direccion: res_provider.data.CP_Direccion,
                CP_Email: res_provider.data.CP_Email,
                CP_Estado: res_provider.data.CP_Estado,
                CP_Fecha_control: res_provider.data.CP_Fecha_control,
                CP_Nit: res_provider.data.CP_Nit,
                CP_Razon_social: res_provider.data.CP_Razon_social,
                CP_Telefono: res_provider.data.CP_Telefono,
                CP_Urlweb: res_provider.data.CP_Urlweb,
                CP_User_control: res_provider.data.CP_User_control,
                Ciu_Id: res_provider.data.Ciu_Id,
                Ciu_Nombre: res_provider.data.Ciu_Nombre,
                Per_Nombre: res_provider.data.Per_Nombre,
                Td_Id: res_provider.data.Td_Id,
                Tp_Desc_corta: res_provider.data.Tp_Desc_corta,
                Tp_Id: res_provider.data.Tp_Id,
                name_estado: res_provider.data.name_estado,
                name_tp: res_provider.data.name_tp,
                Id: res_provider.data.id,
                status: res_provider.data.CP_Estado,
                title: res_provider.data.CP_Razon_social,
                btn_edit: true,
                btn_status: true,
                icon_btn_details: "visibility",
                btn_details: false,
                icon_btn_edit: "edit",
                icon_btn_status: "power_settings_new"
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
      }, 2000);
    },
    editEntry(row) {
      this.cliente_edit = row;
      this.tab = "add_clients";
    },
    reload() {
      this.tab = "clients";
      this.edit_form = false;
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    openDialogStatus(row) {
     
      // Buscamos la categoria del producto asignada
      // let categoria = categorias.find( categoria => categoria.label.toLowerCase() == row.Cat_Nombre.toLowerCase());
      // Buscamos la unidad de medida asiganada
      // let um = ums.find( um => um.prefijo.toLowerCase() == row.Prefijo.toLowerCase())
      this.cliente_edit = {
        base: null,
        CP_Nit: row.CP_Nit,
        CP_Razon_social: row.CP_Razon_social,
        CP_Digito_verificacion: row.CP_Digito_verificacion,
        Td_Id: row.Td_Id,
        Tp_Id: row.Tp_Id,
        CP_Direccion: row.CP_Direccion,
        CP_Email: row.CP_Email,
        CP_Urlweb: row.CP_Urlweb,
        CP_Telefono: row.CP_Telefono,
        Ciu_Id: row.Ciu_Id,
        CP_Estado: row.CP_Estado == 1 ? 0 : 1,
        CP_User_control: this.data_user.Per_Num_documento,
      };
      this.options_status.title =
        row.CP_Estado == 1 ? "Desactivar cliente" : "Activar cliente";
      this.options_status.msg =
        row.CP_Estado == 1
          ? "Está desactivando este cliente, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?"
          : "Está activando este cliente, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarlo?";
      this.enable_diable = true;
    },
    changeStatus() {
      this.$q.loading.show({
        message: "Estamos cambiando el estado del cliente, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.cliente_edit.base = process.env.__BASE__;
          console.log(this.cliente_edit);
          const res_update = await this.addProviders(this.cliente_edit).then(
            res => {
              return res.data;
            }
          );
          console.log({
            msg: "Respuesta insert update cliente",
            data: res_update
          });
          if (res_update.ok) {
            if (res_update.data.affectedRows) {
              this.$q.notify({
                message: "Estado actualizado",
                type: "positive"
              });
              setTimeout(() => {
                this.enable_diable = false;
                this.getData();
              }, 500);
            } else {
              this.$q.notify({
                message: "No se actualizó el estado",
                type: "warning"
              });
            }
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
      }, 2000);
    }
  }
};
</script>
