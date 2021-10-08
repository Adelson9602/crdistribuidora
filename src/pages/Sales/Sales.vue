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
        <q-tab name="sales" label="Ventas" icon="monetization_on" />
        <q-tab name="cotizacion" label="Cotizaciones" icon="shopping_basket" />
        <q-tab name="add_sales" label="Agregar venta" icon="shopping_cart" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="sales">
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
            @onrange="getSalesByRange"
            @onedit="aprovedCredit"
            @ondetails="detatilSale"
            @tostatus="deliverProduct"
            @onpdf="generatePdf"
            @onprint="getDataPrint"
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
          <!-- Dialogo para imprimir -->
          <q-dialog v-model="dialog_print_sale">
            <q-card class="my-card">
              <q-card-section>
                <div class="ticket">
                  <div class="text-center"><q-icon name="store" size="50px"/></div>
                  <div class="text-center">
                    <p class="q-ma-none"> <span class="text-bold">Fecha: </span>{{encabezado_selected ? encabezado_selected.Ev_Fecha_venta : ''}}</p>
                    <p class="q-ma-none"> <span class="text-bold">Cliente: </span> {{encabezado_selected ? encabezado_selected.CP_Razon_social : ''}}</p>
                    <p class="q-ma-none"> <span class="text-bold">C.C:</span> {{encabezado_selected ? encabezado_selected.CP_Nit : ''}}</p>
                    <p class="q-ma-none"> <span class="text-bold">Remisión No: </span> {{encabezado_selected ? encabezado_selected.Ev_Id : ''}}</p>
                    <p class="q-ma-none"> <span class="text-bold">Método Pago:</span> {{encabezado_selected ? encabezado_selected.name_mp : ''}}</p>
                  </div>
                  <table class="ticket_print">
                    <tr>
                      <th>Cant</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>V. Unt $</th>
                      <th>Valor $</th>
                    </tr>
                    <tr class="data" v-for="(product, key) in product_saled" :key="key">
                      <td class="cantidad">{{product.cantidad}}</td>
                      <td class="codigo">{{product.codigo}}</td>
                      <td class="producto">{{product.descripcion}}</td>
                      <td class="val_uni">{{product.precio_un}}</td>
                      <td class="precio">{{new Intl.NumberFormat().format(product.valor)}}</td>
                    </tr>
                  </table>
                  <table>
                    <tr>
                      <td class="text-right text-bold">SUBTOTAL:</td>
                      <td>$ {{new Intl.NumberFormat().format(encabezado_selected ? encabezado_selected.Ev_Subtotal : 0)}}</td>
                    </tr>
                    <tr>
                      <td class="text-right text-bold">DESCUENTO ART:</td>
                      <td>$ {{new Intl.NumberFormat().format(encabezado_selected ? encabezado_selected.Ev_Des_total_art : 0)}}</td>
                    </tr>
                    <tr>
                      <td class="text-right text-bold">DESCUENTO GRAL:</td>
                      <td>$ {{new Intl.NumberFormat().format(encabezado_selected ? encabezado_selected.Ev_Descuentog : 0)}}</td>
                    </tr>
                    <tr>
                      <td class="text-right text-bold">TOTAL:</td>
                      <td>$ {{new Intl.NumberFormat().format(encabezado_selected ? encabezado_selected.Ev_Total_venta : 0)}}</td>
                    </tr>
                  </table>
                  <br>
                  <p class="text-center"><span class="text-bold">N° Artículos </span>{{encabezado_selected ? encabezado_selected.cantidad_art : 0}} 
                  <p class="text-center"><span class="text-bold">Vendedor </span>{{encabezado_selected ? encabezado_selected.Per_Nombre : 0}} 
                  <br>
                  ¡GRACIAS POR SU COMPRA!
                  <br>crdistribuidora.com</p>
                  <div class="row justify-center">
                    <q-btn flat label="Imprimir" color="primary" class="btn_print" @click="printSale()" v-if="!print_file"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            
          </q-dialog>
          <!-- Dialogo para ver el detalle de la venta -->
          <q-dialog v-model="dialog_detail" persistent full-height full-width>
            <q-card>
              <q-bar dark class="bg-primary text-white">
                <div class="col text-center text-weight-bold">
                  Detalle de la venta
                </div>
                <q-btn
                  text-color="white"
                  icon="close"
                  round
                  flat
                  v-close-popup
                />
              </q-bar>
              <q-card-section>
                <q-tabs v-model="tab_detail" align="justify" narrow-indicator>
                  <q-tab class="text-purple" name="detalle" label="Detalle" />
                  <q-tab
                    class="text-orange"
                    name="nota_credito"
                    label="Nota crédito"
                  />
                  <q-tab
                    class="text-teal"
                    name="nota_debito"
                    label="Nota débito"
                  />
                </q-tabs>

                <q-tab-panels
                  v-model="tab_detail"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                >
                  <q-tab-panel name="detalle">
                    <!-- Encabezado -->
                    <q-form @submit="changeMethod" class="q-gutter-md">
                      <div class="row">
                        <div
                          class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-sm"
                          v-for="(value, index) in encebezado_venta"
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
                        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
                          <q-select
                            v-model="mp_id"
                            :options="options_me_pago"
                            hint="Forma de pago"
                            :rules="[
                              (val) => !!val || 'Forma de pago es obligatorio',
                            ]"
                            map-options
                            emit-value
                            :disable="mp_id == 2"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
                          <q-input
                            v-model="dias_credito"
                            mask="###"
                            hint="Días de crédito"
                            :rules="[
                              (val) =>
                                !!val || 'Días de céedito es obligatorio',
                            ]"
                            v-if="
                              mp_id == 2 &&
                              encabezado_selected.Ev_dias_credito == 0
                            "
                          />
                        </div>
                      </div>
                      <div>
                        <q-btn
                          label="Guardar"
                          type="submit"
                          color="green"
                          v-if="mp_id == 2 && dias_credito"
                        />
                      </div>
                    </q-form>
                    <!-- Detalle -->
                    <div class="row q-mt-md">
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-table
                          flat
                          title="Productos vendidos"
                          :data="data_products"
                          :columns="columns_products"
                          row-key="name"
                          class="alto_tabla"
                        />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-table
                          flat
                          title="Productos en garantía"
                          :data="data_garantias"
                          :columns="columns_products"
                          row-key="name"
                          class="alto_tabla"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="nota_credito" style="height: 83vh">
                    <q-layout container>
                      <q-page-container>
                        <q-page class="bg-white">
                          <!-- Encabezado -->
                          <div class="row q-mt-md">
                            <component-add-note-credit
                              :prop_encabezado="encabezado_selected"
                              :prop_product="data_products"
                              class="col-xs-12"
                            />
                          </div>
                        </q-page>
                      </q-page-container>
                    </q-layout>
                  </q-tab-panel>

                  <q-tab-panel name="nota_debito">
                    <component-add-note-debit
                      @reload="reload"
                      :prop_encabezado="encabezado_selected"
                      :prop_product="data_products"
                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-tab-panel>

        <q-tab-panel name="cotizacion">
          <component-table
            class="q-mt-md"
            proptitle="Cotizaciones"
            :propdata="data_cotizaciones"
            :propcolumns="columns_cotizacion"
            :propgrid="true"
            :propflat="true"
            :propexcel="excel_cotiza"
            :proppdf="optionpdfcotizacion"
            :propbtns="btns"
            :proppagination="initial_pagination"
            :propactions="true"
            @onrange="getCotizRange"
            @ondetails="detatilCotizacion"
            @onpdf="generatePdfcot"
          />
          <!-- Dialogo para ver el detalle de la cotización -->
          <q-dialog v-model="dialog_detail" persistent full-height full-width>
            <q-card>
              <q-bar dark class="bg-primary text-white">
                <div class="col text-center text-weight-bold">
                  Detalle de la cotización
                </div>
                <q-btn
                  text-color="white"
                  icon="close"
                  round
                  flat
                  v-close-popup
                />
              </q-bar>
              <q-card-section>
                <!-- Encabezado -->
                <div class="row">
                  <div
                    class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-sm"
                    v-for="(value, index) in encabezado_cotiza"
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
                  <div class="col-xs-12">
                    <q-table
                      flat
                      title="Productos agregados"
                      :data="data_det_cotiza"
                      :columns="column_det_cot"
                      row-key="name"
                      class="alto_tabla"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-tab-panel>

        <q-tab-panel name="add_sales">
          <component-add-sales @reload="reload" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddSales from "components/Sales/ComponentAddSales";
import componentTable from "components/Generals/ComponentTable";
import ComponentAddNoteDebit from "components/Sales/ComponentAddNoteDebit";
import ComponentAddNoteCredit from "src/components/Sales/ComponentAddNoteCredit";
import { mapActions, mapState } from "vuex";
import dialog from "components/Generals/ComponentDialogWarning";
import CryptoJS from "crypto-js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { numeros_letras } from 'boot/convert'; //Se importa archivo boot para convertir números a letras
let all_clients = []; //Contiene todos los clientes
let all_medios = []; //Contiene los medios de pago
export default {
  name: "DeparturesGuarantees",
  components: {
    ComponentAddSales,
    componentTable,
    ComponentAddNoteDebit,
    ComponentAddNoteCredit,
  },
  data() {
    return {
      tab: "sales",
      tab_detail: "detalle",
      columns: [
        {
          name: "Ev_Id",
          align: "center",
          label: "Venta N°",
          sortable: true,
          field: "Ev_Id",
        },
        {
          name: "CP_Nit",
          align: "center",
          label: "NIT",
          sortable: true,
          field: "CP_Nit",
        },
        {
          name: "Ev_Des_gen_venta",
          align: "center",
          label: "Descuento general venta",
          sortable: true,
          field: "Ev_Des_gen_venta",
        },
        {
          name: "Ev_Des_total_art",
          align: "center",
          label: "Descuento total artículo",
          sortable: true,
          field: "Ev_Des_total_art",
        },
        {
          name: "Ev_Impuesto",
          align: "center",
          label: "Impuesto",
          sortable: true,
          field: "Ev_Impuesto",
        },
        {
          name: "Ev_Subtotal",
          align: "center",
          label: "Subtotal",
          sortable: true,
          field: "Ev_Subtotal",
        },
        {
          name: "Ev_Total_venta",
          align: "center",
          label: "Venta total",
          sortable: true,
          field: "Ev_Total_venta",
        },
        {
          name: "Ev_dias_credito",
          align: "center",
          label: "Días crédito",
          sortable: true,
          field: "Ev_dias_credito",
        },
        {
          name: "Mov_Descripcion",
          align: "center",
          label: "Nombre movil",
          sortable: true,
          field: "Mov_Descripcion",
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Nombre vendedor",
          sortable: true,
          field: "Per_Nombre",
        },
        {
          name: "Per_Num_documento",
          align: "center",
          label: "Documento vendedor",
          sortable: true,
          field: "Per_Num_documento",
        },
        {
          name: "name_qautorizqa",
          align: "center",
          label: "Autoriza garantía",
          sortable: true,
          field: "name_qautorizqa",
        },
        {
          name: "Eg_Quien_autoriza",
          align: "center",
          label: "Documento autoriza garantía",
          sortable: true,
          field: "Eg_Quien_autoriza",
        },
        {
          name: "Eg_Observacion",
          align: "center",
          label: "Observación",
          sortable: true,
          field: "Eg_Observacion",
        },
        {
          name: "Eg_Fecha_control",
          align: "center",
          label: "Fecha garantía",
          sortable: true,
          field: "Eg_Fecha_control",
        },
        {
          name: "Ev_Fecha_venta",
          align: "center",
          label: "Fecha venta",
          sortable: true,
          field: "Ev_Fecha_venta",
        },
        {
          name: "Estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "Estado",
        },
      ],
      excel: {
        columns: [
          {
            label: "Venta N°",
            field: "Ev_Id",
          },
          {
            label: "NIT",
            field: "CP_Nit",
          },
          {
            label: "Descuento general venta",
            field: "Ev_Des_gen_venta",
          },
          {
            label: "Descuento total artículo",
            field: "Ev_Des_total_art",
          },
          {
            label: "Impuesto",
            field: "Ev_Impuesto",
          },
          {
            label: "Subtotal",
            field: "Ev_Subtotal",
          },
          {
            label: "Venta total",
            field: "Ev_Total_venta",
          },
          {
            label: "Días crédito",
            field: "Ev_dias_credito",
          },
          {
            label: "Nombre movil",
            field: "Mov_Descripcion",
          },
          {
            label: "Nombre vendedor",
            field: "Per_Nombre",
          },
          {
            label: "Documento vendedor",
            field: "Per_Num_documento",
          },
          {
            label: "Autoriza garantía",
            field: "name_qautorizqa",
          },
          {
            label: "Documento autoriza garantía",
            field: "Eg_Quien_autoriza",
          },
          {
            label: "Observación",
            field: "Eg_Observacion",
          },
          {
            label: "Fecha garantía",
            field: "Eg_Fecha_control",
          },
          {
            label: "Fecha venta",
            field: "Ev_Fecha_venta",
          },
          {
            label: "Estado",
            field: "Estado",
          },
        ],
        data: [],
        title: "Ventas",
      },
      data: [],
      optionpdf: {
        columns: [
          {
            header: "Venta N°",
            dataKey: "Ev_Id",
          },
          {
            header: "NIT",
            dataKey: "CP_Nit",
          },
          {
            header: "Descuento general venta",
            dataKey: "Ev_Des_gen_venta",
          },
          {
            header: "Descuento total artículo",
            dataKey: "Ev_Des_total_art",
          },
          {
            header: "Impuesto",
            dataKey: "Ev_Impuesto",
          },
          {
            header: "Subtotal",
            dataKey: "Ev_Subtotal",
          },
          {
            header: "Venta total",
            dataKey: "Ev_Total_venta",
          },
          {
            header: "Días crédito",
            dataKey: "Ev_dias_credito",
          },
          {
            header: "Nombre movil",
            dataKey: "Mov_Descripcion",
          },
          {
            header: "Nombre vendedor",
            dataKey: "Per_Nombre",
          },
          {
            header: "Documento vendedor",
            dataKey: "Per_Num_documento",
          },
          {
            header: "Autoriza garantía",
            dataKey: "name_qautorizqa",
          },
          {
            header: "Documento autoriza garantía",
            dataKey: "Eg_Quien_autoriza",
          },
          {
            header: "Observación",
            dataKey: "Eg_Observacion",
          },
          {
            header: "Fecha garantía",
            dataKey: "Eg_Fecha_control",
          },
          {
            header: "Fecha venta",
            dataKey: "Ev_Fecha_venta",
          },
          {
            header: "Estado",
            dataKey: "Estado",
          },
        ],
        data: [],
        orientation: "l", // l => landscape, p => portrait
        title: {
          title: "Ventas realizadas",
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        },
      },
      btns: {
        range_date: true,
        btn_export_pdf: true,
        export_excel: true,
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9,
      },
      id_sale: null,
      options_clientes: all_clients,
      client_selected: null, //Cliente seleccionado
      dialog_detail: false,
      encabezado_selected: null,
      encebezado_venta: null,
      data_products: [],
      columns_products: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID Artículo",
          sortable: true,
          field: "Art_Id",
        },
        {
          name: "Art_Descripcion",
          align: "center",
          label: "Descripción articulo",
          sortable: true,
          field: "Art_Descripcion",
        },
        {
          name: "Dv_Precio_compra",
          align: "center",
          label: "Precio de compra",
          sortable: true,
          field: "Dv_Precio_compra",
        },
        {
          name: "Dv_precio_venta",
          align: "center",
          label: "Precio de venta",
          sortable: true,
          field: "Dv_precio_venta",
        },
        {
          name: "Dv_valor_descuento",
          align: "center",
          label: "Porcentaje descuento",
          sortable: true,
          field: "Dv_valor_descuento",
        },
        {
          name: "categoria",
          align: "center",
          label: "Categoría producto",
          sortable: true,
          field: "categoria",
        },
      ],
      columns_garantia: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID Artículo",
          sortable: true,
          field: "Art_Id",
        },
        {
          name: "Art_Codigo_inv",
          align: "center",
          label: "Código artículo",
          sortable: true,
          field: "Art_Codigo_inv",
        },
        {
          name: "Art_Nombre",
          align: "center",
          label: "Descripción articulo",
          sortable: true,
          field: "Art_Nombre",
        },
        {
          name: "Dg_Cant",
          align: "center",
          label: "Cantidad",
          sortable: true,
          field: "Dg_Cant",
        },
        {
          name: "Eg_Observacion",
          align: "center",
          label: "Observación",
          sortable: true,
          field: "Eg_Observacion",
        },
        {
          name: "Estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "Estado",
        },
      ],
      data_garantias: [],
      columns_cotizacion: [
        {
          name: "Ec_Id",
          align: "center",
          label: "Cotización N°",
          sortable: true,
          field: "Ec_Id",
        },
        {
          name: "CP_Nit",
          align: "center",
          label: "NIT",
          sortable: true,
          field: "CP_Nit",
        },
        {
          name: "CP_Razon_social",
          align: "center",
          label: "Razon social",
          sortable: true,
          field: "CP_Razon_social",
        },
        {
          name: "Ec_Des_gen_venta",
          align: "center",
          label: "Descuento general venta",
          sortable: true,
          field: "Ec_Des_gen_venta",
        },
        {
          name: "Ec_Des_total_art",
          align: "center",
          label: "Descuento total artículo",
          sortable: true,
          field: "Ec_Des_total_art",
        },
        {
          name: "Ec_Impuesto",
          align: "center",
          label: "Impuesto",
          sortable: true,
          field: "Ec_Impuesto",
        },
        {
          name: "Ec_Subtotal",
          align: "center",
          label: "Subtotal",
          sortable: true,
          field: "Ec_Subtotal",
        },
        {
          name: "Ec_Total_venta",
          align: "center",
          label: "Venta total",
          sortable: true,
          field: "Ec_Total_venta",
        },
        {
          name: "Mov_Descripcion",
          align: "center",
          label: "Nombre movil",
          sortable: true,
          field: "Mov_Descripcion",
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Nombre vendedor",
          sortable: true,
          field: "Per_Nombre",
        },
        {
          name: "Per_Num_documento",
          align: "center",
          label: "Documento vendedor",
          sortable: true,
          field: "Per_Num_documento",
        },
        {
          name: "Estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "Estado",
        },
      ],
      data_cotizaciones: [],
      column_det_cot: [
        {
          name: "Art_Id",
          align: "center",
          label: "ID Artículo",
          sortable: true,
          field: "Art_Id",
        },
        {
          name: "Art_Nombre",
          align: "center",
          label: "Nombre producto",
          sortable: true,
          field: "Art_Nombre",
        },
        {
          name: "Dc_Cant",
          align: "center",
          label: "Cantidad",
          sortable: true,
          field: "Dc_Cant",
        },
        {
          name: "Dc_Precio_compra",
          align: "center",
          label: "Precio de compra",
          sortable: true,
          field: "Dc_Precio_compra",
        },
        {
          name: "Dc_precio_venta",
          align: "center",
          label: "Precio de venta",
          sortable: true,
          field: "Dc_precio_venta",
        },
        {
          name: "Dc_valor_descuento",
          align: "center",
          label: "Valor descuento",
          sortable: true,
          field: "Dc_valor_descuento",
        },
      ],
      optionpdfcotizacion: {
        columns: [
          {
            header: "Cotización N°",
            dataKey: "Ec_Id",
          },
          {
            header: "NIT",
            dataKey: "CP_Nit",
          },
          {
            header: "Descuento general venta",
            dataKey: "Ec_Des_gen_venta",
          },
          {
            header: "Descuento total artículo",
            dataKey: "Ec_Des_total_art",
          },
          {
            header: "Impuesto",
            dataKey: "Ec_Impuesto",
          },
          {
            header: "Subtotal",
            dataKey: "Ec_Subtotal",
          },
          {
            header: "Venta total",
            dataKey: "Ec_Total_venta",
          },
          {
            header: "Nombre movil",
            dataKey: "Mov_Descripcion",
          },
          {
            header: "Nombre vendedor",
            dataKey: "Per_Nombre",
          },
          {
            header: "Documento vendedor",
            dataKey: "Per_Num_documento",
          },
          {
            header: "Estado",
            dataKey: "Estado",
          },
        ],
        data: [],
        orientation: "l", // l => landscape, p => portrait
        title: {
          title: "Cotizaciones realizadas",
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        },
      },
      excel_cotiza: {
        columns: [
          {
            label: "Cotización N°",
            field: "Ec_Id",
          },
          {
            label: "NIT",
            field: "CP_Nit",
          },
          {
            label: "Descuento general venta",
            field: "Ec_Des_gen_venta",
          },
          {
            label: "Descuento total artículo",
            field: "Ec_Des_total_art",
          },
          {
            label: "Impuesto",
            field: "Ec_Impuesto",
          },
          {
            label: "Subtotal",
            field: "Ec_Subtotal",
          },
          {
            label: "Venta total",
            field: "Ec_Total_venta",
          },
          {
            label: "Nombre movil",
            field: "Mov_Descripcion",
          },
          {
            label: "Nombre vendedor",
            field: "Per_Nombre",
          },
          {
            label: "Documento vendedor",
            field: "Per_Num_documento",
          },
          {
            label: "Estado",
            field: "Estado",
          },
        ],
        data: [],
        title: "Ventas",
      },
      data_det_cotiza: [],
      encabezado_cotiza: null,
      encabezado_cotiza_selecte: null,
      confirm_credit: false,
      options_me_pago: all_medios,
      mp_id: null,
      dias_credito: null,
      dialog_print_sale: false,
      product_saled: [],
      print_file: false,
    };
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    },
  },
  created() {
    this.getData();
  
  },
  watch: {
    client_selected(value) {
      if (value) {
        this.$q.loading.show({
          message: "Obteniendo ventas del cliente, por favor espere...",
        });
        setTimeout(async () => {
          try {
            const res_client = await this.getSalesClient(value).then((res) => {
              return res.data;
            });
            console.log({
              msg: "Respuesta get ventas al cliente",
              data: res_client,
            });
            if (res_client.ok) {
              if (res_client.result) {
                this.data.length = 0;
                res_client.data.forEach((venta) => {
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
                    icon_btn_details: "mdi-eye-settings",
                    btn_print: true,
                  });
                });
              } else {
                this.$q.notify({
                  message: "Sin resultados",
                  type: "warning",
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
              type: "negative",
            });
          } finally {
            this.$q.loading.hide();
          }
        }, 2000);
      }
    },
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
      "getCotizaciones",
      "getDetCotizacion",
      "getCotizacionRange",
      "insertEncVenta",
    ]),
    ...mapActions("shopping", ["getProviders"]),
    ...mapActions("master", ["getMedioPago"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const res_sales = await this.getSales().then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get ventas",
          //   data: res_sales
          // });
          this.data.length = 0;
          if (res_sales.ok) {
            if (res_sales.result) {
              res_sales.data.forEach((venta) => {
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
                  name_tc_id: venta.name_tc_id,
                  Per_Nombre: venta.Per_Nombre,
                  Per_Num_documento: venta.Per_Num_documento,
                  Estado: venta.name_estado,
                  status: venta.Ev_Estado,
                  Id: venta.Ev_Id,
                  title: venta.CP_Razon_social,
                  name_mp: venta.name_mp,
                  name_qautorizqa: venta.name_qautorizqa,
                  btn_edit: venta.Ev_Estado == 2 ? true : false,
                  btn_status: venta.Tc_Id == 2 ? true : false,
                  btn_details: true,
                  btn_pdf: true,
                  icon_btn_edit: "done_all",
                  icon_btn_status: "done",
                  icon_btn_details: "mdi-eye-settings",
                  btn_print: true,
                });
              });
              this.optionpdf.data = this.data;
              this.excel.data = this.data;
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning",
              });
            }
          } else {
            throw new Error(res_sales.message);
          }

          const res_provider = await this.getProviders().then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get clientes",
          //   data: res_provider
          // });
          all_clients.length = 0;
          if (res_provider.ok) {
            if (res_provider.result) {
              res_provider.data.forEach((cliente) => {
                if (cliente.name_tp == "CLIENTE" && cliente.CP_Razon_social) {
                  all_clients.push({
                    label: cliente.CP_Razon_social,
                    value: cliente.CP_Nit,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: res_provider.message,
                type: "warning",
              });
            }
          } else {
            throw new Error(res_provider.message);
          }

          const res_cotizacion = await this.getCotizaciones().then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get cotizaciones",
          //   data: res_cotizacion
          // });
          this.data_cotizaciones.length = 0;
          if (res_cotizacion.ok) {
            if (res_cotizacion.result) {
              res_cotizacion.data.forEach((cotizacion) => {
                this.data_cotizaciones.push({
                  CP_Nit: cotizacion.CP_Nit,
                  CP_Razon_social: cotizacion.CP_Razon_social,
                  Ec_Des_gen_venta: cotizacion.Ec_Des_gen_venta,
                  Ec_Des_total_art: cotizacion.Ec_Des_total_art,
                  Ec_Descuentog: cotizacion.Ec_Descuentog,
                  Ec_Fecha_control: cotizacion.Ec_Fecha_control,
                  Ec_Id: cotizacion.Ec_Id,
                  Ec_Impuesto: cotizacion.Ec_Impuesto,
                  Ec_Subtotal: cotizacion.Ec_Subtotal,
                  Ec_Total_venta: cotizacion.Ec_Total_venta,
                  Ec_Usuario_control: cotizacion.Ec_Usuario_control,
                  Ec_vigencia: cotizacion.Ec_vigencia,
                  Mov_Descripcion: cotizacion.Mov_Descripcion,
                  Mov_Id: cotizacion.Mov_Id,
                  Mp_Descripcion: cotizacion.Mp_Descripcion,
                  Mp_Id: cotizacion.Mp_Id,
                  Per_Nombre: cotizacion.Per_Nombre,
                  Per_Num_documento: cotizacion.Per_Num_documento,
                  Tc_Descripcion: cotizacion.Tc_Descripcion,
                  Tc_Id: cotizacion.Tc_Id,
                  Id: cotizacion.Ec_Id,
                  Ec_Estado: cotizacion.Ec_Estado,
                  Estado: cotizacion.Ec_Estado == 1 ? "Aceptado" : "Pendiente",
                  status: cotizacion.Ec_Estado,
                  title: `Cotización No. ${cotizacion.Ec_Id}`,
                  // btn_edit: true,
                  // btn_status: true,
                  btn_details: true,
                  btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  icon_btn_details: "mdi-eye-settings",
                });
              });
              this.optionpdfcotizacion.data = this.data_cotizaciones;
              this.excel_cotiza.data = this.data_cotizaciones;
            } else {
              this.$q.notify({
                message: res_cotizacion.message,
                type: "warning",
              });
            }
          } else {
            throw new Error(res_cotizacion.message);
          }

          const res_medio = await this.getMedioPago().then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get medio pago',
          //   data: res_medio
          // });
          if (res_medio.ok) {
            all_medios.length = 0;
            res_medio.data.forEach((element) => {
              if (element.Mp_Estado == 1) {
                all_medios.push({
                  label: element.Mp_Descripcion,
                  value: element.Mp_Id,
                });
              }
            });
          } else {
            throw new Error(res_medio.message);
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    detatilSale(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle de la venta, por favor espere..",
      });
      setTimeout(async () => {
        try {
          this.encabezado_selected = row;
          this.mp_id = row.Mp_Id;
          this.encebezado_venta = {
            "Venta N°": row.Ev_Id,
            NIT: row.CP_Nit,
            "Descuento general venta": row.Ev_Des_gen_venta,
            "Descuento total articulos": row.Ev_Des_total_art,
            Impuesto: row.Ev_Impuesto,
            Subtotal: row.Ev_Subtotal,
            "Total venta": row.Ev_Total_venta,
            "Días de crédito": row.Ev_dias_credito,
            Descripción: row.Mov_Descripcion,
            "Nombre vendedor": row.Per_Nombre,
            "Documento vendedor": row.Per_Num_documento,
            "Autoriza garantía": row.name_qautorizqa,
            "Quién autoriza": row.Eg_Quien_autoriza,
            Observación: row.Eg_Observacion,
            "Fecha venta": row.Ev_Fecha_venta,
            Estado: row.Estado,
          };
          this.data_products.length = 0;
          const res_deta = await this.getDetailSales(row.Ev_Id).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get detalle venta",
            data: res_deta,
          });
          if (res_deta.ok) {
            if (res_deta.result) {
              res_deta.data.forEach((product) => {
                this.data_products.push(product);
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning",
              });
            }
          } else {
            throw new Error(res_deta.message);
          }

          this.data_garantias.length = 0;
          const res_wara = await this.getDetailsGuarantess(row.Ev_Id).then(
            (res) => {
              return res.data;
            }
          );
          console.log({
            msg: "Respuesta get detalle garantia venta",
            data: res_wara,
          });
          if (res_wara.ok) {
            if (res_wara.result) {
              res_wara.data.forEach((producto) => {
                producto.Estado =
                  producto.Eg_estado == 0
                    ? "Pendiente por devolver"
                    : producto.Eg_estado == 1
                    ? "Devuelto"
                    : "Descontado";
                this.data_garantias.push(producto);
              });
            } else {
              this.$q.notify({
                message: "Venta sin productos de garantía",
                type: "warning",
              });
            }
          } else {
            throw new Error(res_wara.message);
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    generatePdf(row) {
      this.$q.loading.show({
        message: 'Generando pdf, por favor espere...'
      })
      setTimeout(async () => {
        try {
          this.data_products.length = 0;
          const res_deta = await this.getDetailSales(row.Ev_Id).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get detalle venta pdf",
          //   data: res_deta,
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
                  Dv_valor_descuento: Math.round(
                    product.Dv_precio_venta * product.Dv_Cant -
                      (product.Dv_Precio_compra +
                        product.Dv_Precio_compra *
                          (product.Dv_valor_descuento / 100)) *
                        product.Dv_Cant
                  ),
                  subtotal: product.Dv_precio_venta * product.Dv_Cant,
                  categoria: product.categoria,
                });
              });
              var doc = new jsPDF("p", "mm", "a4");

              doc.autoTable({
                body: this.data_products,
                columns: [
                  { header: "Item", dataKey: "item" },
                  { header: "Codigo", dataKey: "Art_Codigo_inv" },
                  { header: "Descripcion item", dataKey: "Art_Descripcion" },
                  { header: "Cant", dataKey: "Dv_Cant" },
                  { header: "Vr. Unitario", dataKey: "Dv_precio_venta" },
                  { header: "Vr. Descuento", dataKey: "Dv_valor_descuento" },
                  { header: "Vr. Total", dataKey: "subtotal" },
                ],
                margin: { top: 64, right: 10, left: 10, bottom: 50 },
                styles: {
                  overflow: "linebreak",
                  fontSize: 7,
                  lineWidth: 1,
                  lineColor: [150, 152, 154],
                  overflowColumns: "linebreak",
                },
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
                doc.text(15, 62, "Forma de pago: " + row.name_mp);
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

                if (row.Tc_Id == 2) {
                  var name_comprobante = "O. Pedido";
                } else {
                  var name_comprobante = row.name_tc_id;
                }
                doc.text(172, 47, name_comprobante);

                doc.text(172, 54, "" + row.Ev_Id);
                doc.rect(10, 24, 190, 40);

                //INICIA EL MARCO DE TODO EL FORMATO
                // Descripcion_trabajo  Observacion_encontrada
                // doc.addImage(img, "PNG", 10, 10, 20, 12, "sicte", "SLOW", 0);
                doc.rect(10, 10, 20, 12);
                doc.setFontSize(16);
                doc.text(60, 17.5, "FORMATO DE " + row.name_tc_id);
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

                doc.rect(10, 243, 190, 11);
                doc.text(15, 247, "IMPORTE TOTAL CON LETRA:");
                var letranum=  numeros_letras(row.Ev_Total_venta).toUpperCase();
                doc.text(15, 251, letranum);
                doc.rect(10, 254, 90, 30);
                doc.line(55, 254, 55, 284, "S");
                doc.text(12, 258, "Firma Autoriza");
                doc.text(57, 258, "Firma Cliente");
                doc.rect(100, 254, 50, 30);
                doc.line(100, 269, 150, 269, "S");
                doc.text(101, 258, "Total Abonos");
                doc.text(101, 273, "Total Saldos");
                doc.rect(150, 254, 50, 30);
                doc.text(177, 258, "Totales");
                doc.line(175, 254, 175, 284, "S");
                doc.text(152, 263, "Subtotal"); //Ev_Impuesto, Ev_Subtotal, Ev_Des_total_art, Ev_Descuentog, Ev_Des_gen_venta, Ev_Total_venta,
                doc.text(177, 263, "$ " + row.Ev_Subtotal);
                doc.text(152, 268, "Dcto Art");
                doc.text(177, 268, "$ " + row.Ev_Des_total_art);
                doc.text(152, 273, "Dcto Gral");
                doc.text(177, 273, "" + row.Ev_Descuentog);
                doc.text(152, 278, "Igv %");
                doc.text(177, 278, "" + row.Ev_Impuesto);
                doc.text(152, 283, "Total a pagar");
                doc.text(177, 283, "$ " + row.Ev_Total_venta);
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
              doc.save("Venta N° " + row.Ev_Id + ".pdf");
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning",
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 500);
    },
    getDataPrint(row){
      this.$q.loading.show({
        message: 'Imprimiendo, por favor espere...'
      })
      setTimeout(async () => {
        try {
          this.print_file = false;
          this.encabezado_selected = row;
          this.data_products.length = 0;
          this.encabezado_selected.cantidad_art = 0;
          const res_deta = await this.getDetailSales(row.Ev_Id).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get detalle venta pdf",
          //   data: res_deta,
          // });
          this.product_saled.length = 0;
          if (res_deta.ok) {
            if (res_deta.result) {
              res_deta.data.forEach( product => {
                this.encabezado_selected.cantidad_art = Number(this.encabezado_selected.cantidad_art) + Number(product.Dv_Cant);
                this.product_saled.push({
                  codigo: product.Art_Codigo_inv,
                  descripcion: product.Art_Descripcion,
                  cantidad: product.Dv_Cant,
                  precio_un: product.Dv_precio_venta,
                  valor: Number(product.Dv_Cant) * Number(product.Dv_precio_venta),
                  Dv_valor_descuento: product.Dv_valor_descuento,
                })
              })
              this.dialog_print_sale = true;
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning",
              });
            }
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 500);
    },
    printSale(){
      this.print_file = true;
      window.print();
    },
    generatePdfcot(row) {
      setTimeout(async () => {
        try {
          this.data_det_cotiza.length = 0;
          const res_detail = await this.getDetCotizacion(row.Id).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get detalle cotizacion pdf",
            data: res_detail,
          });
          if (res_detail.ok) {
            if (res_detail.result) {
              res_detail.data.forEach((product, index) => {
                this.data_det_cotiza.push({
                  item: parseInt(index + 1),
                  Art_Codigo_inv: product.cond_inventario,
                  Art_Descripcion: product.Art_Nombre,
                  Art_Id: product.Art_Id,
                  Dv_Cant: product.Dc_Cant,
                  Dv_Precio_compra: product.Dc_Precio_compra,
                  Dv_precio_venta: product.Dc_precio_venta,
                  Dv_valor_descuento:  Math.round(
                    product.Dc_precio_venta * product.Dc_Cant -
                      (product.Dc_Precio_compra +
                        product.Dc_Precio_compra *
                          (product.Dc_valor_descuento / 100)) *
                        product.Dc_Cant
                  ),
                  subtotal: product.Dc_precio_venta * product.Dc_Cant,
                  // categoria: product.categoria
                });
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning",
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
            type: "negative",
          });
        }

        var docs = new jsPDF("p", "mm", "a4");

        function addWaterMarks(docs) {
          var totalPages = docs.internal.getNumberOfPages();

          for (i = 1; i <= totalPages; i++) {
            docs.setPage(i);
            //docs.addImage(imgData, 'PNG', 40, 40, 75, 75);
            docs.setFontSize(38);
            docs.setTextColor(150);
            docs.text(
              50,
              docs.internal.pageSize.height - 130,
              "CR DISTRIBUIDORA",
              null,
              45
            );
          }

          return docs;
        }
        //  docs = addWaterMarks(docs);
        docs.autoTable({
          body: this.data_det_cotiza,
          columns: [
            { header: "Item", dataKey: "item" },
            { header: "Codigo", dataKey: "Art_Codigo_inv" },
            { header: "Descripcion item", dataKey: "Art_Descripcion" },
            { header: "Cant", dataKey: "Dv_Cant" },
            { header: "Vr. Unitario", dataKey: "Dv_precio_venta" },
            { header: "Vr. Descuento", dataKey: "Dv_valor_descuento" },
            { header: "Vr .Total", dataKey: "subtotal" },
          ],
          margin: { top: 64, right: 10, left: 10, bottom: 50 },
          styles: {
            overflow: "linebreak",
            fontSize: 7,
            lineWidth: 1,
            lineColor: [150, 152, 154],
            overflowColumns: "linebreak",
          },
        });

        const pageCounts = docs.internal.getNumberOfPages();

        for (var i = 1; i <= pageCounts; i++) {
          docs.setFontSize(8);

          //   //MARCO DONDE MUESTRA LA INFORMACION DEL CLIENTE FACTURA Y FECHA
          docs.text(15, 32, "CLIENTE");
          docs.text(15, 37, "Razon social: " + row.CP_Razon_social);
          docs.text(15, 42, "Nombre: ");
          docs.text(15, 47, "Domicilio: ");
          docs.text(15, 52, "Nit o CC: " + row.CP_Nit);
          docs.text(15, 57, "Email: ");
          docs.text(15, 62, "Forma de pago: "+row.Mp_Descripcion);

          docs.setFontSize(11);
          // docs.setTextColor(255, 215, 0);
          docs.setFillColor("#F7C66D");
          docs.roundedRect(168, 26, 30, 9, 5.5, 5.5, "FD");
          docs.setTextColor("#000000");
          docs.text(172, 32, "Fecha");
          // docs.setTextColor('#000000');
          docs.text(172, 39, row.Ec_Fecha_control);
          docs.setFillColor("#33ff42");
          docs.roundedRect(168, 41, 30, 9, 5.5, 5.5, "FD");
          docs.text(172, 47, "N° Cotizacion");

          docs.text(172, 54, "" + row.Ec_Id);
          docs.rect(10, 24, 190, 40);

          //INICIA EL MARCO DE TODO EL FORMATO
          // Descripcion_trabajo  Observacion_encontrada
          // docs.addImage(img, "PNG", 10, 10, 20, 12, "sicte", "SLOW", 0);
          docs.rect(10, 10, 20, 12);
          docs.setFontSize(16);
          docs.text(60, 17.5, "FORMATO DE COTIZACION");
          docs.rect(30, 10, 135, 12); //rect(x,y,width, height)
          docs.setFontSize(8);
          docs.text(167, 13.5, "Codigo");
          docs.rect(165, 10, 15, 6);
          docs.text(182, 13.5, "HSEQ-F-003");
          docs.rect(180, 10, 20, 6);
          docs.text(167, 19.5, "Versión");
          docs.rect(165, 16, 15, 6);
          docs.text(190, 19.5, "01");
          docs.rect(180, 16, 20, 6);

          docs.rect(10, 243, 190, 11);
          docs.text(15, 247, "IMPORTE TOTAL CON LETRA:");
          var letranum=  numeros_letras(row.Ev_Total_venta).toUpperCase();
          doc.text(15, 251, letranum);
          docs.rect(10, 254, 90, 30);
          docs.line(55, 254, 55, 284, "S");
          docs.text(12, 258, "Firma Autoriza");
          docs.text(57, 258, "Firma Cliente");
          docs.rect(100, 254, 50, 30);
          docs.line(100, 269, 150, 269, "S");
          docs.text(101, 258, " ");
          docs.text(101, 273, " ");
          docs.rect(150, 254, 50, 30);
          docs.text(177, 258, "Totales");
          docs.line(175, 254, 175, 284, "S");
          docs.text(152, 263, "Subtotal"); //Ev_Impuesto, Ev_Subtotal, Ev_Des_total_art, Ev_Descuentog, Ev_Des_gen_venta, Ev_Total_venta,
          docs.text(177, 263, "$ " + row.Ec_Subtotal);
          docs.text(152, 268, "Dcto Art");
          docs.text(177, 268, "$ " + row.Ec_Des_gen_venta);
          docs.text(152, 273, "Dcto Gral");
          docs.text(177, 273, "" + row.Ec_Descuentog);
          docs.text(152, 278, "Igv %");
          docs.text(177, 278, "" + row.Ec_Impuesto);
          docs.text(152, 283, "Total a pagar");
          docs.text(177, 283, "$ " + row.Ec_Total_venta);
          docs.setPage(i);
          //   //Print Page 1 of 4 for example
          docs.text(
            "Pagina " + String(i) + " de " + String(pageCounts),
            210 - 100,
            297 - 10,
            null,
            null,
            "right"
          );
        }
       
        docs.save("Cotizacion N° " + row.Ec_Id + ".pdf");
      }, 1000);
    },
    getSalesByRange(date) {
      this.$q.loading.show({
        message: "Obteniendo ventas, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const res_sales = await this.getSalesRange(date).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get ventas por rango",
          //   data: res_sales
          // });
          if (res_sales.ok) {
            if (res_sales.result) {
              this.data.length = 0;
              res_sales.data.forEach((venta) => {
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
                  btn_edit: venta.Ev_Estado == 1 ? true : false,
                  btn_status: venta.Tc_Id == 2 ? true : false,
                  btn_details: true,
                  btn_pdf: true,
                  btn_print: true,
                  icon_btn_edit: "done_all",
                  icon_btn_status: "done",
                  icon_btn_details: "mdi-eye-settings",
                });
              });
              this.optionpdf.data = this.data;
            } else {
              this.$q.notify({
                message: res_sales.message,
                type: "warning",
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    searchSale() {
      this.$q.loading.show({
        message: "Buscando venta, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const res_sales = await this.getSearchSales(this.id_sale).then(
            (res) => {
              return res.data;
            }
          );
          console.log({
            msg: "Respuesta get venta",
            data: res_sales,
          });
          if (res_sales.ok) {
            if (res_sales.result) {
              this.data.length = 0;
              res_sales.data.forEach((cat) => {
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
                  btn_print: true,
                  icon_btn_edit: "edit",
                });
              });
            } else {
              this.$q.notify({
                message: res_sales.message,
                type: "warning",
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    getCotizRange(date) {
      this.$q.loading.show({
        message:
          "Obtieniendo cotizaciones en la rango seleccionado, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const res_cotizacion = await this.getCotizacionRange(date).then(
            (res) => {
              return res.data;
            }
          );
          // console.log({
          //   message: 'Respuesta get cotizaciones por rango',
          //   data: res_cotizacion
          // })
          this.data_cotizaciones.length = 0;
          if (res_cotizacion.ok) {
            if (res_cotizacion.result) {
              res_cotizacion.data.forEach((cotizacion) => {
                this.data_cotizaciones.push({
                  CP_Nit: cotizacion.CP_Nit,
                  CP_Razon_social: cotizacion.CP_Razon_social,
                  Ec_Des_gen_venta: cotizacion.Ec_Des_gen_venta,
                  Ec_Des_total_art: cotizacion.Ec_Des_total_art,
                  Ec_Descuentog: cotizacion.Ec_Descuentog,
                  Ec_Fecha_control: cotizacion.Ec_Fecha_control,
                  Ec_Id: cotizacion.Ec_Id,
                  Ec_Impuesto: cotizacion.Ec_Impuesto,
                  Ec_Subtotal: cotizacion.Ec_Subtotal,
                  Ec_Total_venta: cotizacion.Ec_Total_venta,
                  Ec_Usuario_control: cotizacion.Ec_Usuario_control,
                  Ec_vigencia: cotizacion.Ec_vigencia,
                  Mov_Descripcion: cotizacion.Mov_Descripcion,
                  Mov_Id: cotizacion.Mov_Id,
                  Mp_Descripcion: cotizacion.Mp_Descripcion,
                  Mp_Id: cotizacion.Mp_Id,
                  Per_Nombre: cotizacion.Per_Nombre,
                  Per_Num_documento: cotizacion.Per_Num_documento,
                  Tc_Descripcion: cotizacion.Tc_Descripcion,
                  Tc_Id: cotizacion.Tc_Id,
                  Id: cotizacion.Ec_Id,
                  Ec_Estado: cotizacion.Ec_Estado,
                  Estado: cotizacion.Ec_Estado == 1 ? "Aceptado" : "Pendiente",
                  status: cotizacion.Ec_Estado,
                  title: `Cotización No. ${cotizacion.Ec_Id}`,
                  // btn_edit: true,
                  // btn_status: true,
                  btn_details: true,
                  btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  icon_btn_details: "mdi-eye-settings",
                });
              });
              this.optionpdfcotizacion.data = this.data_cotizaciones;
              this.excel_cotiza.data = this.data_cotizaciones;
            } else {
              this.$q.notify({
                message: res_cotizacion.message,
                type: "warning",
              });
            }
          } else {
            throw new Error(res_cotizacion.message);
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
    },
    detatilCotizacion(row) {
      this.$q.loading.show({
        message: "Obteniendo detalle de la cotización, por favor espere...",
      });
      setTimeout(async () => {
        try {
          this.encabezado_cotiza_selecte = row;
          this.encabezado_cotiza = {
            "Cotización N°": row.Ec_Id,
            NIT: row.CP_Nit,
            "Razon social": row.CP_Razon_social,
            "Descuento general venta": row.Ec_Des_gen_venta,
            "Descuento total articulos": row.Ec_Des_total_art,
            Descuento: row.Ec_Descuentog,
            Impuesto: row.Ec_Impuesto,
            "Subtotal venta": row.Ec_Subtotal,
            "Total venta": row.Ec_Total_venta,
            Vigencia: row.Ec_vigencia,
            "Nombre movil": row.Mov_Descripcion,
            "Medio pago": row.Mp_Descripcion,
            "Nombre vendedor": row.Per_Nombre,
            "Documento vendedor": row.Per_Num_documento,
            "Tipo comprobante": row.Tc_Descripcion,
            Estado: row.Ec_Estado == 1 ? "Aceptado" : "Pendiente",
          };
          const res_det = await this.getDetCotizacion(row.Id).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get detalle cotización',
          //   data: res_det
          // })
          this.data_det_cotiza.length = 0;
          if (res_det.ok) {
            if (res_det.result) {
              res_det.data.forEach((product) => {
                this.data_det_cotiza.push({
                  Art_Id: product.Art_Id,
                  Art_Nombre: product.Art_Nombre,
                  Dc_Cant: product.Dc_Cant,
                  Dc_Precio_compra: product.Dc_Precio_compra,
                  Dc_precio_venta: product.Dc_precio_venta,
                  Dc_valor_descuento: product.Dc_valor_descuento,
                });
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning",
              });
            }
          } else {
            throw new Error(res_det.message);
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
    },
    // Cambia el estado de la venta a si ya fue entregado el material
    deliverProduct(row) {
      this.$q
        .dialog({
          title: "Confirmar entrega de material",
          message:
            "Estas confirmando la entrega de material, por favor ingrese su contraseña",
          prompt: {
            model: "",
            type: "password", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          let password = this.aesEncrypt(data);
          if (password == this.data_user.Usu_Clave_verificacion) {
            this.$q.loading.show({
              message: "Confirmando entrega, por favor espere...",
            });
            this.timer = setTimeout(async () => {
              try {
                row.base = process.env.__BASE__;
                row.Ev_Usuario_control = this.data_user.Per_Num_documento; //Si es a credito es 0
                row.Ev_Entregado = 1;
                row.Tc_Id = 1;
                const res_enc = await this.insertEncVenta(row).then((res) => {
                  return res.data;
                });
                console.log({
                  msg: "Respuesta insert enc venta",
                  data: res_enc,
                });
                if (res_enc.ok) {
                  this.$q.notify({
                    message: "Entregado",
                    type: "positive",
                  });
                } else {
                  throw new Error("No pudimos confirmar la entrega");
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
                  type: "negative",
                });
              } finally {
                this.$q.loading.hide();
              }
              this.timer = setTimeout(this.getData(), 1000);
            }, 1000);
          } else {
            this.$q.notify({
              message: "Las contraseñas no coinciden",
              type: "warning",
            });
          }
        });
    },
    aprovedCredit(row) {
      this.$q
        .dialog({
          component: dialog,
          parent: this,
          title: "Aprobación de créditos",
          msg: "Esta venta ha sido realizada como crédito, ¿Seguro que desea aprobarla?",
        })
        .onOk(() => {
          this.$q.loading.show({
            message: "Aprobando crédito, por favor espere...",
          });
          this.timer = setTimeout(async () => {
            try {
              row.base = process.env.__BASE__;
              row.Ev_Usuario_control = this.data_user.Per_Num_documento; //Si es a credito es 0
              row.Ev_Estado = 1;
              const res_enc = await this.insertEncVenta(row).then((res) => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta insert enc venta',
              //   data: res_enc
              // });
              if (res_enc.ok) {
                this.$q.notify({
                  message: "Aprovado",
                  type: "positive",
                });
              } else {
                throw new Error("No pudimos confirmar la entrega");
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
                type: "negative",
              });
            } finally {
              this.$q.loading.hide();
            }
            this.timer = setTimeout(this.getData(), 1000);
          }, 1000);
          // let password = this.aesEncrypt(data);
          // if (password == this.data_user.Usu_Clave_verificacion) {
          // } else {
          //   this.$q.notify({
          //     message: "Las contraseñas no coinciden",
          //     type: "warning"
          //   });
          // }
        })
        .onCancel(() => {
          this.$q.loading.show({
            message: "Anulando crédito, por favor espere...",
          });
          this.timer = setTimeout(async () => {
            try {
              row.base = process.env.__BASE__;
              row.Ev_Usuario_control = this.data_user.Per_Num_documento; //Si es a credito es 0
              row.Ev_Estado = 0;
              const res_enc = await this.insertEncVenta(row).then((res) => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta insert enc venta',
              //   data: res_enc
              // });
              if (res_enc.ok) {
                this.$q.notify({
                  message: "Aprovado",
                  type: "positive",
                });
              } else {
                throw new Error("No pudimos confirmar la entrega");
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
                type: "negative",
              });
            } finally {
              this.$q.loading.hide();
            }
            this.timer = setTimeout(this.getData(), 1000);
          }, 1000);
          // let password = this.aesEncrypt(data);
          // if (password == this.data_user.Usu_Clave_verificacion) {
          // } else {
          //   this.$q.notify({
          //     message: "Las contraseñas no coinciden",
          //     type: "warning"
          //   });
          // }
        });
    },
    // Cambia el método de pago
    changeMethod() {
      this.$q.loading.show({
        message: "Aprobando crédito, por favor espere...",
      });
      this.timer = setTimeout(async () => {
        try {
          this.encabezado_selected.base = process.env.__BASE__;
          this.encabezado_selected.Ev_Usuario_control =
            this.data_user.Per_Num_documento; //Si es a credito es 0
          this.encabezado_selected.Mp_Id = this.mp_id;
          this.encabezado_selected.Ev_dias_credito = this.dias_credito;
          const res_enc = await this.insertEncVenta(
            this.encabezado_selected
          ).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta insert enc venta',
          //   data: res_enc
          // });
          if (res_enc.ok) {
            this.$q.notify({
              message: "Método de pago cambiado",
              type: "positive",
            });
            this.mp_id = null;
            this.dias_credito = null;
            this.reload();
          } else {
            throw new Error("No pudimos cambiar el método de pago");
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
        this.timer = setTimeout(this.getData(), 1000);
      }, 1000);
    },
    reload() {
      this.dialog_detail = false;
      this.tab = "sales";
      setTimeout(() => {
        this.$emit("reloadNotifications");
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
                (v) =>
                  v.label.toLowerCase().indexOf(needle) > -1 ||
                  v.value.toString().toLowerCase().indexOf(needle) > -1
              );
            }
          },
          (ref) => {
            if (val !== "" && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    },
    // Encripta contraseñas o strings
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(
        txt,
        CryptoJS.enc.Utf8.parse(process.env.__KEY__),
        {
          iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
          mode: CryptoJS.mode.CBC,
        }
      ).toString();
      return cipher.toString();
    },
  },
  beforeDestroy() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.$q.loading.hide();
    }
  },
};
</script>

<style scoped>
.alto_tabla {
  height: 450px;
}

td.data,
th.data,
tr.data,
table.ticket_print {
  border-top: 1px solid black;
  border-collapse: collapse;
  text-align: center;
}
table{
  min-width: 350px;
}
.cantidad{
  width: 38px !important;
  max-width: 38px !important;
  word-break: break-all;
}
.codigo {
  width: 46px !important;
  max-width: 46px !important;
  word-break: break-all;
}
.producto{
  width: 120px !important;
  max-width: 120px !important;
  word-break: break-all;
}
.val_uni{
  width: 60px !important;
  max-width: 60px !important;
  word-break: break-all;
}
.precio{
  width: 60px !important;
  max-width: 60px !important;
  word-break: break-all;
}

@media print {
  .btn_print,
  .btn_print * {
    display: none !important;
  }
}

.ticket {
  width: 350px;
  max-width: 350px;
  background: #fff;
}

img {
  /* max-width: inherit;
  width: inherit; */
  margin: auto;
  height: 130px;
}
</style>
