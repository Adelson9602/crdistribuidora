<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <component-table
        proptitle="Creditos proveedor"
        :propgrid="true"
        :propflat="true"
        :propdata="data"
        :propcolumns="columns"
        :propbtns="btns"
      />
    </q-card>
  </q-page>
</template>

<script>
import ComponentTable from "components/Generals/ComponentTable";
export default {
  name: 'ProviderCredits',
  components: {
    ComponentTable
  },
  data(){
    return {
      columns: [
        {
          name: "CP_Digito_verificacion",
          align: "center",
          label: "Digito verificación",
          sortable: true,
          field: "CP_Digito_verificacion"
        },
        {
          name: "CP_Fecha_control",
          align: "center",
          label: "Fecha creación",
          sortable: true,
          field: "CP_Fecha_control"
        },
        {
          name: "CP_Nit",
          align: "center",
          label: "NIT",
          sortable: true,
          field: "CP_Nit"
        },
        {
          name: "CP_Razon_social",
          align: "center",
          label: "Razon social",
          sortable: true,
          field: "CP_Razon_social"
        },
        {
          name: "CP_Telefono",
          align: "center",
          label: "Teléfono",
          sortable: true,
          field: "CP_Telefono"
        },
        {
          name: "CP_Direccion",
          align: "center",
          label: "Dirección",
          sortable: true,
          field: "CP_Direccion"
        },
        {
          name: "CP_Email",
          align: "center",
          label: "Email",
          sortable: true,
          field: "CP_Email"
        },
        {
          name: "CP_Urlweb",
          align: "center",
          label: "Sitio web",
          sortable: true,
          field: "CP_Urlweb"
        },
        {
          name: "Ciu_Nombre",
          align: "center",
          label: "Ciudad",
          sortable: true,
          field: "Ciu_Nombre"
        },
        {
          name: "CP_User_control",
          align: "center",
          label: "Documento creador",
          sortable: true,
          field: "CP_User_control"
        },
        {
          name: "Per_Nombre",
          align: "center",
          label: "Creado por",
          sortable: true,
          field: "Per_Nombre"
        },
        {
          name: "Tp_Desc_corta",
          align: "center",
          label: "Tipo documento",
          sortable: true,
          field: "Tp_Desc_corta"
        },
        {
          name: "name_estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "name_estado"
        },
        {
          name: "name_tp",
          align: "center",
          label: "Tipo cliente",
          sortable: true,
          field: "name_tp"
        }
      ],
      data: [],
      btns: {
        range_date: true,
        btn_export_pdf: true,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9
      },
    }
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
