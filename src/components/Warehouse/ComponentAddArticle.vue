<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row q-gutter-y-md">
        <div  v-if="this.edit_data  ? true : false" class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            @input="val => { new_article.Art_Codigo_inv = val.toUpperCase()}"
            v-model="new_article.Art_Codigo_inv"
            hint="Código producto"
            :rules="[val => !!val || 'Código producto es requerido']"
            maxlength="50"
            counter
            :disable="this.edit_data  ? true : false"
           
           
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            @input="val => { new_article.Art_Nombre = val.toUpperCase()}"
            v-model="new_article.Art_Nombre"
            hint="Nombre"
            :rules="[val => !!val || 'Nombre es requerido']"
            maxlength="50"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            @input="val => { new_article.Art_Descripcion = val.toUpperCase()}"
            v-model="new_article.Art_Descripcion"
            hint="Descripción"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-select
            v-model="new_article.Cat_Id"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Categoría"
            :options="options_categorias"
            @filter="filterFn"
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
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-select
            v-model="new_article.Um_Id"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Unidad de medida"
            :options="options_um"
            @filter="filterUm"
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
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="new_article.Art_Stockminimo"
            hint="Stock mínimo"
            :rules="[val => !!val || 'Stock mínimo es requerido']"
            mask="###########"
            maxlength="11"
            counter
          />
        </div>
           <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            @input="val => { new_article.Art_ubicacion = val.toUpperCase()}"
            v-model="new_article.Art_ubicacion"
            hint="Ubicacion"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-select
            v-model="new_article.Art_Estado"
            :options="options_state"
            hint="Estado"
            emit-value
            map-options
          />
        </div>
      </div>
      <div class="row justify-end q-mt-0">
        <div class="q-gutter-x-md">
          <q-btn label="Guardar" type="submit" color="green"/>
        </div>
      </div>
    </q-form>
  </div>  
</template>

<script>
import { mapActions, mapState } from 'vuex';
let options_categorias = [];
let options_um = [];
export default {
  name: 'ComponentAddArticle',
  data () {
    return {
      text: null,
      options_categorias: options_categorias,
      options_um: options_um,
      new_article: {
        base: null,
        Art_Id: null,
        Cat_Id: null,
        Art_Codigo_inv: null,
        Art_Nombre: null,
        Art_Descripcion: null,
        Art_Stockminimo: null,
        Um_Id: null,
        Art_ubicacion:null,
        Art_Imagen: null,
        Art_Estado: null,
        Art_User_control: null
      },
      options_state: [
        {
          label: 'ACTIVO',
          value: 1,
        },
        {
          label: 'INACTIVO',
          value: 0,
        },
      ]
    }
  },
  props: [
    "edit_data"
  ],
  computed: {
    ...mapState('auth', ['user_logged']),
    data_user(){
      return this.user_logged;
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      'getCategoriasAlmacen',
      'addArticle'
    ]),
    ...mapActions('master', [
      'getAllUm'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos, por favor espere...'
      });
      setTimeout( async() => {
        try {
          // Obtenemos las categorías de los productos
          const res_categorias = await this.getCategoriasAlmacen().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get categorias articulos',
            data: res_categorias
          });
          if(res_categorias.ok){
            if(res_categorias.result){
              options_categorias.length = 0;
              res_categorias.data.forEach(element => {
                if(element.Cat_Estado == 1){
                  options_categorias.push({
                    value: element.Cat_Id,
                    label: element.Cat_Nombre,
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_categorias.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_categorias.message);
          }

          // Obtenemos las unidades de medidadas
          const res_um = await this.getAllUm().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get unidades de medida',
            data: res_um
          });
          if(res_um.ok){
            if(res_um.result){
              options_um.length = 0;
              res_um.data.forEach(element => {
                if(element.Um_Estado == 1){
                  options_um.push({
                    value: element.Um_Id,
                    label: element.Um_Unidad,
                    prefijo: element.Prefijo
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_um.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_um.message);
          }

          // Es una propiedad que se envia desde el page, si viene definido significa que estamos editando
          if(this.edit_data){
         
            // Buscamos la categoria del producto asignada
            let categoria = options_categorias.find( categoria => categoria.label.toLowerCase() == this.edit_data.Cat_Nombre.toLowerCase());
            // Buscamos la unidad de medida asiganada
            let um = options_um.find( um => um.prefijo.toLowerCase() == this.edit_data.Prefijo.toLowerCase())
            this.new_article = {
              base: null,
              Art_Id: this.edit_data.Art_Id,
              Cat_Id: categoria.value,
              Art_Codigo_inv: this.edit_data.Art_Codigo_inv,
              Art_Nombre: this.edit_data.Art_Nombre,
              Art_Descripcion: this.edit_data.Art_Descripcion,
              Art_Stockminimo: this.edit_data.Art_Stockminimo,
              Um_Id: um.value,
              Art_ubicacion: this.edit_data.Art_ubicacion,
              Art_Imagen: this.edit_data.Art_Imagen ? this.edit_data.Art_Imagen : this.new_article.Art_Imagen,
              Art_Estado: this.edit_data.Art_Estado,
              Art_User_control: this.user_logged.Per_Num_documento
            }
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
      this.$q.loading.show({
        message: 'Agregando artículo, por favor espere...'
      });
      setTimeout( async() => {
        try {
          this.new_article.base = process.env.__BASE__;
          this.new_article.Art_User_control = this.data_user.Per_Num_documento;
          const res_add = await this.addArticle(this.new_article).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta insert update articulo',
            data: res_add
          });
          if(res_add.ok){
            this.$q.notify({
              message: 'Guardado',
              type: 'positive'
            });
            this.$emit('reload');
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

    },
    // Busca o filtra las opciones del select categorias articulo
    filterFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_categorias = options_categorias
          }
          else {
            const needle = val.toLowerCase()
            this.options_categorias = options_categorias.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          }
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        })
      }, 300)
    },
    // Busca o filtra las opciones del select categorias unidad de medida
    filterUm (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_um = options_um
          }
          else {
            const needle = val.toLowerCase()
            this.options_um = options_um.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          }
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        })
      }, 300)
    },
  }
}
</script>
