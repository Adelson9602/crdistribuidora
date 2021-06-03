<template>
  <div>
    <q-btn color="primary" icon="add" label="agregar categoria" @click="dialog_create_categories = true" />
    <q-dialog v-model="dialog_create_categories" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
           <q-bar class="bg-primary text-white">
            <q-icon name="add" />
            <div>Agregar categoría</div>

            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section class="row">
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-input
                v-model="text"
                type="text"
                hint="Nombre"
                :rules="[val => !!val || 'Nombre es obligatorio']"
              />
            </div>
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-input
                v-model="text"
                type="text"
                hint="Descripción"
                :rules="[val => !!val || 'Descripción es obligatorio']"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-px-md">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn label="Agregar" color="primary" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ComponentAddCategories',
  data () {
    return {
      dialog_create_categories: false,
      text: null
    }
  },
  methods: {
    onSubmit(){

    },
    onReset(){

    },
  }
}
</script>
