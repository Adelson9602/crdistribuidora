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
            <q-table
              title="Traslados realizados"
              :data="data"
              :columns="columns"
              row-key="name"
              flat
            >
              <template v-slot:header-cell-calories="props">
                <q-th :props="props">
                  <q-icon name="thumb_up" size="1.5em" />
                  {{ props.col.label }}
                </q-th>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="transfer_cellar">
            <component-do-transfer/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
import ComponentDoTransfer from 'components/Warehouse/ComponentDoTransfer';
import { mapActions } from 'vuex';
export default {
  name: 'transfers',
  components:{
    ComponentDoTransfer
  },
  data(){
    return {
      tab: 'transfer',
      columns: [],
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
              res_traslados.data.forEach(element => {
                console.log(element)
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
    }
  }
}
</script>

<style scoped>

</style>
