<template>
  <q-page padding>
     <q-card class="height-card_page q-pa-md">
        <component-add-categories/>
         <q-table
          title="Categorías"
          :data="data"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:header-cell-calories="props">
            <q-th :props="props">
              <q-icon name="thumb_up" size="1.5em" />
              {{ props.col.label }}
            </q-th>
          </template>
        </q-table>
      </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
import ComponentAddCategories from 'components/Warehouse/ComponentAddCategories';
export default {
  name: 'Categories',
  components: {
    ComponentAddCategories,
  },
  data(){
    return {
      columns: [
        {
          name: 'Cat_Nombre',
          align: 'center',
          label: 'Nombre',
          sortable: true,
          field: 'Cat_Nombre'
        },
        {
          name: 'Cat_Descripcion',
          align: 'center',
          label: 'Descripción',
          sortable: true,
          field: 'Cat_Descripcion'
        },
        {
          name: 'Cat_Estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'Cat_Estado'
        },
        {
          name: 'Cat_Fecha_control',
          align: 'center',
          label: 'Fecha creación',
          sortable: true,
          field: 'Cat_Fecha_control'
        },
        {
          name: 'Cat_User_control',
          align: 'center',
          label: 'Documento creador',
          sortable: true,
          field: 'Cat_User_control'
        },
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Creado por',
          sortable: true,
          field: 'Per_Nombre'
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
      'getCategoriasAlmacen'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo metas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_categoria = await this.getCategoriasAlmacen().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get categorias',
            data: res_categoria
          });
          if(res_categoria.ok){
            if(res_categoria.result){
              this.data.length = 0 ;
              res_categoria.data.forEach( cat => {
                this.data.push({
                  Cat_Descripcion: cat.Cat_Descripcion,
                  Cat_Estado: cat.Cat_Estado,
                  Cat_Fecha_control: cat.Cat_Fecha_control,
                  Cat_Id: cat.Cat_Id,
                  Cat_Nombre: cat.Cat_Nombre,
                  Cat_User_control: cat.Cat_User_control,
                  Per_Nombre: cat.Per_Nombre,
                  btn_edit: true,
                  icon_btn_edit: 'edit',
                  btn_status: true,
                  icon_btn_status: 'power_settings_new'
                })
              });
            } else {
              this.$q.notify({
                message: res_categoria.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_categoria.message);
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
    }
  }
}
</script>

<style scoped>

</style>
