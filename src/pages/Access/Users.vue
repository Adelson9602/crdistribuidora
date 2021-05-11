<template>
  <q-page padding class="q-mt-md">
    <!-- content -->
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
        <!-- <div class="text-h6">Usuarios</div> -->
        <p>Aquí encontrarás todos los usuarios que has registrado</p>
        <!-- <q-btn @click="updatePasswords" label="Actualizar contraseñas"/> -->
        <list-user
          :data="arrayUsers"
          :titles="arrayTitles"
          tableTitle="Lista de usuarios"
          :headers="headerJspdf"
          documentName="lista_usuarios.pdf"
          position="l"
          :img="true"
          :documents="false"
          @dialog="openTab"
          @dialogEnable="openDialogEnable"
          @defaultValues="cancelEdit"
          v-if="renderComponent"
        />
        <component-skeleton-table v-if="!renderComponent" />
        <dialog-enable
          :dialog="dialogEnable"
          :state="enableEstate"
          :msg="msgEnable"
          @enable="enable"
          @cancel="cancelEnable"
          :title="titleDialog"
        />
      </q-tab-panel>

      <q-tab-panel name="formUser">
        <!-- <div class="text-h6">Crear nuevo usuario</div> -->
        <p>
          Todos los datos solicitados en este formulario son obligatorios para
          crear un usuario
        </p>
        <user-form
          :Roles="arrayRoles"
          :Deparments="arrayDeparments"
          :Position="arrayPosition"
          :typeDocuments="arrayTypeDocuments"
          :Licenses="arrayLicenses"
          :tabForm="tabForm"
          @reload="reload"
          @cancel="cancelEdit"
          :dataUser="dataUser"
          :labelBtn="label"
          @defaultValues="cancelEdit"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import UserForm from "components/Access/ComponentUserForm";
import ListUser from "components/Generals/ComponentTable";
import componentSkeletonTable from "components/Generals/componentSkeletonTable";
import DialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapMutations, mapState } from "vuex";
var CryptoJS = require("cryp-to-js").default;

export default {
  name: "PageUser",
  data() {
    return {
      renderComponent: true,
      arrayRoles: [],
      arrayDeparments: [],
      arrayPosition: [],
      arrayTypeDocuments: [],
      arrayLicenses: [],
      tab: "users",
      users: [],
      arrayTitles: [
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
      headerJspdf: [
        { header: "Nombre", dataKey: "Pers_Nombres" },
        { header: "Apellido", dataKey: "Pers_Apellidos" },
        { header: "Cedula", dataKey: "UsuarioUser" },
        { header: "Celular", dataKey: "Pers_Celular" },
        { header: "Email", dataKey: "Pers_Email" },
        { header: "Rol", dataKey: "Rol_Nombre" },
        { header: "Descripción del rol", dataKey: "Rol_Descripcion" },
        { header: "Estado", dataKey: "Usuario_Estado" }
      ],
      label: "Crear Usuario",
      tabForm: false,
      dataUser: {},
      dialogEnable: false,
      icon: false,
      enableEstate: false,
      msgEnable: null,
      titleDialog: "",
      idPerson: null
    };
  },
  components: {
    UserForm,
    ListUser,
    componentSkeletonTable,
    DialogEnable
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState("access", ["allUsers", "start"]),
    ...mapState("app", ["isOnline"]),
    ...mapState("auth", ["user"]),
    arrayUsers() {
      if (this.isOnline) {
        return this.users;
      } else {
        return this.allUsers;
      }
    },
    userLogged() {
      return this.user;
    }
  },
  methods: {
    ...mapActions("access", [
      "getUsers",
      "getRolesAdministrators",
      "getDeparments",
      "getTypeDocuments",
      "enableUser",
      "disableUser",
      "updatePassword"
    ]),
    ...mapMutations("access", [
      "setDataUser",
      "setRoles",
      "setDeparments",
      "setTypeDocuments",
      "setIdPerson"
    ]),
    ...mapMutations("main", ["setCities", "setDataPositions"]),
    ...mapActions("main", ["getPositions"]),
    ...mapActions("documents", ["getlicensecategories"]),
    ...mapMutations("documents", ["setDatalicensecategories"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo lista de usuarios, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.setDataUser([]); // Se limpia el array de usuarios
          this.users.length = 0;
          const { data } = await this.getUsers(); //This is for get data of the api, this is a action
          // Recorremos el obtejo que nos retorna la api
          data.forEach(user => {
            // verificamos si el valor de marca_estado que viene de la api = 1 y si vale 1 será reemplazado por activo, caso contrario por inactivo
            if (user.Usuario_Estado === 1) {
              user.Usuario_Estado = "Activo";
            } else {
              user.Usuario_Estado = "Inactivo";
            }
            for (const key in user) {
              if (user[key] === null) {
                user[key] = "N/A";
              }
            }
            this.users.push(user);
          });
          this.setDataUser(this.users); // send data to mutations

          this.setDeparments([]);
          const deparments = await this.getDeparments().then(res => {
            return res.data;
          });

          this.arrayDeparments.length = 0;
          deparments.forEach(element => {
            this.arrayDeparments.push({
              label: element.Dpt_Nombre,
              value: element.Dpt_Id
            });
          });
          this.setDeparments(this.arrayDeparments);

          // options_position
          this.setDataPositions([]);
          const positions = await this.getPositions().then(res => {
            return res.data;
          }); //Get positions from api
          this.arrayPosition.length = 0;
          positions.forEach(element => {
            if (element.State === 1) {
              this.arrayPosition.push({
                label: element.Cargo,
                value: element.id
              });
            }
          });
          this.setDataPositions(this.arrayPosition);

          this.setRoles([]);
          const roles = await this.getRolesAdministrators().then(res => {
            return res.data;
          });
          this.arrayRoles.length = 0;
          roles.forEach(element => {
            if (this.userLogged.Rol_Id === 3) {
              this.arrayRoles.push({
                label: element.Rol_Nombre,
                value: element.Rol_Id
              });
            } else if (element.Rol_Id !== 3) {
              this.arrayRoles.push({
                label: element.Rol_Nombre,
                value: element.Rol_Id
              });
            }
          });
          this.setRoles(this.arrayRoles);

          this.setTypeDocuments([]);
          const typeDocuments = await this.getTypeDocuments().then(res => {
            return res.data;
          });
          this.arrayTypeDocuments.length = 0;
          typeDocuments.forEach(element => {
            this.arrayTypeDocuments.push({
              label: element.TipoDoc_Descrip,
              value: element.TipoDoc_Id
            });
          });
          this.setTypeDocuments(this.arrayTypeDocuments);

          this.setDatalicensecategories([]); // send data to mutations
          const licensecategories = await this.getlicensecategories().then(
            res => {
              return res.data;
            }
          ); //This is for get data of the api, this is a action
          // Recorremos el obtejo que nos retorna la api
          this.arrayLicenses.length = 0;
          licensecategories.forEach(licensecategory => {
            this.arrayLicenses.push(licensecategory.Cat_lic_id);
          });
          this.setDatalicensecategories(this.arrayLicenses); // send data to mutations
          this.reloadData = false;
          this.renderComponent = true; //Muestra la tabla luego de ser destruida al actualizar un dato
        } catch (error) {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: "Error trayendo datos del servidor"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    openTab(Id) {
      this.label = "Editar Usuario";
      this.tab = "formUser";
      this.tabForm = true;
      this.arrayUsers.forEach(element => {
        if (element.UsuarioUser === Id) {
          this.dataUser = element;
        }
      });
      this.$emit("editUser");
    },
    cancelEdit(newValueObjet) {
      this.label = "Crear Usuario";
      this.tab = "users";
      this.tabForm = false;
      this.dataUser = newValueObjet;
    },
    cancelEnable() {
      this.dialogEnable = false;
      this.icon = false;
      this.enableEstate = false;
      this.msgEnable = null;
    },
    openDialogEnable(id, state) {
      this.idPerson = id;
      if (state === 1) {
        // Para inhabilitar si esta habilitado
        this.msgEnable = `Recuerde qué, al inhabilitar este usuario, se consevará el historial de actividades y se bloqueará el  ingreso al sistema`;
        this.enableEstate = false;
        this.titleDialog = "Inhabilitar usuario";
      } else {
        // Para habilitar si esta inhabilitado
        this.msgEnable = `Recuerde qué, al habilitar este usuario, este tendrá acceso al sistema y podra ejecutar funciones de acuerdo al Rol asignado cuando se registro`;
        this.enableEstate = true;
        this.titleDialog = "Habilitar usuario";
      }
      this.dialogEnable = true;
    },
    enable() {
      this.setIdPerson(this.idPerson);
      var msgLoading;
      if (!this.enableEstate) {
        msgLoading = "Estamos deshabilitando el usuario, por favor espere...";
      } else {
        msgLoading = "Estamos habilitando el usuario, por favor espere...";
      }
      this.$q.loading.show({
        message: msgLoading
      });
      setTimeout(async () => {
        try {
          if (!this.enableEstate) {
            await this.disableUser().then(res => {
              if (res.data.affectedRows > 0) {
                this.$q.notify({
                  type: "positive",
                  message: "Usuario deshabilitado"
                });
              } else {
                this.$q.notify({
                  type: "negative",
                  message:
                    "No pudimos deshabilitador el usuario, intente nuevamente"
                });
              }
            });
          } else {
            await this.enableUser().then(res => {
              if (res.data.affectedRows > 0) {
                this.$q.notify({
                  type: "positive",
                  message: "Usuario habilitado"
                });
              } else {
                this.$q.notify({
                  type: "negative",
                  message: "No pudimos habilitar el usuario, intente nuevamente"
                });
              }
            });
          }
          // Reload
          this.reload();
        } catch (e) {
          console.log(e);
          this.$q.notify({
            type: "negative",
            message: "Error ejecutando funciones del sistema"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    reload() {
      this.dialogEnable = false;
      this.reloadData = true;
      this.label = "Crear Usuario";
      this.tab = "users";
      this.tabForm = false;
      this.renderComponent = false; //Destruye la tabla para refrescar datos
      this.getData();
    },
    updatePasswords() {
      this.$q.loading.show({
        message: "Actilizando contraseñas"
      });
      setTimeout(async () => {
        try {
          this.users.forEach(async user => {
            let password = this.encryptedAES(user.UsuarioUser.toString());
            let data = {
              Usuario_Contra: password,
              UsuarioUser: user.UsuarioUser
            };
            const resUpdate = await this.updatePassword(data).then(res => {
              return res.data;
            });
            console.log(resUpdate);
          });
        } catch (error) {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: "Error trayendo datos del servidor"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
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
