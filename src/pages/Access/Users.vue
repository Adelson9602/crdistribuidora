<template>
  <q-page padding>
    <!-- content -->
    <q-card class="height-card_page q-pa-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="users" label="Usuarios" />
        <q-tab name="formUser" :label="label" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="users" class="q-gutter-sm">
          <list-user
            :propdata="data_users"
            :propcolumns="columns"
            proptitle="Lista de usuarios"
            :proppdf="optionpdf"
            :propflat="true"
            :propgrid="true"
          />
        </q-tab-panel>

        <q-tab-panel name="formUser">
          <user-form
            @reload="reload"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import UserForm from "components/Access/ComponentUserForm";
import ListUser from "components/Generals/ComponentTable";
import { mapActions, mapState } from "vuex";
var CryptoJS = require("cryp-to-js").default;

export default {
  name: "PageUser",
  data() {
    return {
      tab: "users",
      data_users: [],
      columns: [
        {
          name: "Pers_Nombres",
          required: true,
          label: "Nombres",
          align: "center",
          field: "Pers_Nombres",
          sortable: true
        },
        {
          name: "Pers_Apellidos",
          align: "center",
          label: "Apellidos",
          field: "Pers_Apellidos",
          sortable: true
        },
        {
          name: "UsuarioUser",
          align: "center",
          label: "Documento",
          field: "UsuarioUser",
          sortable: true
        },
        {
          name: "Pers_Celular",
          align: "center",
          label: "Teléfono",
          field: "Pers_Celular",
          sortable: true
        },
        {
          name: "Pers_Email",
          align: "center",
          label: "Email",
          field: "Pers_Email",
          sortable: true
        },
        {
          name: "Rol_Nombre",
          align: "center",
          label: "Rol",
          field: "Rol_Nombre",
          sortable: true
        },
        {
          name: "Carg_Descripcion",
          align: "center",
          label: "Cargo",
          field: "Carg_Descripcion",
          sortable: true
        },
        {
          name: "Rol_Descripcion",
          align: "center",
          label: "Descripción del rol",
          field: "Rol_Descripcion",
          sortable: true
        },
        {
          name: "Pers_Imagen",
          align: "center",
          label: "Foto",
          field: "Pers_Imagen",
          sortable: true
        },
        {
          name: "Usuario_Estado",
          align: "center",
          label: "Estado",
          field: "Usuario_Estado",
          sortable: true
        }
      ],
      label: "Crear Usuario",
      tabForm: false,
      dataUser: {},
      icon: false,
      enableEstate: false,
      msgEnable: null,
      titleDialog: "",
      idPerson: null,
      optionpdf: {
        columns: [
          { header: "Nombre", dataKey: "Pers_Nombres" },
          { header: "Apellido", dataKey: "Pers_Apellidos" },
          { header: "Cedula", dataKey: "UsuarioUser" },
          { header: "Celular", dataKey: "Pers_Celular" },
          { header: "Email", dataKey: "Pers_Email" },
          { header: "Rol", dataKey: "Rol_Nombre" },
          { header: "Descripción del rol", dataKey: "Rol_Descripcion" },
          { header: "Estado", dataKey: "Usuario_Estado" }
        ],
        data: [],
        orientation: 'l', // l => landscape, p => portrait
        title: {
          title: 'Usuarios registrados',
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        }
      }
    };
  },
  components: {
    UserForm,
    ListUser,
  },
  created() {
    this.getData();
  },
  computed: {
  },
  methods: {
    getData() {
      this.$q.loading.show({
        message: "Obteniendo lista de usuarios, por favor espere..."
      });
      setTimeout(async () => {
        try {
          
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
    reload(){

    },
    encryptedAES(data) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }
  }
};
</script>
