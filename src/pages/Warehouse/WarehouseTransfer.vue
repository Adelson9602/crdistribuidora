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
            >
              <template v-slot:header-cell-calories="props">
                <q-th :props="props">
                  <q-icon name="thumb_up" size="1.5em" />
                  {{ props.col.label }}
                </q-th>
              </template>
            </component-table>
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
          name: 'Etm_Mov_ID_entrega',
          align: 'center',
          label: 'Etm_Mov_ID_entrega',
          sortable: true,
          field: 'Etm_Mov_ID_entrega'
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
          name: 'Etm_Mov_Id_recibe',
          align: 'center',
          label: 'Etm_Mov_Id_recibe',
          sortable: true,
          field: 'Etm_Mov_Id_recibe'
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
      data: []
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      "getTransfer",
      "getTransferRange",
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
          console.log({
            msg: 'Respuesta get traslados',
            data: res_traslados
          })
          if(res_traslados.ok){
            if(res_traslados.result){
              this.data.length = 0;
              res_traslados.data.forEach(element => {
                this.data.push({
                  Etm_Estado: element.Etm_Estado,
                  Etm_Fecha_entrega: element.Etm_Fecha_entrega,
                  Etm_Fecha_recibe: element.Etm_Fecha_recibe,
                  Etm_Id: element.Etm_Id,
                  Etm_Mov_ID_entrega: element.Etm_Mov_ID_entrega,
                  Etm_Mov_Id_recibe: element.Etm_Mov_Id_recibe,
                  Etm_Observaciones: element.Etm_Observaciones,
                  Etm_Usuario_entrega: element.Etm_Usuario_entrega,
                  Etm_Usuario_recibe: element.Etm_Usuario_recibe,
                  id: element.id,
                  name_m_entrega: element.name_m_entrega,
                  name_m_recibe: element.name_m_recibe,
                  name_p_entrega: element.name_p_entrega,
                  title: `Movimiento No. ${element.id}`,
                  btndetails: true,
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
    }
  }
}
</script>

<style scoped>

</style>
