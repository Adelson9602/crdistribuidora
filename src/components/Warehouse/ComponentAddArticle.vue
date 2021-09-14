<template>
  <div>
    <q-form
      @submit="addProduct"
      autocomplete="off"
      ref="form_article"
    >
      <div class="row q-gutter-y-md">
        <div v-if="this.edit_data ? true : false" class="col-xs-12 col-sm-6 col-md-6 q-px-sm">
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
        <div class="col-xs-12 col-sm-6 col-md-6 q-px-sm">
          <q-input
            @input="val => { new_article.Art_Nombre = val.toUpperCase()}"
            v-model="new_article.Art_Nombre"
            hint="Nombre"
            :rules="[val => !!val || 'Nombre es requerido']"
            maxlength="50"
            counter
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 q-px-sm">
          <q-input
            @input="val => { new_article.Art_Descripcion = val.toUpperCase()}"
            v-model="new_article.Art_Descripcion"
            hint="Descripción"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="art_cat"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Categoría"
            :options="options_categorias"
            @filter="filterFn"
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
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="art_um"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Unidad de medida"
            :options="options_um"
            @filter="filterUm"
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
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="new_article.Art_Estado"
            :options="options_state"
            hint="Estado"
            emit-value
            map-options
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-input
            @input="val => { new_article.Art_ubicacion = val.toUpperCase()}"
            v-model="new_article.Art_ubicacion"
            hint="Ubicacion"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-file
            v-model="img_articulo"
            hint="Imagen artículo"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click.stop="img_articulo = null" class="cursor-pointer" />
            </template>

            <template v-slot:hint>
              Field hint
            </template>
          </q-file>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-input
            v-model="new_article.Art_Stockminimo"
            hint="Stock mínimo"
            :rules="[val => !!val || 'Stock mínimo es requerido']"
            mask="###########"
            maxlength="11"
            counter
          />
        </div>
      </div>
      <q-btn color="primary" icon="check" label="OK" type="submit" class="hide-btn_submit"/>
    </q-form>
    <q-table
      title="Artículos a agregar"
      :data="data_articles"
      :columns="columns_articles"
      row-key="name"
      flat
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="text-align: center !important;"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="deleteItem(props.row)" icon="delete"/>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="text-align: center !important;"
          >
            {{ col.name != 'image' ? col.value : ''}}
            <q-avatar
              size="50px"
              square
              v-if="col.name == 'image' && col.value"
            >
              <img :src="col.value" alt="Imagen del articulo">
            </q-avatar>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18,18]" expand v-if="data_articles.length > 0">
      <q-btn label="Guardar" @click="onSubmit" color="green"/>
    </q-page-sticky>
  </div>  
</template>

<script>
import { mapActions, mapState } from 'vuex';
import dialog from 'components/Generals/ComponentDialogWarning';
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
        Art_User_control: null,
        Art_porce_general: 1
      },
      art_cat: null,
      art_um: null,
      img_articulo: null,
      tem_url_img: null,
      options_state: [
        {
          label: 'ACTIVO',
          value: 1,
        },
        {
          label: 'INACTIVO',
          value: 0,
        },
      ],
      columns_articles: [
        {
          name: 'art_cat',
          label: 'Categoría',
          sortable: true,
          field: 'art_cat'
        },
        {
          name: 'Art_Nombre',
          label: 'Nombre artículo',
          sortable: true,
          field: 'Art_Nombre'
        },
        {
          name: 'Art_Descripcion',
          label: 'Descripción artículo',
          sortable: true,
          field: 'Art_Descripcion'
        },
        {
          name: 'Art_Stockminimo',
          label: 'Stock mínimo',
          sortable: true,
          field: 'Art_Stockminimo'
        },
        {
          name: 'art_um',
          label: 'Um',
          sortable: true,
          field: 'art_um'
        },
        {
          name: 'Art_ubicacion',
          label: 'Ubicación articulo',
          sortable: true,
          field: 'Art_ubicacion'
        },
        {
          name: 'image',
          label: 'Imagen',
          sortable: true,
          field: 'image'
        },
      ],
      data_articles: [],
      tipo_seleccionado: null,
      options_tipos_por: [
        {
          label: 'Porcentaje general',
          value:  1
        },
        {
          label: 'Porcentaje personalizado',
          value:  0
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
  watch: {
    img_articulo(value){
      if(value){
        let extension_foto = value.type.split('/');
        // Creamos un nombre con la fecha y hora del momento que se selecciona el archivo, a esa fecha le reemplazamos los . por ' ', los : y los - por _ y al resultado concatenamos un . y la extensión del archivo 
        let name_file_foto= this.replaceAll(this.replaceAll(this.replaceAll(new Date().toISOString().toLowerCase(), ".", ""), ":", "_"), "-", "_")+"."+extension_foto[1];
        value.newname = name_file_foto;
        this.tem_url_img = URL.createObjectURL(value);
      }
    }
  },
  methods: {
    ...mapActions('warehouse', [
      'getCategoriasAlmacen',
      'addArticle'
    ]),
    ...mapActions('master', [
      'getAllUm'
    ]),
    ...mapActions('access', [
      'saveFile',
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
          let promesas = [];
          this.data_articles.forEach( articulo => {
            articulo.Art_User_control = this.data_user.Per_Num_documento;
            if(articulo.tem_img){
              // Se sube la foto al servidor
              const formData = new FormData();
              formData.append("files", articulo.tem_img, articulo.tem_img.newname );
              promesas.push(this.saveFile(formData).then(async res => {
                res.data.msg = 'Respuesta subida foto';
                return res.data;
              }));
              articulo.Art_Imagen = `${process.env.__URLAPI__}adjuntos/${articulo.tem_img.newname}`;
            }
            promesas.push(this.addArticle(articulo).then( res => {
              res.data.msg = 'Respuesta insert update articulo';
              return res.data;
            }))
          })
          Promise.all(promesas).then( data => {
            data.forEach( res => {
              console.log({
                msg: res.msg,
                data: res
              });
              // if(!res.ok || !res.saved){
              //   throw new Error('Erorr al guardar artículo');
              // }
            })
          }).catch( e => {
            throw new Error(e)
          })
          this.$q.notify({
            message: 'Guardado',
            type: 'positive'
          });
          this.$emit('reload');
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
    addProduct(){
      let add_article = {
        base: process.env.__BASE__,
        Art_Id: null,
        art_cat: this.art_cat.label,
        Cat_Id: this.art_cat.value,
        Art_Codigo_inv: null,
        Art_Nombre: this.new_article.Art_Nombre,
        Art_Descripcion: this.new_article.Art_Descripcion,
        Art_Stockminimo: this.new_article.Art_Stockminimo,
        Art_porce_general: 1,
        Um_Id: this.art_um.value,
        art_um: this.art_um.label,
        Art_ubicacion:this.new_article.Art_ubicacion,
        Art_Imagen: null,
        Art_Estado: this.new_article.Art_Estado,
        Art_User_control: null,
        image: this.tem_url_img,
        tem_img: this.img_articulo,
      }
      this.data_articles.push(add_article);      
      this.onReset();
      setTimeout(() => {
        this.$refs.form_article.resetValidation();
      }, 200)
    },
    onReset(){
      this.new_article =  {
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
      }
      this.img_articulo = null;
      this.tem_url_img = null;
      this.art_cat = null;
      this.art_um = null;
    },
    // Borra productos de la tabla productos a trasladar
    deleteItem(row){
      this.$q.dialog({
          component: dialog,
          parent: this,
          title: 'Eliminar producto agregado',
          msg: `Atención! Estas a un paso de eliminar un producto agregado ¿Está seguro que desea continuar?`,
        }).onOk(() => {
          this.data_articles.splice(this.data_articles.indexOf(row), 1)
        })
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
    // Reemplaza elementos de un string
    replaceAll( text, busca, reemplaza ){
      while (text.toString().indexOf(busca) != -1)
          text = text.toString().replace(busca,reemplaza);
      return text;
    },
  }
}
</script>
