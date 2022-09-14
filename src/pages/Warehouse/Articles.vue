<template>
  <q-page padding>
    <q-card class="height-card_page">
      <q-tabs
        v-model="tab"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="articles" label="Articulos" icon="inventory_2" />
        <q-tab
          name="create_article"
          :label="!article_edit ? 'Agregar articulo' : 'Editar articulo'"
          icon="add_business"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="articles">
          <component-table
            class="q-mt-md height-table"
            proptitle="Articulos"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :propexcel="excel"
            :propbtns="btns"
            :propactions="true"
            @getrangedata="getArticleRang"
            @onedit="editArticle"
            @tostatus="openDialogStatus"
            @ondetails="openDialogPercent"
            v-if="rendercomponent"
          >
            <template v-slot:toggle>
              <q-toggle
                v-model="filter_pendientes"
                label="Articulos pendientes"
              />
            </template>
            <template v-slot:input_one>
              <q-btn
                color="primary"
                icon="check"
                label="OK"
                @click="dailog_barcode = true"
              />
              <q-dialog v-model="dailog_barcode" persistent full-width>
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="col-xs-12 col-sm-6">
                      <q-table
                        title="Treats"
                        :data="data"
                        :columns="columns"
                        row-key="Art_Codigo_inv"
                        selection="multiple"
                        :selected.sync="selected"
                        :filter="filter"
                        grid
                        hide-header
                      >
                        <template v-slot:top-right>
                          <q-input
                            borderless
                            dense
                            debounce="300"
                            v-model="filter"
                            placeholder="Buscar"
                            filled
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </template>

                        <template v-slot:item="props">
                          <div
                            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                            :style="
                              props.selected ? 'transform: scale(0.95);' : ''
                            "
                          >
                            <q-card :class="props.selected ? 'bg-grey-2' : ''">
                              <q-card-section>
                                <q-checkbox
                                  dense
                                  v-model="props.selected"
                                  :label="props.row.Art_Codigo_inv"
                                />
                              </q-card-section>
                              <q-separator />
                              <q-list dense>
                                <vue-barcode
                                  v-bind:value="props.row.Art_Codigo_inv"
                                  :height="50"
                                >
                                  Show this if the rendering fails.
                                </vue-barcode>
                              </q-list>
                            </q-card>
                          </div>
                        </template>
                      </q-table>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn
                      flat
                      label="Turn on Wifi"
                      color="primary"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </template>
          </component-table>
          <!-- Dialogo para activar o inactivar una meta -->
          <component-dialog-enable
            :dialog="enable_diable"
            :options_dialog="options_status"
            @cancel="enable_diable = false"
            @changeStatus="changeStatus"
          />
          <q-dialog v-model="dialog_percent" persistent full-width>
            <q-card>
              <q-bar dark class="bg-primary text-white">
                <div class="col text-center text-weight-bold">
                  Ajustar porcentajes de venta
                </div>
                <q-btn
                  dense
                  flat
                  round
                  icon="close"
                  color="white"
                  v-close-popup
                />
              </q-bar>
              <q-card-section>
                <q-form
                  @submit="editPercent"
                  class="row q-gutter-y-sm"
                  ref="form_percent"
                  autocomplete="off"
                >
                  <div class="col-xs-12 col-sm-12 col-md-4 q-px-xs">
                    <q-field hint="Nombre artículo" stack-label>
                      <template v-slot:control>
                        <div
                          class="self-center full-width no-outline"
                          tabindex="0"
                        >
                          {{ article_edit.Art_Nombre }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-4 q-px-xs">
                    <q-select
                      v-model="percent_selected"
                      :options="options_percents"
                      hint="Porcentajes generales"
                      :rules="[val => !!val || 'Seleccione un porcentaje']"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-4 q-px-xs">
                    <q-input
                      v-model="new_percent"
                      hint="Porcentaje"
                      :rules="[val => !!val || 'Ingrese un porcentaje']"
                    />
                  </div>
                  <q-btn
                    color="white"
                    text-color="black"
                    label="Agregar"
                    type="submit"
                    class="hide-btn_submit"
                  />
                </q-form>
              </q-card-section>
              <q-card-section class="row">
                <div class="col-xs-12 col-md-6">
                  <q-table
                    title="Porcentajes del producto"
                    :data="data_percents_added"
                    row-key="name"
                    flat
                    style="height: 350px"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          style="text-align: center !important;"
                        >
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          style="text-align: center !important;"
                        >
                          {{ col.value }}
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-table
                    title="Porcentajes agregados"
                    :data="data_percents"
                    :columns="columns_percents"
                    row-key="name"
                    flat
                    style="height: 350px"
                  >
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
                        <q-td auto-width class="q-gutter-x-sm">
                          <q-btn
                            color="red"
                            dense
                            size="sm"
                            icon="delete"
                            round
                            @click="deleteItem(props.row)"
                          />
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
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  icon="save"
                  @click="saveChangePercent"
                  label="Guardar"
                  color="green"
                  v-if="data_percents.length > 0"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-tab-panel>

        <q-tab-panel name="create_article">
          <component-add-article @reload="reload" :edit_data="article_edit" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddArticle from "components/Warehouse/ComponentAddArticle";
import componentTable from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import dialog from "components/Generals/ComponentDialogWarning";
import { mapActions, mapState } from "vuex";
import VueBarcode from "vue-barcode";
let categorias = [];
let ums = [];
let percents = [];
export default {
  name: "Articles",
  components: {
    ComponentAddArticle,
    componentTable,
    ComponentDialogEnable,
    VueBarcode
  },
  data() {
    return {
      filter: null,
      selected: [], //Contiene los codigos que se van a imprimir
      dailog_barcode: false, //Abre el dialog para ver los codigos de barra generados
      tab: "articles",
      date_range: {
        to: null,
        from: null
      },
      columns: [
        {
          name: "Id",
          required: true,
          label: "Id ",
          align: "center",
          field: "Id",
          sortable: true
        },
        {
          name: "Art_Codigo_inv",
          required: true,
          label: "Codigo",
          align: "center",
          field: "Art_Codigo_inv",
          sortable: true
        },
        {
          name: "Art_Nombre",
          required: true,
          label: "Nombre artículo",
          align: "center",
          field: "Art_Nombre",
          sortable: true
        },
        {
          name: "Art_Descripcion",
          required: true,
          label: "Descripción artículo",
          align: "center",
          field: "Art_Descripcion",
          sortable: true
        },
        {
          name: "Prefijo",
          required: true,
          label: "UNDM",
          align: "center",
          field: "Prefijo",
          sortable: true
        },
        {
          name: "Art_Stockminimo",
          required: true,
          label: "Stock min artículo",
          align: "center",
          field: "Art_Stockminimo",
          sortable: true
        },
        {
          name: "Cat_Nombre",
          required: true,
          label: "Categoria",
          align: "center",
          field: "Cat_Nombre",
          sortable: true
        },
        {
          name: "Art_ubicacion",
          required: true,
          label: "Ubicación",
          align: "center",
          field: "Art_ubicacion",
          sortable: true
        },
        {
          name: "name_estado",
          required: true,
          label: "Estado",
          align: "center",
          field: "name_estado",
          sortable: true
        },
        {
          name: "Art_User_control",
          required: true,
          label: "User Control",
          align: "center",
          field: "Art_User_control",
          sortable: true
        },
        {
          name: "Per_Nombre",
          required: true,
          label: "Nombre Control",
          align: "center",
          field: "Per_Nombre",
          sortable: true
        },
        {
          name: "Art_Fecha_control",
          required: true,
          label: "Fecha Control",
          align: "center",
          field: "Art_Fecha_control",
          sortable: true
        }
      ],
      excel: {
        columns: [
          {
            label: "Id ",
            field: "Id"
          },
          {
            label: "Codigo",
            field: "Art_Codigo_inv"
          },
          {
            label: "Nombre articulo",
            field: "Art_Nombre"
          },
          {
            label: "Descripcion articulo",
            field: "Art_Descripcion"
          },
          {
            label: "UNDM",
            field: "Prefijo"
          },
          {
            label: "Stock min articulo",
            field: "Art_Stockminimo"
          },
          {
            label: "Categoria",
            field: "Cat_Nombre"
          },
          {
            label: "Ubicación",
            field: "Art_ubicacion"
          },
          {
            label: "Estado",
            field: "name_estado"
          },
          {
            label: "Documento creador",
            field: "Art_User_control"
          },
          {
            label: "Nombre creador",
            field: "Per_Nombre"
          },
          {
            label: "Fecha creación",
            field: "Art_Fecha_control"
          }
        ],
        data: [],
        title: "Articulos"
      },
      data: [],
      datageneral: [],
      rendercomponent: true,
      filter_pendientes: false,
      article_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      },
      btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: true
      },
      dialog_percent: false,
      data_percents: [],
      data_percents_added: [],
      columns_percents: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID PRODUCTO",
          field: "Art_Id"
        },
        {
          name: "porcentaje",
          align: "center",
          label: "PORCENTAJE SELECCIONADO",
          field: "porcentaje"
        },
        {
          name: "Pv_Prcentaje",
          align: "center",
          label: "PORCENTAJE",
          field: "Pv_Prcentaje"
        }
      ],
      options_percents: percents,
      new_percent: null,
      percent_selected: null
    };
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
  watch: {
    tab(value) {
      if (value == "articles") {
        this.article_edit = null;
      }
    },
    filter_pendientes(value) {
      if (value) {
        this.rendercomponent = false;
        let dataselect = this.datageneral.filter(
          credit => credit.Art_Estado == 0
        );
        this.data.length = 0;

        setTimeout(() => {
          this.data = dataselect;

          this.rendercomponent = true;
        }, 300);
      } else {
        setTimeout(this.getData(), 300);
      }
    },
    dialog_percent(value) {
      if (!value) {
        this.article_edit = null;
      }
    }
  },
  methods: {
    ...mapActions("warehouse", [
      "getAllArticles",
      "requestgetDataArticlesRange",
      "addArticle",
      "getCategoriasAlmacen"
    ]),
    ...mapActions("master", [
      "getAllUm",
      "getAllPorcentaje",
      "getPercentSaleProduct",
      "savePercentPerso"
    ]),
    async getData() {
      this.$q.loading.show({
        message: "Obteniendo articulos existentes, por favor espere..."
      });
      try {
        const resgetDataArticles = await this.getAllArticles().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Repeusta get artículos',
        //   data: resgetDataArticles,
        // });
        if (resgetDataArticles.ok) {
          if (resgetDataArticles.result) {
            this.data.length = 0;
            this.datageneral.length = 0;
            resgetDataArticles.data.forEach(element => {
              this.data.push({
                Id: element.Id,
                Art_Id: element.Art_Id,
                Art_Codigo_inv: element.Art_Codigo_inv,
                Art_Nombre: element.Art_Nombre,
                Art_Descripcion: element.Art_Descripcion,
                Prefijo: element.Prefijo,
                Art_Stockminimo: element.Art_Stockminimo,
                Cat_Nombre: element.Cat_Nombre,
                name_estado: element.Art_Estado == 1 ? "ACTIVO" : "INACTIVO",
                Art_Estado: element.Art_Estado,
                Art_User_control: element.Art_User_control,
                Per_Nombre: element.Per_Nombre,
                Art_Fecha_control: element.Art_Fecha_control,
                Art_ubicacion: element.Art_ubicacion,
                img: element.Art_Imagen
                  ? element.Art_Imagen
                  : "Image/No-Image-Icon.png",
                title: element.Art_Nombre,
                Estado: element.Art_Estado,
                status: element.Art_Estado,
                btn_edit: true,
                btn_status: true,
                btn_details: true,
                // btn_pdf: true,
                icon_btn_edit: "mdi-pencil",
                icon_btn_status: "power_settings_new",
                icon_btn_details: "settings"
              });
              this.datageneral.push({
                Id: element.Id,
                Art_Id: element.Art_Id,
                Art_Codigo_inv: element.Art_Codigo_inv,
                Art_Nombre: element.Art_Nombre,
                Art_Descripcion: element.Art_Descripcion,
                Prefijo: element.Prefijo,
                Art_Stockminimo: element.Art_Stockminimo,
                Cat_Nombre: element.Cat_Nombre,
                name_estado: element.Art_Estado == 1 ? "ACTIVO" : "INACTIVO",
                Art_Estado: element.Art_Estado,
                Art_User_control: element.Art_User_control,
                Per_Nombre: element.Per_Nombre,
                Art_Fecha_control: element.Art_Fecha_control,
                Art_ubicacion: element.Art_ubicacion,
                img: element.Art_Imagen
                  ? element.Art_Imagen
                  : "Image/No-Image-Icon.png",
                title: element.Art_Nombre,
                Estado: element.Art_Estado,
                status: element.Art_Estado,
                btn_edit: true,
                btn_status: true,
                btn_details: true,
                // btn_pdf: true,
                icon_btn_edit: "mdi-pencil",
                icon_btn_status: "power_settings_new",
                icon_btn_details: "settings"
              });
            });
          } else {
            this.$q.notify({
              message: resgetDataArticles.message,
              type: "warning"
            });
          }
        } else {
          this.data.length = 0;
          throw resgetDataArticles.message;
        }

        // Obtenemos las categorías de los productos
        const res_categorias = await this.getCategoriasAlmacen().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get categorias articulos',
        //   data: res_categorias
        // });
        if (res_categorias.ok) {
          if (res_categorias.result) {
            categorias.length = 0;
            res_categorias.data.forEach(element => {
              if (element.Cat_Estado == 1) {
                categorias.push({
                  value: element.Cat_Id,
                  label: element.Cat_Nombre
                });
              }
            });
          } else {
            this.$q.notify({
              message: res_categorias.message,
              type: "warning"
            });
          }
        } else {
          throw new Error(res_categorias.message);
        }

        // Obtenemos las unidades de medidadas
        const res_um = await this.getAllUm().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get unidades de medida',
        //   data: res_um
        // });
        if (res_um.ok) {
          if (res_um.result) {
            ums.length = 0;
            res_um.data.forEach(element => {
              if (element.Um_Estado == 1) {
                ums.push({
                  value: element.Um_Id,
                  label: element.Um_Unidad,
                  prefijo: element.Prefijo
                });
              }
            });
          } else {
            this.$q.notify({
              message: res_um.message,
              type: "warning"
            });
          }
        } else {
          throw new Error(res_um.message);
        }

        const res_percent = await this.getAllPorcentaje().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Repeusta get artículos',
        //   data: resgetDataArticles,
        // });
        if (res_percent.ok) {
          if (res_percent.result) {
            percents.length = 0;
            res_percent.data.forEach(element => {
              if (element.Pv_Estado) {
                percents.push({
                  label: element.Pv_Descripcion,
                  value: element.Pv_Id
                });
              }
            });
          } else {
            this.$q.notify({
              message: res_percent.message,
              type: "warning"
            });
          }
        } else {
          this.data.length = 0;
          throw res_percent.message;
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
    async getArticleRang(data) {
      data.base = process.env.__BASE__;
      this.$q.loading.show({
        message:
          "Buscando Articulos en el rango de fecha solicitado, por favor espere..."
      });
      try {
        const resrequestgetDataArticlesRange = await this.requestgetDataArticlesRange(
          data
        ).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get articulo por rango de fecha",
        //   data: resrequestgetDataArticlesRange,
        // });
        this.data.length = 0;
        if (resrequestgetDataArticlesRange.ok) {
          if (resrequestgetDataArticlesRange.result) {
            resrequestgetDataArticlesRange.data.forEach(element => {
              this.data.push({
                Id: element.Id,
                Art_Id: element.Art_Id,
                Art_Codigo_inv: element.Art_Codigo_inv,
                Art_Nombre: element.Art_Nombre,
                Art_Descripcion: element.Art_Descripcion,
                Prefijo: element.Prefijo,
                Art_Stockminimo: element.Art_Stockminimo,
                Cat_Nombre: element.Cat_Nombre,
                Art_Estado: element.Art_Estado == 1 ? "ACTIVO" : "INHABILITADO",
                Art_User_control: element.Art_User_control,
                Per_Nombre: element.Per_Nombre,
                Art_ubicacion: element.Art_ubicacion,
                Art_Fecha_control: element.Art_Fecha_control,
                status: element.Art_Estado,
                img: element.Art_Imagen
                  ? element.Art_Imagen
                  : "Image/No-Image-Icon.png",
                btn_edit: true,
                btn_status: true,
                btn_details: true,
                // btn_pdf: true,
                icon_btn_edit: "mdi-pencil",
                icon_btn_status: "power_settings_new",
                icon_btn_details: "settings"
              });
            });
          } else {
            this.$q.notify({
              message: resrequestgetDataArticlesRange.message,
              type: "warning"
            });
          }
        } else {
          this.data.length = 0;
          throw resrequestgetDataArticlesRange.message;
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
    editArticle(row) {
      this.article_edit = row;
      this.tab = "create_article";
    },
    reload() {
      this.tab = "articles";
      this.edit_form = false;
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    openDialogStatus(row) {
      // Buscamos la categoria del producto asignada
      let categoria = categorias.find(
        categoria =>
          categoria.label.toLowerCase() == row.Cat_Nombre.toLowerCase()
      );
      // Buscamos la unidad de medida asiganada
      let um = ums.find(
        um => um.prefijo.toLowerCase() == row.Prefijo.toLowerCase()
      );
      this.article_edit = {
        base: null,
        Art_Id: row.Art_Id,
        Cat_Id: categoria.value,
        Art_Codigo_inv: row.Art_Codigo_inv,
        Art_Nombre: row.Art_Nombre,
        Art_Descripcion: row.Art_Descripcion,
        Art_Stockminimo: row.Art_Stockminimo,
        Art_ubicacion: row.Art_ubicacion,
        Um_Id: um.value,
        Art_Imagen: row.Art_Imagen,
        Art_Estado: row.Art_Estado == 1 ? 0 : 1,
        Art_User_control: this.data_user.Per_Num_documento
      };
      this.options_status.title =
        row.Art_Estado == 1 ? "Desactivar artículo" : "Activar artículo";
      this.options_status.msg =
        row.Art_Estado == 1
          ? "Está desactivando este artículo, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?"
          : "Está activando este artículo, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarlo?";
      this.enable_diable = true;
    },
    async changeStatus() {
      this.$q.loading.show({
        message: "Estamos cambiando el estado del artículo, por favor espere..."
      });
      try {
        this.article_edit.base = process.env.__BASE__;
        const res_update = await this.addArticle(this.article_edit).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: "Respuesta insert update articulo",
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
    },
    // Abre el dialog para editar los porcentajes de ventas
    async openDialogPercent(row) {
      this.$q.loading.show({
        message: "Obteniendo porcentajes, por favor espere..."
      });
      try {
        this.article_edit = row;
        const res_per_pro = await this.getPercentSaleProduct(
          this.article_edit.Id
        ).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get porcentajes producto",
        //   data: res_per_pro
        // });
        this.data_percents_added.length = 0;
        if (res_per_pro.ok) {
          if (res_per_pro.result) {
            res_per_pro.data.forEach(element => {
              this.data_percents_added.push({
                "Nombre porcentaje": element.Pv_Descripcion,
                Porcentaje: element.Pv_Prcentaje,
                "Usuario creador": element.Pv_User_control,
                "Fecha creación": element.Pv_Fecha_control
              });
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_per_pro.message);
        }
        this.dialog_percent = true;
        this.data_percents.length = 0;
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
    deleteItem(row) {
      this.$q
        .dialog({
          component: dialog,
          parent: this,
          title: "Eliminar porcentaje",
          msg:
            "Atención! vas a eliminar un porcentaje agregado a la tabla, ¿Seguro que desea continuar?"
        })
        .onOk(() => {
          let index = this.data_percents.indexOf(row);
          this.data_percents.splice(index, 1);
        });
    },
    editPercent() {
      let percent_add = {
        base: process.env.__BASE__,
        Pv_Id: this.percent_selected.value,
        porcentaje: this.percent_selected.label,
        Art_Id: this.article_edit.Art_Id,
        Pv_Prcentaje: this.new_percent,
        Pv_User_control: this.data_user.Per_Num_documento
      };
      let result_find = this.data_percents.find(
        product => product.Pv_Id == percent_add.Pv_Id
      );
      if (result_find) {
        this.$q.notify({
          message: "Este porcentaje ya esta gregado",
          type: "warning"
        });
      } else {
        this.data_percents.push(percent_add);
        this.percent_selected = null;
        this.new_percent = null;
        setTimeout(() => {
          this.$refs.form_percent.resetValidation();
        }, 200);
      }
    },
    async saveChangePercent() {
      this.$q.loading.show({
        message: "Guardando los porcentajes, por favor espere.."
      });
      try {
        let promesas = [];
        this.data_percents.forEach(porcentaje => {
          promesas.push(
            this.savePercentPerso(porcentaje)
              .then(res => {
                res.data.msg = "Respuesta insert porcentaje personalizado";
                return res.data;
              })
              .catch(e => {
                throw new Error(e);
              })
          );
        });
        await Promise.all(promesas).then(data => {
          data.forEach(res => {
            console.log(res);
          });
        });
        this.$q.notify({
          message: "Cambios guardados",
          type: "positive"
        });
        // RELOAD before save
        this.data_percents.length = 0;
        this.percent_selected = null;
        this.new_percent = null;
        this.article_edit = null;
        this.dialog_percent = false;
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

<style scoped>
p {
  font-size: 55px;
}
.grid-style-transition {
  transition: transform 0.28s;
  background-color: 0.28s;
}
</style>
