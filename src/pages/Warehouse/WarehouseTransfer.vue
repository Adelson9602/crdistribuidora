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
                <q-form
                  @submit="updateTraslado"
                >
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
                      class="col-xs-12 col-md-4 col-lg-3 q-px-sm"
                      v-for="(value, index) in encabezado_traslado"
                      :key="index"
                    >
                      <!-- Items para entregados -->
                      <q-field
                        :hint="index"
                        stack-label
                        dense
                        v-if="encabezado_selecte.Etm_Estado == 1 "
                      >
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">{{value}}</div>
                        </template>
                      </q-field>
                      <!-- Items para pendiente -->
                      <q-field
                        :hint="index"
                        stack-label
                        dense
                        v-if="encabezado_selecte.Etm_Estado == 0 && index != 'Estado' && encabezado_selecte.Etm_Estado == 0 && index != 'Nombre quien recibe'"
                      >
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">{{value}}</div>
                        </template>
                      </q-field>
                      <q-select
                        dense
                        v-model="etm_Estado"
                        :options="options_state"
                        hint="Estado"
                        :rules="[validateState]"
                        map-options
                        emit-value
                        v-if="index == 'Estado' && encabezado_selecte.Etm_Estado == 0"
                      />
                      <q-select
                        dense
                        v-model="integ_movil_destino"
                        :options="opt_inte_destino"
                        hint="Integrante destino"
                        :rules="[val => !!val || 'Integrante es requerido']"
                        map-options
                        emit-value
                        v-if="index == 'Nombre quien recibe' && encabezado_selecte.Etm_Estado == 0"
                      />
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
                    <q-btn label="guardar" type="submit" color="green" v-if="etm_Estado == 1"/>
                  </q-card-actions>
                </q-form>
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
import { date } from 'quasar';
import { mapActions } from 'vuex';
let integ_movil_destino = [];
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
      },
      options_state: [
        {
          label: 'ENTREGADO',
          value: 1
        },
        {
          label: 'PENDIENTE',
          value: 0
        },
      ],
      opt_inte_destino: integ_movil_destino,
      integ_movil_destino: null,
      etm_Estado: null, //Estado seleciconado
    }
  },
  watch: {
    integ_movil_destino(value){
      this.encabezado_selecte.Etm_Usuario_recibe = value;
      this.encabezado_traslado['Documento quien recibe'] = value;
    },
    etm_Estado(value){
      let timeStamp = Date.now()
      let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD');
      this.encabezado_traslado['Fecha recibido'] = formattedString;
      this.encabezado_selecte.Etm_Estado = value;
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      'getTransfer',
      'getTransferRange',
      'getDetailsTransfer',
      'insertEncTransfer',
      'updateInventarioMovil'
    ]),
    ...mapActions('master', [
      'getMembersMovil'
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
          this.encabezado_selecte.Etm_Estado = Number(row.Etm_Estado)
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
            'Fecha entregado': row.Etm_Fecha_entrega,
            'Fecha recibido': row.Etm_Fecha_recibe,
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

          if(this.encabezado_selecte.Etm_Estado == 0){
            setTimeout(() => {
              this.getDataMovilDestino(this.encabezado_selecte.id);
            }, 300)
          }
          this.dailog_details = true;
        } catch (e) {
          console.log(e)
        } finally {
          this.$q.loading.hide();
        }
      }, 2000)
    },
    // Actualizamos el estado del traslado
    updateTraslado(){
      this.$q.loading.show({
        message: 'Realizando entrega, por favor espere...'
      });
      setTimeout( async ()=> {
        try {
          if(this.encabezado_selecte.Etm_Estado == 1){
            let timeStamp = Date.now()
            let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD');
            this.encabezado_selecte.base = process.env.__BASE__;
            this.encabezado_selecte.Etm_Fecha_recibe = formattedString;
            this.encabezado_selecte.Etm_Usuario_recibe = this.integ_movil_destino;
            const res_enc = await this.insertEncTransfer(this.encabezado_selecte).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Respuesta insert update encabezado traslado',
              data: res_enc
            });
            if(!res_enc.ok){
              throw new Error(res_enc.message);
            }

            let update_cant = []; // Array de promesas para actulizar las cantidades de los productos a actualizar
            this.data_details.forEach( producto => {
              // Resta los productos de la movil origen
              producto.base = process.env.__BASE__;
              producto.simbol = '-';
              producto.Mov_Id = this.encabezado_selecte.Etm_Mov_ID_entrega;
              producto.Si_Cant = producto['Cantidad trasladada'];
              producto.Art_Id = producto['Id producto'];
              let res_produ = this.updateInventarioMovil(producto).then( res => {
                return res.data;
              });
              update_cant.push(res_produ);
              // Suma los productos en la movil destino
              producto.simbol = '+';
              producto.Mov_Id = this.encabezado_selecte.Etm_Mov_Id_recibe;
              producto.Si_Cant = producto['Cantidad trasladada'];
              producto.Art_Id = producto['Id producto'];
              let suma_produ = this.updateInventarioMovil(producto).then( res => {
                return res.data;
              });
              update_cant.push(suma_produ);
            })
            // Actualizamos las cantidades si el estado es entregado
            Promise.all(update_cant).then( res_det => {
              res_det.forEach( res => {
                console.log({
                  msg: 'Respuesta insert update cantidades traslado',
                  data: res.data
                });
                if(!res.ok){
                  throw new Error(res.message);
                }
              })
            });
            this.$q.notify({
              message: 'Guardado',
              type: 'positive'
            });
            this.dailog_details = false;
            setTimeout(() => {
              this.getData();
            }, 300)
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
      }, 2000)
    },
    getDataMovilDestino(id_movil){
      this.$q.loading.show({
        message: 'Obteniendo integrantes de la movil, por favor espere...'
      });
      setTimeout( async () => {
        try {
          const member_movil = await this.getMembersMovil(id_movil).then( res => {
            return res.data;
          });
          // console.log({
          //   message: 'Repuesta get integrantes movile',
          //   data: member_movil
          // });
          if(member_movil.ok){
            if(member_movil.result){
              integ_movil_destino.length = 0;
              member_movil.data.forEach( member => {
                if(member.Estado == 1){
                  integ_movil_destino.push({
                    label: member.Per_Nombre.toUpperCase(),
                    value: member.Per_Num_documento,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(member_movil.message)
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
      }, 2000)
    },
    // Valida el select estado
    validateState(val){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!val && val != 0){
            resolve(false || 'Entregado es requerido')  
          }
          // call
           resolve(true)
        }, 300)
      })
    },
  }
}
</script>

<style scoped>

</style>
