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
          <q-tab name="transfer" label="Traslados" icon="sync_alt"/>
          <q-tab name="transfer_cellar" label="Realizar Translados" icon="refresh"/>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="transfer">
            <component-table
              title="Traslados realizados"
              :propdata="data"
              :propcolumns="columns"
              :propgrid="true"
              :propflat="true"
              @ondetails="detailsTransfer"
            >
              <template v-slot:header-cell-calories="props">
                <q-th :props="props">
                  <q-icon name="thumb_up" size="1.5em" />
                  {{ props.col.label }}
                </q-th>
              </template>
            </component-table>

            <!-- Dialogo del detalle del traslado -->
            <q-dialog v-model="dailog_details" persistent transition-show="flip-down" transition-hide="flip-up" full-width>
              <q-card>
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
                    class="col-xs-12 col-md-3 col-lg-2 q-px-sm"
                    v-for="(value, index) in encabezado_traslado"
                    :key="index"
                  >
                    <q-field :hint="index" stack-label dense>
                      <template v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">{{value}}</div>
                      </template>
                    </q-field>
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-table
                    title="Productos trasladados"
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
                      <q-td :props="props" style="text-align: center !important">
                        {{ props.value }}
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn label="guardar" color="green" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-tab-panel>

          <q-tab-panel name="transfer_cellar">
            <component-do-transfer @reload="reload"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
import ComponentDoTransfer from 'components/Warehouse/ComponentDoTransfer';
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from 'vuex';
export default {
  name: 'transfers',
  components:{
    ComponentDoTransfer,
    componentTable
  },
  data(){
    return {
      tab: 'transfer',
      columns: [
        {
          name: 'Etm_Id',
          align: 'center',
          label: 'ID Traslado',
          sortable: true,
          field: 'Etm_Id'
        },
        {
          name: 'name_m_entrega',
          align: 'center',
          label: 'Móvil origen',
          sortable: true,
          field: 'name_m_entrega'
        },
        {
          name: 'name_m_recibe',
          align: 'center',
          label: 'Móvil destino',
          sortable: true,
          field: 'name_m_recibe'
        },
        {
          name: 'Etm_Observaciones',
          align: 'center',
          label: 'Observaciones',
          sortable: true,
          field: 'Etm_Observaciones'
        },
        {
          name: 'name_p_entrega',
          align: 'center',
          label: 'Mombre quien entrega',
          sortable: true,
          field: 'name_p_entrega'
        },
        {
          name: 'Etm_Usuario_entrega',
          align: 'center',
          label: 'Documento quien entrega',
          sortable: true,
          field: 'Etm_Usuario_entrega'
        },
        {
          name: 'name_p_recibe',
          align: 'center',
          label: 'Nombre quien recibe',
          sortable: true,
          field: 'name_p_recibe'
        },
        {
          name: 'Etm_Usuario_recibe',
          align: 'center',
          label: 'Documento quien recibe',
          sortable: true,
          field: 'Etm_Usuario_recibe'
        },
        {
          name: 'Etm_Fecha_entrega',
          align: 'center',
          label: 'Fecha entrega',
          sortable: true,
          field: 'Etm_Fecha_entrega'
        },
        {
          name: 'Etm_Fecha_recibe',
          align: 'center',
          label: 'Fecha recibido',
          sortable: true,
          field: 'Etm_Fecha_recibe'
        },
        {
          name: 'Estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'Estado'
        },
      ],
      data: [],
      encabezado_selecte: {}, //Encabezado del traslado seleccionado
      encabezado_traslado: {}, //Encabezado del traslado formateado para el frontend
      dailog_details: false, //Dialogo para el detalle del traslado
      data_details: [], //Productos trasladados
      initial_pagination: {
        page: 1,
        rowsPerPage: 10
      }
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      "getTransfer",
      "getTransferRange",
      'getDetailsTransfer'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo traslados, por favor espere...'
      });
      setTimeout(async() => {
        try {
          const res_traslados = await this.getTransfer().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get traslados',
          //   data: res_traslados
          // })
          if(res_traslados.ok){
            if(res_traslados.result){
              this.data.length = 0;
              res_traslados.data.forEach(element => {
                this.data.push({
                  Etm_Estado: element.Etm_Estado,
                  Etm_Id: element.Etm_Id,
                  Etm_Mov_ID_entrega: element.Etm_Mov_ID_entrega,
                  Etm_Mov_Id_recibe: element.Etm_Mov_Id_recibe,
                  id: element.id,
                  Etm_Usuario_entrega: element.Etm_Usuario_entrega,
                  name_m_entrega: element.name_m_entrega,
                  Etm_Usuario_recibe: element.Etm_Usuario_recibe,
                  name_m_recibe: element.name_m_recibe,
                  name_p_entrega: element.name_p_entrega,
                  name_p_recibe: element.name_p_recibe,
                  Etm_Observaciones: element.Etm_Observaciones,
                  Etm_Fecha_entrega: element.Etm_Fecha_entrega,
                  Etm_Fecha_recibe: element.Etm_Fecha_recibe,
                  title: `Movimiento No. ${element.id}`,
                  Estado: element.Etm_Estado == 1 ? 'ENTREGADO' : 'PENDIENTE',
                  status: element.Etm_Estado,
                  btn_details: true,
                  icon_btn_details: "mdi-eye-settings",
                  // btn_edit: false,
                  // btn_status: false,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                })
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_traslados.message)
          }
        } catch (e) {
          
        } finally {
          this.$q.loading.hide();
        }
      }, 2000)
    },
    reload(){
      this.tab = 'transfer';
      setTimeout(()=> {
        this.getData();
      }, 500)
    },
    detailsTransfer(row){
      this.$q.loading.show({
        message: 'Obteniendo detalles del traslado, por favor espere...'
      });
      setTimeout(async() => {
        try {
          this.encabezado_selecte = row;
          // Modificamos las propiedades de la devolución seleccionada para luego recorrerlo con un for y mostrar los datos en el fronent
          this.encabezado_traslado = {
            'Traslado No.': row.id,
            'Móvil origen': row.name_m_entrega,
            'Móvil destino': row.name_m_recibe,
            'Documento quien entrega': row.Etm_Usuario_entrega,
            'Nombre quien entrega': row.name_p_entrega,
            'Documento quien recibe': row.Etm_Usuario_recibe,
            'Nombre quien recibe': row.name_p_recibe,
            'Observaciones': row.Etm_Observaciones,
            'Estado': row.Estado,
          }
          const res_det = await this.getDetailsTransfer(row.id).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get detalle del traslado',
            data: res_det
          })
          if(res_det.ok){
            if(res_det.result){
              this.data_details.length = 0;
              res_det.data.forEach( product => {
                this.data_details.push({
                  'Id traslado': product.Etm_Id,
                  'Id producto': product.Art_Id,
                  'Codigo producto': product.Art_Codigo_inv,
                  'Descripción': product.Art_Nombre,
                  'Cantidad trasladada': product.Dtm_Cant,
                  'Observación': product.Dtm_Observacion,
                })
              })
            } else {
              this.$q.notify({
                message: 'Ops!, sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_det.message);
          }
          this.dailog_details = true;
        } catch (e) {
          console.log(e)
        } finally {
          this.$q.loading.hide();
        }
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
