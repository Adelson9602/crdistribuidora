<template>
  <div>
    <q-btn color="primary" icon="add" label="agregar categoria" @click="dialog_create_categories = true" />
    <q-dialog v-model="dialog_create_categories" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="form_add_category"
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
                v-model="category.Cat_Nombre"
                type="text"
                hint="Nombre"
                :rules="[val => !!val || 'Nombre es obligatorio']"
                @input="val => { category.Cat_Nombre = val.toUpperCase()}"
              />
            </div>
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-input
                v-model="category.Cat_Descripcion"
                type="text"
                hint="Descripción"
                :rules="[val => !!val || 'Descripción es obligatorio']"
                @input="val => { category.Cat_Descripcion = val.toUpperCase()}"
              />
            </div>
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-input
                v-model="category.Cat_precodigo"
                type="text"
                hint="Prefijo categoría"
                :rules="[val => !!val || 'Prefijo es obligatorio']"
                maxlength="5"
                counter
                @input="val => { category.Cat_precodigo = val.toUpperCase()}"
              />
            </div>
            <div class="col-xs-12 col-md-6 q-px-sm">
              <q-select
                v-model="category.Cat_Estado"
                :options="options_status"
                hint="Estado"
                map-options
                emit-value
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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ComponentAddCategories',
  data () {
    return {
      dialog_create_categories: false,
      category: {
        base: null,
        Cat_Id: null,
        Cat_Nombre: null,
        Cat_Descripcion: null,
        Cat_Estado: 1,
        Cat_User_control: null,
        Cat_precodigo: null,
      },
      options_status: [
        {
          label: 'ACTIVO',
          value: 1
        },
        {
          label: 'INACTIVO',
          value: 0
        },
      ],
      edit_category: null,
    }
  },
  props: [
    'edit_data'
  ],
  computed: {
    ...mapState('auth', ['user_logged']),
    data_user(){
      return this.user_logged;
    }
  },
  watch: {
    edit_data(value){
      // Es una propiedad que se envia desde el page, si viene definido significa que estamos editando
      if(value){
        this.edit_category = value;
        this.category = {
          base: null,
          Cat_Id: this.edit_category.Cat_Id,
          Cat_Nombre: this.edit_category.Cat_Nombre,
          Cat_Descripcion: this.edit_category.Cat_Descripcion,
          Cat_Estado: this.edit_category.name_estado == 'ACTIVADO' ? 1 : 0,
          Cat_precodigo: this.edit_category.Cat_precodigo,
          Cat_User_control: this.data_user.Per_Num_documento
        }
        this.dialog_create_categories = true;
      }
    },
    dialog_create_categories(value){
      if(!value){
        this.edit_category = null;
        this.category = {
          base: null,
          Cat_Id: null,
          Cat_Nombre: null,
          Cat_Descripcion: null,
          Cat_Estado: 1,
          Cat_User_control: null,
          Cat_precodigo: null,
        };
      }
    }
  },
  methods: {
    ...mapActions('warehouse', [
      'addCategory'
    ]),
    onSubmit(){
      this.$q.loading.show({
        message: 'Guardando, por favor espere...'
      });
      setTimeout( async() => {
        try {
          this.category.base = process.env.__BASE__;
          this.category.Cat_User_control = this.data_user.Per_Num_documento;
          const res_add_category = await this.addCategory(this.category).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta insert edit categorias',
            data: res_add_category
          });
          if(res_add_category.ok){
            this.$q.notify({
              message: 'Guardado',
              type: 'positive'
            });
            this.onReset();
            this.$emit('reload');
          } else {
            throw new Error(res_add_category.message);
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
    onReset(){
      this.dialog_create_categories = false;
      this.category = {
        base: null,
        Cat_Id: null,
        Cat_Nombre: null,
        Cat_Descripcion: null,
        Cat_Estado: 1,
        Cat_User_control: 123456789
      }
    },
  }
}
</script>
