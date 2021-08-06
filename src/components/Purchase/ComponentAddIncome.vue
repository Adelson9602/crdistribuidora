<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            label="Proveedor"
            :options="options_providers"
            @filter="filterProviders"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options_comprobantes"
            hint="Tipo comprobante"
            :rules="[val => !!val || 'Tipo comprobante es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Medio de pago"
            :rules="[val => !!val || 'Medio de pago es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Númerocompra"
            :rules="[val => !!val || 'Númerocompra es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Impuesto"
            :rules="[val => !!val || 'Impuesto es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-field hint="Fecha" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">28/05/2021</div>
            </template>
          </q-field>
        </div>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Productos a ingresar"
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

      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
let all_providers = []; //Opciones para el select proveedores
let all_comprobante = []; //Opciones para el select tipo comprobante
export default {
  name: 'ComponentAddIncome',
  data () {
    return {
      options_providers: all_providers, //Opciones para el select proveedores
      options_comprobantes: all_comprobante, //Opciones para el select proveedores
      model: null,
      options: [],
      text: null,
      columns: [],
      data: []
    }
  },
  computed: {
    ...mapState('auth', 'user_logged'),
    data_user(){
      return this.user_logged;
    }
  },
  created(){
    this.getData();
  },
  methods:{
    ...mapActions('shopping', [
      'insertEncEntry',
      'insertDetEntry',
      'getProviders'
    ]),
    ...mapActions('warehouse', [
      'updateInventarioMovil'
    ]),
    ...mapActions('master', [
      'getTiposComprobante',
      'getMedioPago '
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async()=> {
        try {
          const res_provider = await this.getProviders().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get proveedor',
          //   data: res_provider
          // });
          if(res_provider.ok){
            if(res_provider.result){
              all_providers.length = 0;
              res_provider.data.forEach( element => {
                if(element.Tp_Id == 0 && element.CP_Razon_social){
                  all_providers.push({
                    label: element.CP_Razon_social,
                    value: element.CP_Nit
                  })
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_provider.message);
          }

          const res_compro = await this.getTiposComprobante().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get tipo de comprobante',
            data: res_compro
          });
          if(res_compro.ok){
            if(res_compro.result){
              all_comprobante.length = 0;
              res_compro.data.forEach(element => {
                if(element.Tc_Estado == 1){
                  all_comprobante.push({
                    label: element.Tc_Descripcion,
                    value: element.Tc_Id
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_compro.message);
          }

          const res_medio = await this.getMedioPago().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get medio pago',
            data: res_medio
          });
          if(res_medio.ok){
            
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
      }, 2000)
    },
    onSubmit(){

    },
    onReset(){

    },
    // Valida los select
    validateSelect(val){
      if(!val){
        return 'Por favor seleccione una opción'
      }
    },
    // Buscador para el select proveedor
    filterProviders(val, update, abort){
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options_providers = all_providers
            }
            else {
              const needle = val.toLowerCase()
              this.options_providers = all_providers.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
            }
          },
          ref => {
            if (val !== '' && ref.options.length > 0) {
              ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          }
        )
      }, 300)
    }
  }
}
</script>
