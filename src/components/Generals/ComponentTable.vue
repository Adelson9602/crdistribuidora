<template>
  <div class="q-pt-md">
    <div class="q-gutter-md q-pb-md">
      <q-toggle v-model="mode" label="Visualización" />
      <q-btn
        @click="exportPDF"
        push
        color="white"
        text-color="primary"
        icon="picture_as_pdf"
      />
      <vue-excel-xlsx
        :data="rowsExport.length == 0 ? rows : rowsExport"
        :columns="columns"
        :filename="title"
        :sheetname="'Hoja 1'"
        class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--wrap"
        tabindex="1"
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
      :grid="mode"
      :title="title"
      :data="rows"
      :columns="columns"
      row-key="names"
      :filter="filter"
      :hide-header="mode"
      :sort-method="order"
      binary-state-sort
    >
      <!---Inicia la imagen en modo normal-->
      <template v-slot:body-cell-photo="props" v-if="img">
        <q-td :props="props">
          <q-avatar>
            <img :src="props.row.Pers_Imagen" />
          </q-avatar>
        </q-td>
      </template>
      <!--Termina la imagen de la tabla-->
      <!-- Contiene el btn para visualizar el resultado de la capacitación por usuario -->
      <template v-slot:body-cell-view="props">
        <q-td :props="props">
          <q-btn
            round
            size="xs"
            push
            v-if="url === 'result'"
            icon="visibility"
            @click="view(props.row.id_Realiza, props.row.id_Capacitacion1)"
            color="green"
          />
        </q-td>
      </template>
      <!-- Inicia el badge para el estado en modo normal -->
      <template v-slot:body-cell-state="props">
        <q-td :props="props">
          <q-badge :color="props.row.State === 1 ? 'green' : 'red'">
            {{ props.row.State === 1 ? "Activo" : "Inactivo" }}
          </q-badge>
        </q-td>
      </template>
      <!-- Finaliza el badge para el estado de los documentos del trailer y del vehículo-->
      <template v-slot:body-cell-state_1="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notalineav === 'Mayor a 30' ||
              props.row.notaLictran === 'Mayor a 30'
                ? 'green'
                : props.row.notalineav === 'A vencer' ||
                  props.row.notaLictran === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notalineav }}
            {{ props.row.notaLictran }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-state_2="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notatarpro === 'Mayor a 30' ||
              props.row.notaSoat === 'Mayor a 30'
                ? 'green'
                : props.row.notatarpro === 'A vencer' ||
                  props.row.notaSoat === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notatarpro }}
            {{ props.row.notaSoat }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-state_3="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notataforo === 'Mayor a 30' ||
              props.row.notaRetec === 'Mayor a 30'
                ? 'green'
                : props.row.notataforo === 'A vencer' ||
                  props.row.notaRetec === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notataforo }}
            {{ props.row.notaRetec }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-state_4="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notacerthidro === 'Mayor a 30' ||
              props.row.notaPoextra === 'Mayor a 30'
                ? 'green'
                : props.row.notacerthidro === 'A vencer' ||
                  props.row.notaPoextra === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notacerthidro }}
            {{ props.row.notaPoextra }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-state_5="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notacertkingping === 'Mayor a 30' ||
              props.row.notaRchidro === 'Mayor a 30'
                ? 'green'
                : props.row.notacertkingping === 'A vencer' ||
                  props.row.notaRchidro === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notacertkingping }}
            {{ props.row.notaRchidro }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-state_6="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notaclt === 'Mayor a 30' ||
              props.row.notaCertqr === 'Mayor a 30'
                ? 'green'
                : props.row.notaclt === 'A vencer' ||
                  props.row.notaCertqr === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notaclt }}
            {{ props.row.notaCertqr }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-state_7="props">
        <q-td :props="props">
          <q-badge
            :color="
              props.row.notaClt === 'Mayor a 30'
                ? 'green'
                : props.row.notaClt === 'A vencer'
                ? 'warning'
                : 'red'
            "
          >
            {{ props.row.notaClt }}
          </q-badge>
        </q-td>
      </template>
      <!-- Finaliza el badge para el estado de los documentos del trailer-->

      <template v-slot:top-right>
        <!--Inicia el buscador-->
        <q-input
          filled
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!--Termina el buscador-->

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition"
        >
          <!--Template para cuando las tablas tienen imágenes-->
          <q-card v-if="img && !documents">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="props.row.Pers_Imagen" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ props.row.Pers_Nombres }}</q-item-label>
                <q-item-label caption>{{
                  props.row.Pers_Apellidos
                }}</q-item-label>
              </q-item-section>
              <q-item-section v-if="url !== 'digital_signature'">
                <q-item-label class="row justify-end items-center q-gutter-xs">
                  <q-btn
                    round
                    size="xs"
                    push
                    icon="power_settings_new"
                    :color="`${props.row.State ? 'green' : 'red'}`"
                    @click="showDialogEnable(props.row.id, props.row.State)"
                  />
                  <q-btn
                    round
                    size="xs"
                    push
                    icon="edit"
                    @click="showDialog(props.row.id)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-list
              dense
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item
                v-if="
                  col.label != 'Foto' &&
                  col.label != 'Nombres' &&
                  col.label != 'Apellidos' &&
                  col.label != 'Firma'
                "
              >
                <q-item-section>
                  <!--Inicia el subtitulo-->
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <!--Fin del subtitulo-->

                <q-item-section side>
                  <!--Inicia el contenido-->
                  <q-item-label
                    caption
                    v-if="col.value !== 'Activo' && col.value !== 'Inactivo'"
                    >{{ col.value }}</q-item-label
                  >

                  <q-item-label caption v-if="col.value === 'Activo'">
                    <q-badge color="green">{{ col.value }}</q-badge>
                  </q-item-label>

                  <q-item-label caption v-if="col.value === 'Inactivo'">
                    <q-badge color="red">{{ col.value }}</q-badge>
                  </q-item-label>
                </q-item-section>
                <!--Fin el contenido-->
              </q-item>
            </q-list> </q-card
          ><!--Finaliza el template de imágenes-->

          <!-- Card para las categorías de licencia -->
          <q-card v-if="url === 'document_license'">
            <q-item>
              <q-item-section>
                <q-icon
                  name="local_shipping"
                  :class="`${props.row.State ? 'text-green' : 'text-red'}`"
                  style="font-size: 2.1em"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="row justify-end items-center q-gutter-xs">
                  <q-btn
                    round
                    size="xs"
                    push
                    v-if="
                      url !== 'desktop' &&
                      url !== 'cities' &&
                      url !== 'failures'
                    "
                    icon="power_settings_new"
                    :color="`${props.row.State ? 'green' : 'red'}`"
                    @click="showDialogEnable(props.row.id, props.row.State)"
                  />
                  <q-btn
                    round
                    size="xs"
                    push
                    icon="edit"
                    v-if="url !== 'failures' "
                    @click="showDialog(props.row.id)"
                    :color="
                      props.row.nota === 'rojo'
                        ? 'red'
                        : props.row.nota === 'naranja'
                        ? 'orange'
                        : props.row.nota === 'verde'
                        ? 'green'
                        : 'white'
                    "
                    :text-color="
                      !props.row.hasOwnProperty('nota')
                        ? 'black'
                        : props.row.nota === 'blanco'
                        ? 'black'
                        : 'white'
                    "
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-list
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <!-- Validamos que el label no sea id para renderizarlo en la tabla -->
              <q-item>
                <q-item-section>
                  <q-item-label>{{
                    col.label === "Id" ? "Categoría" : col.label
                  }}</q-item-label>
                  <q-item-label
                    caption
                    v-if="col.value !== 'Activo' && col.value !== 'Inactivo'"
                  >
                    {{ col.value }}
                  </q-item-label>
                  <q-item-label caption v-if="col.value === 'Activo'">
                    <q-badge color="green">{{ col.value }}</q-badge>
                  </q-item-label>
                  <q-item-label caption v-if="col.value === 'Inactivo'">
                    <q-badge color="red">{{ col.value }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list> </q-card
          ><!-- Finaliza Card para las categorías de licencia -->

          <!-- Mostar color cuando esta activo e inactivo en cards sin imágenes -->
          <q-card v-if="!img && !documents && url !== 'document_license'">
            <q-item>
              <q-item-section>
                <q-icon
                  name="local_shipping"
                  :class="`${props.row.State ? 'text-green' : 'text-red'}`"
                  style="font-size: 2.1em"
                  v-if="
                    url !== 'desktop' &&
                    url !== 'integration' &&
                    url !== 'cities' &&
                    url !== 'contractors' &&
                    url !== 'positions' &&
                    url !== 'failures' &&
                    url !== 'result' &&
                    url !== 'trainers'
                  "
                />
                <q-icon
                  name="school"
                  style="font-size: 2.1em"
                  class="text-green"
                  v-if="url === 'result'"
                />
                <q-icon
                  name="engineering"
                  :class="`${props.row.State ? 'text-green' : 'text-red'}`"
                  style="font-size: 2.1em"
                  v-if="url === 'contractors' || url === 'trainers'"
                />
                <q-icon
                  name="reduce_capacity"
                  :class="`${props.row.State ? 'text-green' : 'text-red'}`"
                  style="font-size: 2.1em"
                  v-if="url === 'positions'"
                />
                <q-icon
                  name="fact_check"
                  class="text-green"
                  style="font-size: 2.1em"
                  v-if="url === 'desktop'"
                />
                <q-icon
                  name="apartment"
                  class="text-green"
                  style="font-size: 2.1em"
                  v-if="url === 'cities'"
                />
                <q-icon
                  name="construction"
                  class="text-green"
                  style="font-size: 2.1em"
                  v-if="url === 'failures'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="row justify-end items-center q-gutter-xs">
                  <q-btn
                    round
                    size="xs"
                    push
                    v-if="
                    url !== 'desktop' &&
                      url !== 'integration' &&
                      url !== 'cities' &&
                      url !== 'failures' &&
                      url !== 'result' &&
                      url !== 'trainers' &&
                      url !== 'items_inspection'
                    "
                    icon="power_settings_new"
                    :color="`${props.row.State ? 'green' : 'red'}`"
                    @click="showDialogEnable(props.row.id, props.row.State)"
                  />
                  <q-btn
                    round
                    size="xs"
                    push
                    v-if="url === 'desktop' || url === 'inspection_history' || url === 'integration'"
                    icon="picture_as_pdf"
                    color="primary"
                    @click="showPdf(props.row.id,props.row.carpeta)"
                  />
                  <q-btn
                    round
                    size="xs"
                    push
                    v-if="url === 'desktop' || url === 'inspection_history' || url === 'integration'"
                    icon="qr_code_scanner"
                    @click="showQr(props.row.id,props.row.carpeta)"
                  />
                  <q-btn
                    round
                    size="xs"
                    push
                    v-if="url === 'result' || url === 'items_inspection'"
                    icon="visibility"
                    @click="
                      view(
                        props.row.id_Realiza,
                        props.row.id_Capacitacion1,
                        props.row.id
                      )
                    "
                    color="green"
                  />
                  <q-btn
                    round
                    size="xs"
                    push
                    icon="edit"
                    v-if="
                      url !== 'integration' &&
                      url !== 'failures' &&
                      url !== 'inspection_history' &&
                      url !== 'result'
                    "
                    @click="showDialog(props.row.id)"
                    :color="
                      props.row.nota === 'rojo'
                        ? 'red'
                        : props.row.nota === 'naranja'
                        ? 'orange'
                        : props.row.nota === 'verde'
                        ? 'green'
                        : 'white'
                    "
                    :text-color="
                      !props.row.hasOwnProperty('nota')
                        ? 'black'
                        : props.row.nota === 'blanco'
                        ? 'black'
                        : 'white'
                    "
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-list
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <!-- Validamos que el label no sea id para renderizarlo en la tabla -->
              <q-item
                v-if="col.label !== 'Id' && col.label !== 'Ver resultados'"
              >
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label
                    caption
                    v-if="col.value !== 'Activo' && col.value !== 'Inactivo' && col.value !== 'APROBADO' && col.value !== 'NO APROBADO' "
                  >
                    {{ col.value }}
                  </q-item-label>
                  <q-item-label caption v-if="col.value === 'Activo' || col.value=='APROBADO'">
                    <q-badge color="green">{{ col.value }}</q-badge>
                  </q-item-label>
                  <q-item-label caption v-if="col.value === 'Inactivo' || col.value=='NO APROBADO'">
                    <q-badge color="red">{{ col.value }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list> </q-card
          ><!--Finaliza Mostar color cuando esta activo e inactivo en cards sin imágenes -->
          <!-- Aplica para la documentación del conductor -->
          <q-card v-if="!img && documents">
            <q-item v-if="!imgDriver">
              <q-item-section class="text-body1">
                <q-item-label class="row justify-between">
                  Placa. {{ props.row.Remol_Id }}
                  <q-btn
                    round
                    size="xs"
                    push
                    icon="edit"
                    @click="showDialog(props.row.Remol_Id)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="imgDriver">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="props.row.Pers_Imagen" />
                </q-avatar>
              </q-item-section>

              <q-item-section class="col-xs-10">
                <q-item-label>
                  {{ props.row.Pers_Nombres }} {{ props.row.Pers_Apellidos }}
                </q-item-label>
                <q-item-label caption>
                  C.c. {{ props.row.UsuarioUser }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="row justify-end">
                  <q-btn
                    round
                    size="xs"
                    push
                    icon="edit"
                    @click="showDialog(props.row.UsuarioUser)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <div
              v-for="(col, index) in props.cols.filter(
                (col) => col.name !== 'desc'
              )"
              :key="col.name"
            >
              <q-expansion-item
                expand-separator
                v-if="
                  col.label !== 'Estado' &&
                  col.label !== 'Placa' &&
                  col.label !== 'Nombres' &&
                  col.label !== 'Cédula'
                "
              >
                <template v-slot:header>
                  <q-item-section>
                    {{ col.label }}
                  </q-item-section>
                  <q-item-section side>
                    <div class="row items-center">
                      <!-- Btn para descargar los certificados -->
                      <!-- <q-btn>hola</q-btn> -->
                      <q-badge
                        :color="`${
                          props.cols[index + 1].value === 'Mayor a 30'
                            ? 'green'
                            : props.cols[index + 1].value === 'A vencer'
                            ? 'warning'
                            : 'red'
                        }`"
                      >
                        <q-icon
                          :name="`${
                            props.cols[index + 1].value === 'Mayor a 30'
                              ? 'done'
                              : 'warning'
                          }`"
                          color="white"
                          class="q-ml-xs"
                        />
                      </q-badge>
                    </div>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section>
                    <q-item-label>
                      <q-badge
                        :color="`${
                          props.cols[index + 1].value === 'Mayor a 30'
                            ? 'green'
                            : props.cols[index + 1].value === 'A vencer'
                            ? 'warning'
                            : 'red'
                        }`"
                      >
                        {{
                          col.value === null
                            ? "No aplica"
                            : props.cols[index + 1].value
                        }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label>
                      <q-badge
                        :color="`${
                          props.cols[index + 1].value === 'Mayor a 30'
                            ? 'green'
                            : props.cols[index + 1].value === 'A vencer'
                            ? 'warning'
                            : 'red'
                        }`"
                        mask="YYYY-MM-DD"
                      >
                        {{ col.value === null ? "No aplica" : col.value }}
                      </q-badge>
                    </q-item-label>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
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
Vue.use(VueExcelXlsx);

export default {
  data() {
    return {
      filter: "",
      mode: true,
      title: this.tableTitle,
      rows: this.data,
      columns: this.titles,
      url: null,
      rowsExport: [],
    };
  },
  created() {
    this.$emit("defaultValues");
  },
  mounted() {
    var ulrActual = location.href.split("/");
    if (ulrActual.length === 4) {
      this.url = ulrActual[3];
    } else if (ulrActual.length === 5) {
      this.url = ulrActual[4];
    }
    if (this.modeTable === false) {
      this.mode = this.modeTable;
    } else {
      this.mode = true;
    }
  },
  props: [
    "data",
    "titles",
    "tableTitle",
    "headers",
    "documentName",
    "position",
    "img",
    "documents",
    "imgDriver",
    "modeTable",
  ],
  methods: {
    exportPDF() {
      var data = [];
      if (this.rowsExport.length == 0) {
        data = this.rows;
      } else {
        data = this.rowsExport;
      }

      var columns = this.headers;
      var doc = new jsPDF(this.position, "pt", "letter");

      doc.text(this.title, 330, 30);
      doc.autoTable({
        body: data,
        columns,
        margin: { top: 40 },
        styles: { overflow: "linebreak", fontSize: 7 },
      });
      doc.save(this.documentName);
    },
    showDialog(Id) {
      this.$emit("dialog", Id);
    },
    showDialogEnable(Id, state) {
      this.$emit("dialogEnable", Id, state);
    },
    showPdf(id,carpeta) {
      
      this.$emit("showPdf", id,carpeta);
    },
    showQr(id,carpeta) {
      this.$emit("showQr", id,carpeta);
    },
    view(idTraining, idPerson, id) {
      this.$emit("view", idTraining, idPerson, id);
    },
    order(rows, sortBy, descending) {
      this.rowsExport.length = 0;
      const data = [...rows];

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;
          return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0;
        });
      }
      data.forEach((element) => {
        this.rowsExport.push(element);
      });
      return data;
    },
  },
};
</script>
