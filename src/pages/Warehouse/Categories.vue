<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <!-- <q-tab-panel name="users" class="q-gutter-sm"> -->

      <!-- </q-tab-panel> -->
      <component-add-categories @reload="reload" :edit_data="category_edit" />

      <q-table
        title="Categoría productos"
        :data="data"
        :columns="columns"
        row-key="name"
        class="height-table q-mt-md"
        :pagination="initial_pagination"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
            filled
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />

            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width class="q-gutter-x-sm">
              <q-btn
                color="info"
                dense
                size="sm"
                icon="edit"
                round
                @click="editCategory(props.row)"
              />
            </q-td>

            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label != "Estado" ? col.value : "" }}
              <q-badge
                :color="col.value == 'ACTIVADO' ? 'positive' : 'negative'"
                :label="col.value"
                v-if="col.label == 'Estado'"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

import ComponentAddCategories from "components/Warehouse/ComponentAddCategories";
export default {
  name: "Categories",
  components: {
    ComponentAddCategories
  },
  data() {
    return {
      filter: null,
      columns: [
        {
          name: "Cat_precodigo",
          align: "center",
          label: "Pre código",
          sortable: true,
          field: "Cat_precodigo"
        },
        {
          name: "Cat_Nombre",
          align: "center",
          label: "Nombre",
          sortable: true,
          field: "Cat_Nombre"
        },
        {
          name: "Cat_Descripcion",
          align: "center",
          label: "Descripción",
          sortable: true,
          field: "Cat_Descripcion"
        },
        {
          name: "Cat_Fecha_control",
          align: "center",
          label: "Fecha creación",
          sortable: true,
          field: "Cat_Fecha_control"
        },
        {
          name: "Cat_User_control",
          align: "center",
          label: "Documento creador",
          sortable: true,
          field: "Cat_User_control"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Creado por",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "name_estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "name_estado"
        }
      ],
      data: [],
      initial_pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: true
      },
      category_edit: null //Almacena los datos de la categoria a editar
    };
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("warehouse", ["getCategoriasAlmacen"]),
    async getData() {
      this.$q.loading.show({
        message: "Obteniendo metas, por favor espere..."
      });
      try {
        const res_categoria = await this.getCategoriasAlmacen().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get categorias',
        //   data: res_categoria
        // });
        if (res_categoria.ok) {
          if (res_categoria.result) {
            this.data.length = 0;
            res_categoria.data.forEach(cat => {
              this.data.push({
                Cat_Descripcion: cat.Cat_Descripcion,
                name_estado: cat.name_estado,
                Cat_Fecha_control: cat.Cat_Fecha_control,
                Cat_Id: cat.Cat_Id,
                Cat_Nombre: cat.Cat_Nombre,
                Cat_User_control: cat.Cat_User_control,
                Per_Nombre: cat.Per_Nombre,
                Cat_precodigo: cat.Cat_precodigo
              });
            });
          } else {
            this.$q.notify({
              message: res_categoria.message,
              type: "warning"
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    editCategory(row) {
      this.category_edit = row;
    },
    reload() {
      setTimeout(() => {
        this.getData();
      }, 200);
    }
  }
};
</script>

<style scoped></style>
