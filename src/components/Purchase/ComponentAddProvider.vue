<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Razon social"
            :rules="[val => !!val || 'Razon social es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Nombre"
            :rules="[val => !!val || 'Nombre es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Tipo documento"
            :rules="[val => !!val || 'Tipo documento es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Número documento"
            :rules="[val => !!val || 'Número documento es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Dirección"
            :rules="[val => !!val || 'Dirección es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Teléfono"
            :rules="[val => !!val || 'Teléfono es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Email"
            :rules="[val => !!val || 'Email es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Ciudad"
            :rules="[val => !!val || 'Ciudad es obligatorio']"
          />
        </div>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'ComponentAddProvider',
  data () {
    return {
      model: null,
      options: [],
      text: null
    }
  },
  methods:{
    onSubmit(){

    },
    onReset(){

    },
  }
}
</script>
