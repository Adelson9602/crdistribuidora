<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <component-table
        proptitle="Stock Precios"
        :propgrid="false"
        :propflat="true"
      
        :propdata="data"
        :propcolumns="columns"
        :propbtns="btns"
      />
    </q-card>
  </q-page>
</template>

<script>
import ComponentTable from 'components/Generals/ComponentTable';
import { mapActions } from "vuex";
export default {
  name: 'SaleswithoutBalance',
  components: {
    ComponentTable,
  },
   data() {
    return {
      tab: "articles",
      // date_range: {
      //   to: null,
      //   from: null,
      // },           
      columns: [
        // {
        //   name: "Id",
        //   required: true,
        //   label: "Id ",
        //   align: "center",
        //   field: "Id",
        //   sortable: true,
        // },
        {
          name: "Art_Codigo_inv",
          required: true,
          label: "Codigo",
          align: "center",
          field: "Art_Codigo_inv",
          sortable: true,
        },
         {
          name: "Cat_Nombre",
          required: true,
          label: "Categoria",
          align: "center",
          field: "Cat_Nombre",
          sortable: true,
        },
        {
          name: "Art_Nombre",
          required: true,
          label: "Nombre articulo",
          align: "center",
          field: "Art_Nombre",
          sortable: true,
        },
        {
          name: "Mov_Descripcion",
          required: true,
          label: "Ubicacion",
          align: "center",
          field: "Mov_Descripcion",
          sortable: true,
        },
        {
          name: "Si_Cant",
          required: true,
          label: "Cantidad",
          align: "center",
          field: "Si_Cant",
          sortable: true,
        },
        {
          name: "desc_porcen",
          required: true,
          label: "descuento",
          align: "center",
          field: "desc_porcen",
          sortable: true,
        },
       
        //  {
        //   name: "Art_ubicacion",
        //   required: true,
        //   label: "Ubicacion",
        //   align: "center",
        //   field: "Art_ubicacion",
        //   sortable: true,
        // },
        {
          name: "porce_venta",
          required: true,
          label: "% venta",
          align: "center",
          field: "porce_venta",
          sortable: true,
        },
        {
          name: "precio_compra",
          required: true,
          label: "Precio Compra",
          align: "center",
          field: "precio_compra",
          sortable: true,
        },
        {
          name: "precio_venta",
          required: true,
          label: "Precio Venta",
          align: "center",
          field: "precio_venta",
          sortable: true,
        },
      
      ],
      data: [],
      btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: true
      },
    
    };
  },

  created() {
    this.getData();
  },

  methods: {
    ...mapActions("sales", [
      "getAllstock",
     
    ]),
 
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos existentes, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const resgetDatastock = await this.getAllstock().then(
            (res) => {
              return res.data;
            }
          );
          // console.log({
          //   msg: 'Repeusta get artículos',
          //   data: resgetDatastock,
          // });
          if (resgetDatastock.ok) {
            if (resgetDatastock.result) {
              this.data.length = 0;
              resgetDatastock.data.forEach((element) => {
                this.data.push({

         
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Codigo_inv: element.Art_Codigo_inv,
                  Art_Nombre: element.Art_Nombre,
                  Art_ubicacion:element.Art_ubicacion,
                  Cat_Id: element.Cat_Id,
                  Cat_Nombre:element.Cat_Nombre,
                  Mov_Id: element.Mov_Id,
                  Mov_Descripcion: element.Mov_Descripcion,
                  Si_Cant: element.Si_Cant,  
                  desc_porcen: element.desc_porcen,
                  porce_venta: element.porce_venta==null? '% 0': '% '+element.porce_venta,
                  precio_compra:element.precio_compra==null? '$ 0': '$ '+element.precio_compra,
                  precio_venta:  element.precio_venta==null? '$ 0': '$ '+element.precio_venta,
                  title: element.Art_Nombre,
                  // btn_edit: false,
                  // btn_status: false,
                  // btn_details: true,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                });
              });
            } else {
              this.$q.notify({
                message: resgetDatastock.message,
                type: "warning",
              });
            }
          } else {
            this.data.length = 0;
            throw resgetDatastock.message;
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
      }, 2000);
    },
 
  
   
  },
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
