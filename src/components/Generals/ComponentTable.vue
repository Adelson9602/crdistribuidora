<template>
  <div>
    <div class="q-gutter-md q-pb-md row">
      <div class="col-xs-12 col-md-3 col-lg-3" v-if="visible_filter_date">
        <q-field
          stack-label
          class="date_training"
          hint="Seleccione un rango de fecha"
        >
          <template v-slot:control>
            <div
              class="self-center full-width no-outline row justify-between"
              tabindex="0"
            >
              <label class="self-center">
                Desde {{ date_range.from }} Hasta {{ date_range.to }}
              </label>
              <q-btn
                icon="event"
                round
                color="primary"
                class="self-end"
                size="xs"
              >
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date_range" range mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn
                        label="Borrar"
                        color="primary"
                        flat
                        @click="date_range = { to: '', from: '' }"
                      />
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        @click="range"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>
          </template>
        </q-field>
      </div>
      <div class="col-xs-12 col-md-4 col-lg-2 q-gutter-md">
        <q-btn
          @click="exportPDF"
          push
          color="white"
          text-color="primary"
          icon="picture_as_pdf"
        />
        <!-- Se habilita este componente cuando se instale la libreria para exportar excel -->
        <vue-excel-xlsx
          :data="data_excel"
          :columns="columns"
          :filename="title"
          :sheetname="'Hoja 1'"
          class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--wrap"
          tabindex="0"
        >
          <q-btn
            push
            color="white"
            text-color="positive"
            icon="mdi-microsoft-excel"
          />
        </vue-excel-xlsx>
      </div>
    </div>
    <q-toggle v-model="grid" label="Visualización" v-if="toggle" />
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :grid="grid"
      :pagination="initial_pagination"
      :filter-method="customFilter"
      :visible-columns="visible_columns"
      :flat="flat"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- Renderiza la firma del usuario en la page firmas -->
      <!-- APLICA PARA EL MODO VISTA NORMAL DE LA TABLA -->
      <template v-slot:body-cell-img="props">
        <q-td key="img" :props="props">
          <q-img
            :src="props.row.img"
            spinner-color="white"
            style="height: 40px; max-width: 40px"
          />
        </q-td>
      </template>
      <!-- Cards -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <!-- Cards -->
          <q-card>
            <q-card-section class="q-py-none">
              <q-list>
                <q-item class="q-py-sm q-px-none">
                  <q-item-section style="width:60px" avatar v-if="props.row.Foto">
                    <q-avatar size="50px">
                      <img :src="props.row.img" alt="Imagen de usuario">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <strong> {{ props.row.title }} </strong
                    ><!--Títulos para las cards de las tablas-->
                  </q-item-section>
                  <q-item-section avatar>
                    <!-- Habilita o deshabilita los usuarios -->
                    <q-fab
                      color="primary"
                      padding="xs"
                      icon="keyboard_arrow_up"
                      direction="up"
                      v-if="visible_btns"
                    >
                      <q-fab-action
                        :color="
                          props.row.Estado === 'Inactivo' ? 'red' : 'green'
                        "
                        round
                        push
                        padding="5px"
                        :icon="props.row.icon_btn_status"
                        @click="status(props.row.Id, props.row)"
                        :disable="!actions_user.Actualizar"
                        v-if="props.row.btn_status"
                      />

                      <q-fab-action
                        :color="color_btn_details"
                        round
                        push
                        padding="5px"
                        :icon="props.row.icon_btn_details"
                        @click="details(props.row.Id)"
                        v-if="props.row.btn_details"
                      />

                      <q-fab-action
                        :color="color_btn_edit"
                        round
                        push
                        padding="5px"
                        :icon="props.row.icon_btn_edit"
                        @click="edit(props.row.Id, props.row)"
                        :disable="
                          props.row.Estado === 'Candado' ||
                          !actions_user.Actualizar
                        "
                        v-if="props.row.btn_edit"
                      />

                      <q-fab-action
                        color="red"
                        round
                        push
                        padding="5px"
                        icon="picture_as_pdf"
                        @click="generatePdf(props.row)"
                        v-if="props.row.btn_pdf"
                      />
                    </q-fab>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-list class="q-pa-none">
                <q-item
                  v-for="col in props.cols.filter((col) => col.name !== 'desc')"
                  :key="col.name"
                  class="q-pa-none height"
                >
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section
                    class="text_personalized"
                    side
                    v-if="col.label !== 'Firma'"
                  >
                    <!-- Value del columna izquierda de las card -->
                    <q-item-label caption>
                      {{
                        col.value === "Activo" || col.value === "Inactivo" || col.value === 'Conciliación'
                          ? ""
                          : col.value
                      }}
                      <q-badge
                        :color="
                          col.value === 'Activo' ? 'positive' : col.value=='Conciliación' ? 'orange-10' : 'negative'
                        "
                        text-color="white"
                        :label="col.value"
                        v-if="
                          col.value === 'Activo' || col.value === 'Inactivo' || col.value === 'Conciliación'
                        "
                      />
                    </q-item-label>
                  </q-item-section>
                  <!-- Aplica cuanto tienen imagenes las tablas -->
                  <q-item-section side v-if="col.label === 'Firma'">
                    <q-avatar>
                      <img :src="col.value" />
                    </q-avatar>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import VueExcelXlsx from "vue-excel-xlsx";
import Vue from "vue";
import { mapState } from "vuex";
Vue.use(VueExcelXlsx);

export default {
  // name: 'ComponentName',
  data() {
    return {
      initial_pagination: {
        page: 1,
        rowsPerPage: 6,
      },
      columns: [],
      data: [],
      title: null,
      filter: "",
      grid: true,
      date_range: {
        to: null,
        from: null,
      },
      search_data: null,
      title_search: null,
      hint_search: null,
      btn_export: true,
      color_btn_details: "green",
      color_btn_edit: "green",
      rows_export: [],
      visible_filter_date: true,
      visible_btns: true, //muestra u oculta los btns de las cards
      toggle: true,
      actions_user: null,
      visible_columns: [], //Permite mostrar u ocultar columnas
      filter_cols: [], //Permite buscar en la tabla sin que se visualice una columna
      stylecolumns: null,
      titlex: null,
      titley: null,
      data_excel: [],
      flat: false,
    };
  },
  props: [
    "propcolumns",
    "headers",
    "propdata",
    "position",
    "document_name",
    "propgrid",
    "proptitle",
    "proptitle_search",
    "prophint_search",
    "prodbtn_export",
    "prop_color_btn_details",
    "prop_color_btn_pdf",
    "prop_color_btn_edit",
    "propbtns",
    "proptoggle",
    "propstylecolumns",
    "proptitlex",
    "proptitley",
    "propfilterdate",
    "prop_visible_columns",
    "prop_data_excel",
    "propflat"
  ],
  computed: {
    // ...mapState("auth", ["user_permissions"]),
  },
  created() {
    // this.actions_user = this.user_permissions.find( (e) => e.route === this.$route.path ); //Valida los permisos para las acciones del usuario
    this.columns = this.propcolumns;
    this.data = this.propdata;
    this.grid = this.propgrid; //Activa la visualización grid de la tabla    
    this.visible_btns = this.propbtns !== undefined ? this.propbtns : true;
    this.visible_filter_date = this.propfilterdate !== undefined ? this.propfilterdate : true; // Muestra el input para filtrar por rango de fecha
    this.toggle = this.proptoggle !== undefined ? this.proptoggle : true; //toggle de la tabla, para el modo de visualización
    this.title = this.proptitle; //Titulo para la tabla
    this.title_search = this.proptitle_search; //titulo para el input que busca directamente en la base de datos, este esta encima de la tabla general
    this.hint_search = this.prophint_search; //hint para el input filter de la tabla
    this.btn_export = this.prodbtn_export;
    this.stylecolumns = this.propstylecolumns ? this.propstylecolumns : null;
    this.titlex = this.proptitlex ? this.proptitlex : 330; //Alinea el titulo del pdf en sentido x
    this.titley = this.proptitley ? this.proptitley : 30; //Alinea el titulo del pdf en sentido y
    this.flat = this.propflat !== undefined ? this.propflat : false;
    if (this.prop_color_btn_details) {
      this.color_btn_details = this.prop_color_btn_details;
    }
    if (this.prop_color_btn_edit) {
      this.color_btn_edit = this.prop_color_btn_edit;
    }

    if (this.modeTable === false) {
      this.mode = this.modeTable;
    } else {
      this.mode = true;
    }
    // Asignamos la columnas a mostrar, para ello la propiedad required en las columnas de la tabla debe ser false
    if (this.prop_visible_columns) {
      this.visible_columns = this.prop_visible_columns;
    } else {
      this.propcolumns.forEach((column) => {
        this.visible_columns.push(column.name);
      });
    }
    // Asinga el nombre de la tabla
    this.propcolumns.forEach((column) => {
      this.filter_cols.push(column.name);
    });
    if (this.prop_data_excel) {
      this.data_excel = this.prop_data_excel;
    } else {
      this.data_excel = this.propdata;
    }
  },
  methods: {
    // Función de filtrado personalizado, permite filtrar datos de la tabla aunque la columna no se muestre
    customFilter(rows, terms) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      // const toFilter = this.byVisibility ? [...this.visibleColumns, ...this.reqs ] : this.filterCols //original del foro

      const filteredRows = rows.filter((row) =>
        this.filter_cols.some((col) =>
          (row[col] + "").toLowerCase().includes(lowerTerms)
        )
      );
      return filteredRows;
    },
    // Exporta el pdf de la tabla
    exportPDF() {
      var columnstyle = this.stylecolumns;
      var x = this.titlex;
      var y = this.titley;
      var data = [];
      if (this.rows_export.length == 0) {
        if (this.data_excel.length > 0) {
          data = this.data_excel;
        } else {
          data = this.data;
        }
      } else {
        data = this.rows_export;
      }

      var columns = this.headers;
      var doc = new jsPDF(this.position, "pt", "letter");

      doc.text(this.title, x, y);
      doc.autoTable({
        body: data,
        columns,
        margin: { top: 40 },
        styles: {
          overflow: "linebreak",
          fontSize: 7,
          cellWidth: columnstyle,
          overflowColumns: "linebreak",
        },
      });
      doc.save(this.document_name);
    },
    // Emite la función para editar
    details(id) {
      this.$emit("ondetails", id);
    },
    // genera el pdf con petición al servidor, archivo pdf php
    generatePdf(row) {
      this.$emit("onpdf", row);
    },
    // Emite función editar
    edit(id, row) {
      this.$emit("onedit", id, row);
    },
    // Emite la función para cambiar el estado de cualquien dato de la tabla
    status(id, row) {
      this.$emit("tostatus", id, row);
    },
    // Emite filtrar datos por rango de fecha
    range() {
      if ( typeof(this.date_range) === 'object' && !this.date_range.to && !this.date_range.from){
        this.$q.notify({
          message: 'Debe seleccionar una fecha',
          type: 'negative'
        })
        return;
      } else  if ( typeof(this.date_range) == 'string' ) {
        this.date_range = {
          to: this.date_range,
          from: this.date_range
        }
      }
      this.$emit("getrangedata", this.date_range);
    },
    // Emite función para buscar un dato especifica en la bd y mostrar en la tabla
    search_dataSingle() {
      this.$emit(`search_datasingle`, this.search_data);
    },
  },
};
</script>
<style scoped>
.height {
  min-height: 30px;
}
.text_personalized {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 60%;
}
</style>