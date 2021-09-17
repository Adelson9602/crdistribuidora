<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <component-table
        proptitle="Stock Precios"
        :propgrid="false"
        :propflat="true"
        :propexcel="excel"
        :propdata="data"
        :propcolumns="columns"
        :propbtns="btns"
      >
        <template v-slot:toggle>
          <q-toggle v-model="filter" label="Productos con stock mínimo"/>
        </template>
      </component-table>
    </q-card>
  </q-page>
</template>

<script>
import ComponentTable from "components/Generals/ComponentTable";
import { mapActions } from "vuex";
let stock = [];
export default {
  name: "SaleswithoutBalance",
  components: {
    ComponentTable
  },
  data() {
    return {
      tab: "stock",
      columns: [
        {
          name: "Art_Codigo_inv",
          required: true,
          label: "Código",
          align: "center",
          field: "Art_Codigo_inv",
          sortable: true
        },
        {
          name: "Cat_Nombre",
          required: true,
          label: "Categoría",
          align: "center",
          field: "Cat_Nombre",
          sortable: true
        },
        {
          name: "Art_Nombre",
          required: true,
          label: "Nombre artículo",
          align: "center",
          field: "Art_Nombre",
          sortable: true
        },
        {
          name: "Mov_Descripcion",
          required: true,
          label: "Ubicación",
          align: "center",
          field: "Mov_Descripcion",
          sortable: true
        },
        {
          name: "Si_Cant",
          required: true,
          label: "Cantidad",
          align: "center",
          field: "Si_Cant",
          sortable: true
        },
        {
          name: "Art_Stockminimo",
          required: true,
          label: "Stock mínimo",
          align: "center",
          field: "Art_Stockminimo",
          sortable: true
        },
        {
          name: "desc_porcen",
          required: true,
          label: "Descuento",
          align: "center",
          field: "desc_porcen",
          sortable: true
        },
        {
          name: "porce_venta",
          required: true,
          label: "% venta",
          align: "center",
          field: "porce_venta",
          sortable: true
        },
        {
          name: "precio_compra",
          required: true,
          label: "Precio compra",
          align: "center",
          field: "precio_compra",
          sortable: true
        },
        {
          name: "precio_venta",
          required: true,
          label: "Precio venta",
          align: "center",
          field: "precio_venta",
          sortable: true
        }
      ],
      excel: {
        columns: [
          {
            label: "Código",
            field: "Art_Codigo_inv"
          },
          {
            label: "Categoría",
            field: "Cat_Nombre"
          },
          {
            label: "Nombre artículo",
            field: "Art_Nombre"
          },
          {
            label: "Ubicación",
            field: "Mov_Descripcion"
          },
          {
            label: "Cantidad",
            field: "Si_Cant"
          },
          {
            label: "Descuento",
            field: "desc_porcen"
          },
          {
            label: "% venta",
            field: "porce_venta"
          },
          {
            label: "Precio compra",
            field: "precio_compra"
          },
          {
            label: "Precio venta",
            field: "precio_venta"
          }
        ],
        data: [],
        title: "Stock Inventario"
      },
      data: [],
      btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: true
      },
      filter: false,
    };
  },
  watch: {
    filter(value){
      this.data.length = 0;
      if(value){
        stock.forEach(product => {
          if(product.Si_Cant == 0 || product.Si_Cant < product.Art_Stockminimo ){
            this.data.push(product)  
          }
        });
      } else {
        stock.forEach(product => {
          this.data.push(product)
        })
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("sales", ["getAllstock"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos existentes, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const resgetDatastock = await this.getAllstock().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Repeusta get artículos',
          //   data: resgetDatastock,
          // });
          if (resgetDatastock.ok) {
            if (resgetDatastock.result) {
              stock.length = 0;
              resgetDatastock.data.forEach(element => {
                stock.push({
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Codigo_inv: element.Art_Codigo_inv,
                  Art_Nombre: element.Art_Nombre,
                  Art_ubicacion: element.Art_ubicacion,
                  Cat_Id: element.Cat_Id,
                  Cat_Nombre: element.Cat_Nombre,
                  Mov_Id: element.Mov_Id,
                  Mov_Descripcion: element.Mov_Descripcion,
                  Si_Cant: element.Si_Cant,
                  Art_Stockminimo: element.Art_Stockminimo,
                  desc_porcen: element.desc_porcen ? "% " + element.desc_porcen
                    : "% 0",
                  porce_venta: element.porce_venta
                    ? "% " + element.porce_venta
                    : "% 0",
                  precio_compra: element.precio_compra
                    ? "$ " + element.precio_compra
                    : "$ 0",
                  precio_venta: element.precio_venta
                    ? "$ " + element.precio_venta
                    : "$ 0",
                  title: element.Art_Nombre
                });
              });
              stock.forEach(product => {
                this.data.push(product)
              })
            } else {
              this.$q.notify({
                message: resgetDatastock.message,
                type: "warning"
              });
            }
          } else {
            this.data.length = 0;
            throw resgetDatastock.message;
          }
          this.excel.data = this.data;
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
      }, 2000);
    }
  }
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
