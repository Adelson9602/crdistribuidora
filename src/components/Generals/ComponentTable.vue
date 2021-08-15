<template>
  <div>
    <q-form @submit="search">
      <div class="q-gutter-y-md q-pb-md row">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-sm" v-if="btns.range_date">
          <q-field
            stack-label
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
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 row" v-if="buscador.input">
          <div class="col-xs-12 col-md-8">
            <q-input v-model="id_search" type="text" :hint="buscador.label" />
          </div>
          <div class="col-xs-12 col-md-4 row q-px-sm">
            <q-btn label="Buscar" type="submit" icon="search" color="primary" class="self-center"/>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <slot></slot>
        </div>
      </div>
    </q-form>
    <div class="q-gutter-md q-pb-md">
      <q-toggle v-model="grid" label="Visualización" v-if="toggle" />
      <q-btn
        @click="exportPDF"
        push
        color="white"
        text-color="red"
        icon="picture_as_pdf"
        v-if="btns.btn_export_pdf"
      />
      <!-- Se habilita este componente cuando se instale la libreria para exportar excel -->
      <vue-excel-xlsx
        :data="excel.data"
        :columns="excel.columns"
        :filename="excel.title"
        sheetname="Hoja 1"
        class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--wrap"
        tabindex="0"
        v-if="btns.export_excel"
      >
        <q-btn
          push
          color="white"
          text-color="positive"
          icon="mdi-microsoft-excel"
        />
      </vue-excel-xlsx>
    </div>
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
      :class="grid ? '' :'height_table'"
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
            <q-toggle v-model="props.expand" checked-icon="add" unchecked-icon="remove" />
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%" class="q-gutter-x-md">
            <q-btn color="red" icon="print" round size="sm">
              <q-tooltip>
                Imprimir
              </q-tooltip>
            </q-btn>
            <q-btn color="green" icon="paid" round size="sm">
              <q-tooltip>
                Recibir pago
              </q-tooltip>
            </q-btn>
            <q-btn color="primary" icon="check" round size="sm">
              <q-tooltip>
                Confirmar pago
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <!-- Cards -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <!-- Cards -->
          <q-card>
            <q-card-section class="q-py-none">
              <q-list>
                <q-item class="q-py-sm q-px-none">
                  <q-item-section style="width:60px" avatar v-if="props.row.img">
                    <q-avatar size="50px">
                      <img :src="props.row.img" alt="Imágen">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text_personalized">
                    <strong> {{ props.row.title }} </strong><!--Títulos para las cards de las tablas-->
                  </q-item-section>
                  <q-item-section avatar>
                    <!-- Actions for cards  -->
                    <q-fab
                      color="primary"
                      padding="xs"
                      icon="keyboard_arrow_up"
                      direction="up"
                      v-if="actions_card"
                    >
                      <q-fab-action
                        :color="
                          props.row.status == 1 ? 'red' : 'green'
                        "
                        round
                        push
                        padding="5px"
                        :icon="props.row.icon_btn_status"
                        @click="status(props.row)"
                        v-if="props.row.btn_status"
                      />
                        <!-- :disable="!actions_user.Actualizar" -->

                      <q-fab-action
                        color="green"
                        round
                        push
                        padding="5px"
                        :icon="props.row.icon_btn_details"
                        @click="details(props.row)"
                        v-if="props.row.btn_details"
                      />

                      <q-fab-action
                        color="info"
                        round
                        push
                        padding="5px"
                        :icon="props.row.icon_btn_edit"
                        @click="edit(props.row)"
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
                      {{col.label != 'Estado' && col.name != 'conf_pago' ? col.value : ''}}
                      <q-badge
                        :color="props.row.status == 1 ? 'positive' : 'negative'"
                        text-color="white"
                        :label="col.value"
                        v-if="col.label == 'Estado'"
                      />
                      <q-badge
                        :color="props.row.pdt_conf_pago == 0 ? 'positive' : 'warning'"
                        text-color="white"
                        :label="col.value"
                        v-if=" col.name == 'conf_pago'"
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
      id_search: null,
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
      btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: false
      },
      actions_card: false, //muestra u oculta los btns de las cards
      toggle: true,
      actions_user: null,
      visible_columns: [], //Permite mostrar u ocultar columnas
      filter_cols: [], //Permite buscar en la tabla sin que se visualice una columna
      flat: true,
      excel: {
        columns: [],
        data: [],
        title: 'Sin título',
      },
      pdf: {
        columns: [],
        data: [],
        orientation: 'l', // l => landscape, p => portrait
        title: {
          title: 'Sin título',
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        }
      },
      buscador: {
        input: false,
        label: ''
      }
    };
  },
  props: [
    "propcolumns",
    "proppdf",
    "propdata",
    "propgrid",
    "proptitle",
    "prodbtn_export",
    "propactions",
    "proptoggle",
    "prop_visible_columns",
    "propflat",
    "propbtns",
    "proppagination",
    "propbuscador"
  ],
  computed: {
    // ...mapState("auth", ["user_permissions"]),
  },
  created() {
    // this.actions_user = this.user_permissions.find( (e) => e.route === this.$route.path ); //Valida los permisos para las acciones del usuario
    this.columns = this.propcolumns;
    this.data = this.propdata;
    this.grid = this.propgrid ? this.propgrid : this.grid; //Activa la visualización grid de la tabla    
    this.actions_card = this.propactions ? this.propactions : this.actions_card; //Muestra u oculta los botenes de las cards
    this.toggle = this.proptoggle ? this.proptoggle : this.toggle; //toggle de la tabla, para el modo de visualización
    this.title = this.proptitle; //Titulo para la tabla
    this.flat = this.propflat ? this.propflat : false;
    this.btns = this.propbtns ? this.propbtns : this.btns;
    this.excel = this.propexcel ? this.propexcel : this.excel;
    this.initial_pagination = this.proppagination =! undefined ? this.proppagination : this.initial_pagination;
    this.buscador = this.propbuscador ? this.propbuscador : this.buscador;

    if (this.modeTable == false) {
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

    // Asigna las configuraciones del pdf
    this.pdf = this.proppdf ? this.proppdf : this.pdf;
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

      var doc = new jsPDF('l', "pt", "letter");

      doc.text(this.pdf.title.title, this.pdf.title.potitionx, this.pdf.title.potitiony);
      doc.autoTable({
        body: this.pdf.data,
        columns: this.pdf.columns,
        margin: { top: 40 },
        styles: {
          overflow: "linebreak",
          fontSize: this.pdf.styles.font_size,
          overflowColumns: "linebreak",
        },
      });
      doc.save(this.pdf.title.title);
    },
    // Emite la función para editar
    details(row) {
      this.$emit("ondetails", row);
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
    // Busca en especifico
    search(){

    }
  },
};
</script>
<style scoped>
.height {
  min-height: 30px;
}
.height_table {
  height: 70vh;
}
thead tr th{
  position: sticky;
  z-index: 1;
}
thead tr:first-child th{
  top: 0
}
.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #fff
}
.text_personalized {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 60%;
}
</style>