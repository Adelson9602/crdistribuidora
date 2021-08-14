<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-btn color="primary" icon="add" label="Agregar modulo" @click="dailog_add_permiso = true" />
      <!-- Dialog para agregar o editar modulos -->
      <q-dialog v-model="dailog_add_permiso" persistent>
        <q-card>
          <q-form @submit="addPermiso">
            <q-bar class="bg-primary text-white">
              <q-btn flat round dense :icon="edit_modulo ? 'edit' : 'add'" />
              {{edit_modulo ? 'Editar modulo' : 'Agregar modulo'}}
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-bar>
            <q-card-section class="row items-center">
              <div class="col-xs-12 col-md-6 q-pa-xs q-gutter-y-md">
                <q-input
                  filled
                  maxlength="100"
                  v-model="permiso.label" hint="Nombre de modulo"
                  :rules="[val => !!val || 'Nombre de módulo es obligatorio']"
                />
              </div>
              <div class="col-xs-12 col-md-6 q-pa-xs q-gutter-y-md">
                <q-input
                  filled
                  maxlength="500"
                  v-model="permiso.Descripcion" hint="Descripción de modulo"
                  :rules="[val => !!val || 'Descripción de módulo es obligatorio']"
                />
              </div>
              <div class="col-xs-12 col-md-6 q-pa-xs q-gutter-y-md">
                <q-input
                  filled
                  maxlength="100"
                  v-model="permiso.Icon" hint="Icono del modulo"
                  :rules="[val => !!val || 'Icono del módulo es obligatorio']"
                />
              </div>
              <div class="col-xs-12 col-md-6 q-pa-xs q-gutter-y-md">
                <q-select
                  filled
                  v-model="permiso.active_item"
                  :options="options_state"
                  hint="Estado"
                  :rules="[val => !!val || 'Estado es requerido']"
                  map-options
                  emit-value
                />
              </div>
              <div class="col-xs-12 col-md-6 q-pa-xs q-gutter-y-md">
                <q-select
                  filled
                  v-model="permiso.type"
                  :options="optionsType"
                  hint="Tipo de módulo"
                  :rules="[val => !!val || 'Tipo de módulo es requerido']"
                />
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Guardar" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- Dailog para agregar o editar items del modulo -->
      <q-dialog v-model="dialog_items" persistent>
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="bg-primary text-white">
            <q-btn flat round dense icon="list" />
            Items
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-bar>
          <q-card-section>
            <q-scroll-area style="height: 70vh">
              <q-list bordered class="rounded-borders">
                <q-item-label header class="text-h6">Items asociados</q-item-label>
                <q-expansion-item
                  v-for="item in items_modulo" :key="item.Id_item_modulo"
                >
                  <template v-slot:header>
                    <q-item-section>
                      {{item.Descripcion}}
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center q-gutter-sm">
                        <q-icon name="info" :color="item.asociar ? 'green' : 'warning'" />
                        <q-toggle v-model="item.asociar" color="green" />
                      </div>
                    </q-item-section>
                  </template>

                  <q-card>
                    <q-card-section class="row">
                      <!-- active_item -->
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input
                          v-model="item.Descripcion"
                          type="text"
                          :rules="[val => !!val || 'Descripción es requerido']"
                          label="Descripción"
                        />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input
                          v-model="item.Icon"
                          type="text"
                          :rules="[val => !!val || 'Icon es requerido']"
                          label="Icon"
                        />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input
                          v-model="item.label"
                          type="text"
                          :rules="[val => !!val || 'Label es requerido']"
                          label="Label"
                        />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input
                          v-model="item.router"
                          type="text"
                          :rules="[val => !!val || 'Router es requerido']"
                          label="Router"
                        />
                      </div>
                      <div class="col-xs-12 row justify-center q-mt-md">
                        <q-btn color="red" icon="delete" size="sm" @click="deleteItem(item)" v-if="item.new_item">
                          <q-tooltip>
                            Eliminar item agregado
                          </q-tooltip>
                        </q-btn>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-item class="row justify-center">
                  <q-btn color="primary" icon="add" label="agregar item" @click="addItem" />
                </q-item>
              </q-list>
              <q-list bordered class="rounded-borders">
                <q-item-label header class="text-h6">Items sin asociar</q-item-label>
                <q-expansion-item
                  v-for="item in items_no_modulo" :key="item.Id_item_modulo"
                >
                  <template v-slot:header>
                    <q-item-section>
                      {{item.Descripcion}}
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center">
                        <q-icon name="info" :color="item.asociar ? 'green' : 'warning'" />
                        <q-toggle v-model="item.asociar" color="green" />
                      </div>
                    </q-item-section>
                  </template>

                  <q-card>
                    <q-card-section class="row">
                      <!-- active_item -->
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input v-model="item.Descripcion" type="text" label="Descripción" />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input v-model="item.Icon" type="text" label="Icon" />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input v-model="item.label" type="text" label="Label" />
                      </div>
                      <div class="col-xs-12 col-md-6 q-px-sm">
                        <q-input v-model="item.router" type="text" label="Router" />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-scroll-area>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn label="guardar" color="primary" @click="addItems"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <component-table
        :propdata="data"
        :propcolumns="columns"
        proptitle="Persmiso"
        :propflat="true"
        :propgrid="true"
        :propactions="true"
        @onedit="editModulo"
        @ondetails="detailsModulo"
      />
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ComponentTable from "components/Generals/ComponentTable";
let all_items_modulos = []; //Contiene todos los items de los modulos
export default {
  name: 'PagePermisos',
  components: {
    ComponentTable
  },
  data(){
    return {
      data: [],
      columns: [
        {
          name: 'Id_modulo',
          required: true,
          label: 'ID modulo',
          align: 'center',
          field: 'Id_modulo',
          sortable: true
        },
         {
          name: 'label',
          required: true,
          label: 'Label',
          align: 'center',
          field: 'label',
          sortable: true
        },
        {
          name: 'Descripcion',
          required: true,
          label: 'Descripción',
          align: 'center',
          field: 'Descripcion',
          sortable: true
        }, 
        {
          name: 'icon',
          required: true,
          label: 'Icono',
          align: 'center',
          field: 'icon',
          sortable: true
        },
      ],
      dailog_add_permiso: false,
      permiso: {
        Id_modulo: null,
        label: null,
        Descripcion: null,
        Icon: null,
        type: null,
        active_item: null,
        base: null
      },
      optionsType: [
        'expantion-item',
        'item',
        'dialog',
      ],
      options_state: [
        {
          value: 1,
          label: "ACTIVO",
        },
        {
          value: 0,
          label: "INACTIVO",
        }      
      ],
      edit_modulo: false,
      dialog_items: false,
      dailog_add_item: false,
      items_modulo: [],
      items_no_modulo: [],
      item_selected: null,
    }
  },
  watch: {
    dailog_add_permiso(value){
      if(!value){
        this.edit_modulo = false;
        this.permiso = {
          Id_modulo: null,
          label: null,
          Descripcion: null,
          Icon: null,
          type: null,
          active_item: null,
          base: null
        }
      }
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('access', [
      'GetModules',
      'GetModulesHasItem',
      'PostCreateModules',
      'PostCreateItemModules'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo modulos existentes, por favor espere...'
      });
      setTimeout(async () => {
        try {
          const res_modulos = await this.GetModules(this.base).then( res => {
            return res.data;
          })
          console.log({
            msg: 'Respuesta get modulos',
            data: res_modulos
          })
          this.data.length = 0;
          res_modulos.data.forEach(element => {
            this.data.push({
              Id_modulo: element.Id_modulo,
              label: element.label,
              Descripcion: element.Descripcion,
              active_item: element.active_item,
              Icon: element.Icon,
              type: element.type,
              title: element.label,
              btn_edit: true,
              icon_btn_edit: 'edit',
              btn_details: true,
              icon_btn_details: 'visibility',
            })
          });

          const res_item = await this.GetModulesHasItem(this.base).then( res => {
            return res.data;
          })
          console.log({
            msg: 'Respuesta get items X modulos',
            data: res_item
          })
          all_items_modulos.length = 0;
          res_item.data.forEach( element => {
            all_items_modulos.push({
              Descripcion: element.Descripcion,
              Estado: element.Estado,
              Icon: element.Icon,
              Id_item_modulo: element.Id_item_modulo,
              Id_modulo: element.Id_modulo,
              LabelM: element.LabelM,
              active_item: element.active_item,
              label: element.label,
              router: element.router,
              asociar: false,
            })
          });
          
          this.renderComponent = true;
        } catch (e) {
          console.log(e);
          if (e.message === "Error de conexión") {
            e = e.message;
          } if (e.message === 'Request failed with status code 404') {
            e = 'URL de solicitud no existe, err 404';
          } else if(e.message) {
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: 'negative'
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000)
    },
    addPermiso(){
      this.$q.loading.show({
        message: 'Guardando modulo, por favor espere...'
      })
      setTimeout( async () => {
        try {
          this.permiso.base = process.env.__BASE__;
          const res_insert = await this.PostCreateModules(this.permiso).then( res => {
            return res.data;
          })
          console.log({
            msg: 'Respuesta insert update modulo',
            data: res_insert
          })
          if(!res_insert.data.affectedRows){
            throw new Error('Error al crear modulo');
          }
          this.$q.notify({
            message: 'Guardado',
            type: 'positive'
          })
          this.onReset();
        } catch (e) {
          console.log(e);
          if (e.message === "Error de conexión") {
            e = e.message;
          } else if (e.message === "Request failed with status code 404") {
            e = "Error 404 al hacer la petición al servidor";
          } else if (e.message) {
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: "negative",
          });
        } finally {
          this.$q.loading.hide()
        }
      }, 2000)
    },
    addItem(){
      this.items_modulo.push({
        Id_item_modulo: null,
        label: null,
        Descripcion: null,
        router: null,
        Id_modulo: this.item_selected.Id_modulo,
        Estado: null,
        base: null,
        new_item: true,
        asociar: true,
      })
    },
    deleteItem(item){
      this.items_modulo.splice(this.items_modulo.indexOf(item), 1);
    },
    addItems(){
      this.$q.loading.show({
        message: 'Guardando, por favor espere...'
      });
      setTimeout(async() => {
        try {
          let post_items = [];
          this.items_modulo.forEach( element => {
            element.Estado = element.asociar ? 1 : 0;
            element.base = process.env.__BASE__;
            const ins_itm = this.PostCreateItemModules(element).then( res => {
              return res.data;
            });
            post_items.push(ins_itm)
          });
          Promise.all(post_items).then( res_insert => {
            console.log({
              message: 'Respuesta insertupdate items',
              data: res_insert
            })
            res_insert.forEach( res => {
              if(!res.ok){
                throw new Error(res.message)
              }
            })
          })

          let post_as_items = [];
          this.items_no_modulo.forEach( element => {
            element.Estado = element.asociar ? 1 : element.Estado;
            element.base = process.env.__BASE__;
            const ins_itm = this.PostCreateItemModules(element).then( res => {
              return res.data;
            });
            post_as_items.push(ins_itm)
          });
          Promise.all(post_as_items).then( res_insert => {
            console.log({
              message: 'Respuesta insertupdate items',
              data: res_insert
            })
            res_insert.forEach( res => {
              if(!res.ok){
                throw new Error(res.message)
              }
            })
          })
          this.$q.notify({
            message: 'Guardado',
            type: 'positive'
          })
          this.dialog_items = false;
          this.items_modulo.length = 0;
          this.items_no_modulo.length = 0;
          this.item_selected = null;
          setTimeout(() =>{
            this.getData();
          }, 300)
        } catch (e) {
          console.log(e);
          if (e.message === "Error de conexión") {
            e = e.message;
          } else if (e.message === "Request failed with status code 404") {
            e = "Error 404 al hacer la petición al servidor";
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
    editModulo(row){
      this.permiso = {
        Id_modulo: row.Id_modulo,
        label: row.label,
        Descripcion: row.Descripcion,
        Icon: row.Icon,
        type: row.type,
        active_item: row.active_item,
        base: row.base
      }
      this.dailog_add_permiso = true;
      this.edit_modulo = true;
    },
    detailsModulo(row){
      this.item_selected = row;
      let item_modulo = all_items_modulos.filter( item => item.Id_modulo == row.Id_modulo && item.Estado == 1 );
      let item_no_modulo = all_items_modulos.filter( item => item.Id_modulo != row.Id_modulo || item.Estado == 0); 
      this.items_no_modulo = item_no_modulo;
      // Recorremos los items asocioados para enviar la propiedad asociar, esta permite desasociar o asociar un item ya asociado, la ponemos en true porque son los items ya asociados
      item_modulo.forEach( item => {
        item.asociar = true;
      })
      // recorremos los items que no estan asociados y le cambiamos el valor que tiene el Id_modulo por el Id_modulo del row, osea del modulo que estamos viendo
      item_no_modulo.forEach( item => {
        item.new_Id_modulo = row.Id_modulo
      })
      this.items_modulo = item_modulo;
      this.dialog_items = true;
    },
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
