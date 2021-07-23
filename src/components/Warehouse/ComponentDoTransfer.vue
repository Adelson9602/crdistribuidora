<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Tipo de traslado"
            :rules="[val => !!val || 'Tipo de traslado es requerido']"
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Origen"
            :rules="[val => !!val || 'Origen es requerido']"
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Destino"
            :rules="[val => !!val || 'Destino es requerido']"
          />
        </div>
      </div>
      <!-- btn subtmit para el formulario -->
      <div>
        <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Productos a trasladar"
          :data="data"
          :columns="columns"
          row-key="name"
          flat
          class="height-table"
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
import { mapActions } from 'vuex';
export default {
  name: 'ComponentDoTransfer',
  data () {
    return {
      model: null,
      options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
      ],
      columns: [],
      data: [],
      enc_traslado: {
        base: null,
        Etm_Id: null,
        Etm_Mov_ID_entrega: null,
        Etm_Usuario_entrega: null,
        Etm_Fecha_entrega: null,
        Etm_Mov_Id_recibe: null,
        Etm_Usuario_recibe: null,
        Etm_Fecha_recibe: null,
        Etm_Observaciones: null,
        Etm_Estado: null
      }
    }
  },
  methods: {
    ...mapActions('warehouse', [
      ''
    ]),
    onSubmit(){

    },
    onReset(){

    },
  }
}
</script>
