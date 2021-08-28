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
            :propexcel="excel"
             :propbtns="btns"
            :propactions="true"
            @tostatus="setStatus"
            @onedit="editRequest"
          />
        </q-tab-panel>

        <q-tab-panel name="formUser">
          <user-form
            @reload="reload"
            :propDataUser="user_edit"
            :editForm="edit_form"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import UserForm from "components/Access/ComponentUserForm";
import ListUser from "components/Generals/ComponentTable";
import dialog from "components/Generals/ComponentDialogWarning";
import { mapActions, mapState } from "vuex";
import CryptoJS from "crypto-js";

export default {
  components: {
    UserForm,
    ListUser
  },
  name: "PageUser",
  data() {
    return {
      tab: "users",
      data_users: [],
      columns: [
        {
          name: "Car_Descripcion",
          aling: "center",
          label: "Cargo",
          sortable: true,
          field: "Car_Descripcion"
        },
        {
          name: "Per_Direccion",
          aling: "center",
          label: "Dirección",
          sortable: true,
          field: "Per_Direccion"
        },
        {
          name: "Per_Email",
          aling: "center",
          label: "Email",
          sortable: true,
          field: "Per_Email"
        },
        {
          name: "Per_Num_documento",
          aling: "center",
          label: "Documento",
          sortable: true,
          field: "Per_Num_documento"
        },
        {
          name: "Per_Telefono",
          aling: "center",
          label: "Telefono",
          sortable: true,
          field: "Per_Telefono"
        },
        {
          name: "Rol_Descripcion",
          aling: "center",
          label: "Rol",
          sortable: true,
          field: "Rol_Descripcion"
        },
        {
          name: "Tp_Desc_corta",
          aling: "center",
          label: "Tipo documento",
          sortable: true,
          field: "Tp_Desc_corta"
        },
        {
          name: "Usu_Login",
          aling: "center",
          label: "Usuario",
          sortable: true,
          field: "Usu_Login"
        },
        {
          name: "name_estado_usuario",
          aling: "center",
          label: "Estado",
          sortable: true,
          field: "name_estado_usuario"
        }
      ],
      excel: {
        columns: [
          {
            label: "Cargo",
            field: "Car_Descripcion"
          },
          {
            label: "Dirección",
            field: "Per_Direccion"
          },
          {
            label: "Email",
            field: "Per_Email"
          },
          {
            label: "Documento",
            field: "Per_Num_documento"
          },
          {
            label: "Telefono",
            field: "Per_Telefono"
          },
          {
            label: "Rol",
            field: "Rol_Descripcion"
          },
          {
            label: "Tipo documento",
            field: "Tp_Desc_corta"
          },
          {
            label: "Usuario",
            field: "Usu_Login"
          },
          {
            label: "Estado",
            field: "name_estado_usuario"
          }
        ],
        data: [],
        title: "Usuarios"
      },
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
        orientation: "l", // l => landscape, p => portrait
        title: {
          title: "Usuarios registrados",
          potitionx: 300,
          potitiony: 30
        },
        styles: {
          font_size: 7
        }
      },
        btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: true
      },
      edit_form: false,
      user_edit: null //ALmacena el usuario a editar
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  methods: {
    ...mapActions("access", [
      "getPersons",
      "InsertUpdateUsuario",
      "InsertUpdatePersonal"
    ]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo lista de usuarios, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_persons = await this.getPersons().then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get personal",
            data: res_persons
          });
          if (res_persons.ok) {
            if (res_persons.result) {
              this.data_users.length = 0;
              res_persons.data.forEach(persona => {
                this.data_users.push({
                  Car_Descripcion: persona.Car_Descripcion,
                  Car_Id: persona.Car_Id,
                  Per_Direccion: persona.Per_Direccion,
                  Per_Email: persona.Per_Email,
                  Per_Estado: persona.Per_Estado,
                  Per_Imagen: persona.Per_Imagen,
                  Per_Nombre: persona.Per_Nombre,
                  Per_Num_documento: persona.Per_Num_documento,
                  Per_Telefono: persona.Per_Telefono,
                  Per_tipo_stock: persona.Per_tipo_stock,
                  Rol_Descripcion: persona.Rol_Descripcion,
                  Rol_Id: persona.Rol_Id,
                  Td_Id: persona.Td_Id,
                  Tp_Desc_corta: persona.Tp_Desc_corta,
                  Usu_Clave_ppl: persona.Usu_Clave_ppl,
                  Usu_Clave_verificacion: persona.Usu_Clave_verificacion,
                  Usu_Estado: persona.Usu_Estado,
                  Usu_Login: persona.Usu_Login,
                  name_estado: persona.name_estado,
                  name_estado_usuario: persona.name_estado_usuario,
                  Id: persona.Per_Num_documento,
                  img: persona.Per_Imagen
                    ? persona.Per_Imagen
                    : "https://cdn.quasar.dev/img/boy-avatar.png",
                  title: persona.Per_Nombre,
                  status: persona.Usu_Estado,
                  btn_status: true,
                  icon_btn_status: "power_settings_new",
                  btn_edit: true,
                  icon_btn_edit: "edit"
                });
              });
            } else {
              this.$q.notify({
                message: res_persons.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_persons.message);
          }
            this.excel.data=this.data_users
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
    },
    reload() {
      this.tab = "users";
      this.renderComponent = false;
      this.edit_form = false;
      this.label = "Crear usuario";
      // Se hace el reload, para ello se debe eliminar el componente componenTable antes de hacer las peticiones y luego rendereizarlo de nuevo
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    editRequest(row) {
      this.user_edit = row;
      this.tab = "formUser";
      this.edit_form = true;
      this.label = "Editar usuario";
    },
    setStatus(row) {
      this.$q
        .dialog({
          component: dialog,
          parent: this,
          title: row.Per_Estado == 1 ? "Inactivar usuario" : "Activar usuario",
          msg: `Atención! Estas a un paso de ${
            row.Per_Estado == 1
              ? "innactivar el usuario, tenga en cuenta, que al inactivarlo, este ya no podrá acceder al sistema"
              : "activar el usuario, tenga en cuenta, que al activarlo, este podrá acceder al sistema "
          }, ¿Desea continuar?`
        })
        .onOk(() => {
          this.$q.loading.show({
            message: "Cambiando estado del usuario, por favor espere..."
          });
          this.timer = setTimeout(async () => {
            try {
              row.base = process.env.__BASE__;
              row.Usu_User_control = this.data_user.Per_Num_documento;
              row.Per_Estado = row.Per_Estado == 1 ? 0 : 1;
              row.Usu_Estado = row.Usu_Estado == 1 ? 0 : 1;

              const res_per = await this.InsertUpdatePersonal(row).then(res => {
                return res.data;
              });
              console.log({
                msg: "Respuesta update persona",
                data: res_per
              });
              if (!res_per.ok) {
                throw new Error(res_per.message);
              }
              const res_create = await this.InsertUpdateUsuario(row).then(
                res => {
                  return res.data;
                }
              );
              console.log({
                msg: "Respuesta update user",
                data: res_create
              });
              if (!res_create.ok) {
                throw new Error(res_create.message);
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
            this.timer = setTimeout(this.getData(), 2000);
          }, 2000);
        });
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
  },
  beforeDestroy() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.$q.loading.hide();
    }
  }
};
</script>
