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
        <q-tab name="provider" label="proveedores" icon="person_add" />
        <q-tab
          name="add_provider"
          :label="!provider_edit ? 'Agregar proveedor' : 'Editar proveedor'"
          icon="people"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="provider">
          <q-form @submit="searchProvider" class="q-gutter-md">
            <div class="row q-gutter-y-md">
              <div class="col-xs-12 col-md-3 col-lg-3 q-px-md">
                <q-input
                  v-model="nit_provider"
                  type="text"
                  hint="Id proveedor"
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
            class="q-mt-md"
            proptitle="Proveedores"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :proppdf="optionpdf"
            :propbtns="btns"
            :propexcel="excel"
            :proppagination="initial_pagination"
            :propactions="true"
            @onedit="editProvider"
            @tostatus="openDialogStatus"
            v-if="rendercomponent"
          />
          <!-- Dialogo para activar o inactivar una meta -->
          <component-dialog-enable
            :dialog="enable_diable"
            :options_dialog="options_status"
            @cancel="enable_diable = false"
            @changeStatus="changeStatus"
          />
        </q-tab-panel>

        <q-tab-panel name="add_provider">
          <component-add-provider @reload="reload" :edit_data="provider_edit" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddProvider from "components/Purchase/ComponentAddProvider";
import componentTable from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapState } from "vuex";
export default {
  name: "Categories",
  components: {
    ComponentAddProvider,
    componentTable,
    ComponentDialogEnable
  },
  data() {
    return {
      tab: "provider",
      columns: [
        {
          name: "Tp_Desc_corta",
          align: "center",
          label: "Tipo documento",
          sortable: true,
          field: "Tp_Desc_corta"
        },
        {
          name: "CP_Nit",
          align: "center",
          label: "NIT",
          sortable: true,
          field: "CP_Nit"
        },
        {
          name: "CP_Digito_verificacion",
          align: "center",
          label: "Digito verificación",
          sortable: true,
          field: "CP_Digito_verificacion"
        },
        {
          name: "name_tp",
          align: "center",
          label: "Tipo cliente",
          sortable: true,
          field: "name_tp"
        },
        {
          name: "CP_Razon_social",
          align: "center",
          label: "Razón social",
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
          name: "CP_Fecha_control",
          align: "center",
          label: "Fecha creación",
          sortable: true,
          field: "CP_Fecha_control"
        },
        {
          name: "name_estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "name_estado"
        }
      ],
      excel: {
        columns: [
          {
            label: "Digito verificación",
            field: "CP_Digito_verificacion"
          },
          {
            label: "Fecha creación",
            field: "CP_Fecha_control"
          },
          {
            label: "NIT",
            field: "CP_Nit"
          },
          {
            label: "Razon social",
            field: "CP_Razon_social"
          },
          {
            label: "Teléfono",
            field: "CP_Telefono"
          },
          {
            label: "Dirección",
            field: "CP_Direccion"
          },
          {
            label: "Email",
            field: "CP_Email"
          },
          {
            label: "Sitio web",
            field: "CP_Urlweb"
          },
          {
            label: "Ciudad",
            field: "Ciu_Nombre"
          },
          {
            label: "Documento creador",
            field: "CP_User_control"
          },
          {
            label: "Creado por",
            field: "Per_Nombre"
          },
          {
            label: "Tipo documento",
            field: "Tp_Desc_corta"
          },
          {
            label: "Estado",
            field: "name_estado"
          },
          {
            label: "Tipo cliente",
            field: "name_tp"
          }
        ],
        data: [],
        title: "Proveedores"
      },
      data: [],
      datageneral: [],
      rendercomponent: true,
      filter_pendientes: false,
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
        btn_export_pdf: false,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      },
      nit_provider: null,
      provider_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      }
    };
  },
  watch: {
    tab(value) {
      if (value == "provider") {
        this.provider_edit = null;
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
    ...mapActions("shopping", [
      "getProviders",
      "searchProviders",
      "addProviders"
    ]),

    async getData() {
      this.$q.loading.show({
        message: "Obteniendo proveedores, por favor espere..."
      });
      try {
        const res_provider = await this.getProviders().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get proveedor',
        //   data: res_provider
        // });
        if (res_provider.ok) {
          if (res_provider.result) {
            this.data.length = 0;
            this.datageneral.length = 0;
            res_provider.data.forEach(provider => {
              if (provider.Tp_Id == 0) {
                this.data.push({
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
                  title: provider.CP_Razon_social,
                  btn_edit: true,
                  icon_btn_details: "visibility",
                  btn_details: false,
                  icon_btn_edit: "edit",
                  status: provider.CP_Estado,
                  btn_status: true,
                  icon_btn_status: "power_settings_new"
                });
                this.datageneral.push({
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
                  title: provider.CP_Razon_social,
                  btn_edit: true,
                  icon_btn_details: "visibility",
                  btn_details: false,
                  icon_btn_edit: "edit",
                  status: provider.CP_Estado,
                  btn_status: true,
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
    },

    async searchProvider() {
      this.$q.loading.show({
        message: "Buscando proveedor, por favor espere..."
      });
      try {
        const res_provider = await this.searchProviders(this.nit_provider).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: 'Respuesta get proveedor',
        //   data: res_provider
        // });
        if (res_provider.ok) {
          if (res_provider.result) {
            this.data.length = 0;
            this.data.push({
              CP_Digito_verificacion: res_provider.data.CP_Digito_verificacion,
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
              title: res_provider.data.CP_Razon_social,
              status: res_provider.data.CP_Estado,
              btn_edit: true,
              icon_btn_details: "visibility",
              btn_details: false,
              icon_btn_edit: "edit",
              btn_status: true,
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
    },

    editProvider(row) {
      this.provider_edit = row;
      this.tab = "add_provider";
    },
    reload() {
      this.tab = "provider";
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
      this.provider_edit = {
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
        CP_User_control: this.data_user.Per_Num_documento
      };
      this.options_status.title =
        row.CP_Estado == 1 ? "Desactivar proveedor" : "Activar proveedor";
      this.options_status.msg =
        row.CP_Estado == 1
          ? "Está desactivando este proveedor, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?"
          : "Está activando este proveedor, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarlo?";
      this.enable_diable = true;
    },
    async changeStatus() {
      this.$q.loading.show({
        message: "Estamos cambiando el estado del cliente, por favor espere..."
      });
      try {
        this.provider_edit.base = process.env.__BASE__;

        const res_update = await this.addProviders(this.provider_edit).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: "Respuesta insert update proveedor",
        //   data: res_update
        // });
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
    }
  }
};
</script>

<style scoped></style>
