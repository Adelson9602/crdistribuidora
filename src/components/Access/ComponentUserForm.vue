<template>
  <div>
    <q-form @submit="createUser" id="form">
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
        flat
      >
        <q-step
          :name="1"
          title="Datos básicos del usuario"
          icon="settings"
          :done="step > 1"
          :header-nav="step > 1"
          flat
        >
          <div class="row">
            <!-- Foto de perfil -->
            <div class="col-xs-12 text-body1 text-center">
              Foto de perfil
            </div>
            <div class="col-xs-12 col-md-4 offset-md-4 row justify-center">
              <div class="column justify-center items-center profile-img">
                <q-avatar id="preview" square class="q-mb-md avatar_preview">
                  <img v-if="url" :src="url" />
                </q-avatar>
                <input type="file" @change="onFileChange" id="idImgUser" />
                <q-btn
                  label="Seleccionar imágen"
                  flat
                  @click="dialog_avatar = true"
                />
              </div>
              <q-dialog v-model="dialog_avatar"
                ><!-- Empieza el dialog del avatar -->
                <q-card>
                  <q-toolbar>
                    <q-avatar size="70px">
                      <q-icon
                        name="mdi-account-circle"
                        size="70px"
                        color="primary"
                      />
                    </q-avatar>

                    <q-toolbar-title class="text-toolbar"
                      ><span class="text-weight-bold">Sube</span> una foto o
                      <span class="text-weight-bold">selecciona</span> un
                      avatar</q-toolbar-title
                    >

                    <q-btn flat round dense icon="close" v-close-popup />
                  </q-toolbar>
                  <q-separator />
                  <q-card-section class="q-gutter-md row justify-center">
                    <q-avatar size="70px" class="text-center bg-grey">
                      <label for="idImgUser">Subir foto</label>
                    </q-avatar>
                    <q-avatar
                      size="70px"
                      @click="
                        selectedAvatar(
                          `${urlApi}/adjuntos/men_avatar/m${item}.svg`
                        )
                      "
                      v-for="item in 24"
                      :key="`m${item}`"
                      class="avatar"
                    >
                      <img
                        :src="`${urlApi}/adjuntos/men_avatar/m${item}.svg`"
                      />
                    </q-avatar>
                    <q-avatar
                      v-for="item in 24"
                      :key="`f${item}`"
                      size="70px"
                      class="avatar"
                      @click="
                        selectedAvatar(
                          `${urlApi}/adjuntos/male_avatar/f${item}.svg`
                        )
                      "
                    >
                      <img
                        :src="`${urlApi}/adjuntos/male_avatar/f${item}.svg`"
                      />
                    </q-avatar>
                  </q-card-section>
                </q-card> </q-dialog
              ><!-- Finaliza el dialog del avatar -->
            </div>
            <!-- inputs -->
            <div class="col-xs-12 row q-gutter-y-md q-mt-sm">
              <div class="col-xs-12 text-body1 q-px-sm">
                Datos personales
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.Per_Nombre"
                  hint="Nombres y apellidos"
                  :rules="[val => !!val || 'Nombres es obligatorio']"
                  maxlength="50"
                  @input="
                    val => {
                      personal.Per_Nombre = val.toUpperCase();
                    }
                  "
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-select
                  v-model="personal.Td_Id"
                  :options="options_tipo_documento"
                  hint="Tipo documento"
                  filled
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Tipo documento es obligatorio']"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.Per_Num_documento"
                  hint="No. Documento"
                  :rules="[val => !!val || 'No. Documento es obligatorio']"
                  maxlength="15"
                  mask="###############"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.Per_Email"
                  hint="Email"
                  :rules="[val => !!val || 'Email es obligatorio']"
                  type="email"
                  maxlength="50"
                  @input="
                    val => {
                      personal.Per_Email = val.toUpperCase();
                    }
                  "
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.Per_Direccion"
                  hint="Dirección"
                  type="text"
                  maxlength="250"
                  @input="
                    val => {
                      personal.Per_Direccion = val.toUpperCase();
                    }
                  "
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.Per_Telefono"
                  hint="Teléfono"
                  :rules="[val => !!val || 'Teléfono es obligatorio']"
                  maxlength="12"
                  mask="############"
                  @input="
                    val => {
                      personal.Per_Telefono = val.toUpperCase();
                    }
                  "
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <!-- selects -->
                <q-select
                  filled
                  v-model="personal.Car_Id"
                  :options="options_cargos"
                  hint="Cargo"
                  :rules="[val => !!val || 'Cargo es obligatorio']"
                  map-options
                  emit-value
                />
              </div>
              <div class="col-xs-12 text-body1 q-px-sm">
                Datos de la cuenta
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="usuario.Usu_Login"
                  hint="Usuario"
                  :rules="[val => !!val || 'Usuario es obligatorio']"
                  type="text"
                  maxlength="36"
                  @input="
                    val => {
                      usuario.Usu_Login = val.toUpperCase();
                    }
                  "
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="clave_verificacion"
                  hint="Contraseña verificación"
                  :rules="[
                    val => !!val || 'Contraseña verificación es obligatorio'
                  ]"
                  type="text"
                  maxlength="36"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  suggested="current-password"
                  filled
                  v-model="Password"
                  :type="isPwd ? 'password' : 'text'"
                  hint="Contraseña"
                  :rules="[val => !!val || 'Contraseña es obligatorio']"
                  maxlength="12"
                  counter
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  suggested="current-password"
                  filled
                  v-model="confirmPassword"
                  :type="isPwd ? 'password' : 'text'"
                  hint="Confirmar Contraseña"
                  :rules="[val => !!val || 'Contraseña es obligatorio']"
                  maxlength="512"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <!-- selects -->
                <q-select
                  filled
                  v-model="usuario.Usu_Estado"
                  :options="estadooptions"
                  hint="Estado"
                  :rules="[valState]"
                  map-options
                  emit-value
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <!-- selects -->
                <q-select
                  filled
                  v-model="selected_rol"
                  :options="optionsRoles"
                  hint="Rol"
                  :rules="[val => !!val || 'Rol es obligatorio']"
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>

          <q-stepper-navigation class="row justify-end">
            <q-btn type="submit" color="primary" label="Continuar" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Permisos"
          icon="create_new_folder"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <div class="row">
            <!--Modulos para permisos Básicos-->
            <div
              class="col-xs-12 col-sm-12 col-md-6 q-px-sm"
              v-if="selected_rol"
            >
              <div class="text-body1 text-uppercase">
                Modulos (Permisos básicos)
              </div>
              <q-scroll-area style="height: 67vh">
                <div class="col-xs-12 col-sm-6">
                  <div v-for="(modulo, index) in array_modules" :key="index">
                    <div v-if="modulo.items.length > 0">
                      <b v-if="modulo.items.length > 0"
                        ><label>{{ modulo.label }}</label></b
                      >
                      <div
                        v-for="(items, sbindex) in modulo.items"
                        :key="sbindex"
                      >
                        <q-list class="full-width" v-if="items.Estado == 1">
                          <q-item v-if="items.selected" clickable v-ripple>
                            <q-item-section>
                              <q-item-label>
                                <q-checkbox
                                  v-model="items.selected"
                                  color="secondary"
                                  :label="items.Descripcion"
                                  :val="items.IdItem"
                                  v-if="items.selected"
                                  @input="disableItem(index, sbindex)"
                                />
                              </q-item-label>
                              <!-- Temporalemte comentareado -->
                              <q-item-label caption class="q-px-xl">
                                Acciones para el usuario
                              </q-item-label>
                              <q-item-label caption class="q-px-xl">
                                <q-checkbox
                                  v-model="items.Actualizar"
                                  color="secondary"
                                  label="Actualizar"
                                  val="1"
                                  v-if="items.selected"
                                />
                                <q-checkbox
                                  v-model="items.Crear"
                                  color="secondary"
                                  label="Crear"
                                  val="1"
                                  v-if="items.selected"
                                />
                                <q-checkbox
                                  v-model="items.Leer"
                                  color="secondary"
                                  label="Leer"
                                  val="1"
                                  v-if="items.selected"
                                />
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </div>
            <!--Modulos para permisos adicionales-->
            <div
              class="col-xs-12 col-sm-12 col-md-6 q-px-sm"
              v-if="selected_rol"
            >
              <div class="text-body1 text-uppercase">
                Modulos (Permisos adicionales)
              </div>
              <q-scroll-area style="height: 67vh">
                <div v-for="(modulo, index) in array_modules" :key="index">
                  <div v-if="modulo.items.length > 0" class="row">
                    <b
                      ><label>{{ modulo.label }}</label></b
                    >
                    <div
                      class="col-xs-12"
                      v-for="(items, index) in modulo.items"
                      :key="index"
                    >
                      <q-checkbox
                        v-model="items.selected"
                        color="secondary"
                        :label="items.Descripcion"
                        :val="items.IdItem"
                        v-if="!items.selected"
                      />
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </div>
          </div>

          <q-stepper-navigation class="row justify-end">
            <q-btn
              type="submit"
              color="primary"
              :label="step === 2 ? 'Guardar' : 'Continuar'"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Volver"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import CryptoJS from "crypto-js";

const roles = [];
export default {
  name: "ComponentUserForm",
  data() {
    return {
      step: 1,
      base: process.env.__BASE__,
      isPwd: false, //Cambia el tipo de input del password
      tab: "users",
      respuesta: null,
      countAditionalPermit: null,
      url: null, //almacenamiento de imagen para muestreo
      data: [],
      Password: null,
      confirmPassword: null, //Comparativo con Password
      clave_verificacion: null,
      items: [],
      array_modules: [],
      optionsRoles: roles,
      selected_rol: null,
      file: null, //Almacenamiento de datos Array de imagen
      array_bodegas: [],
      personal: {
        base: null,
        Per_Num_documento: null,
        Per_Nombre: null,
        Td_Id: null,
        Per_Direccion: null,
        Per_Telefono: null,
        Per_Email: null,
        Car_Id: null,
        Per_Imagen: null,
        Per_Estado: 1,
        Per_tipo_stock: null
      },
      usuario: {
        base: null,
        Usu_Login: null,
        Usu_Clave_ppl: null,
        Usu_Clave_verificacion: null,
        Rol_Id: null,
        Per_Num_documento: null,
        Usu_Estado: null,
        Usu_User_control: null
      },
      estadooptions: [
        {
          label: "Activo",
          value: 1
        },
        {
          label: "Inactivo",
          value: 0
        }
      ],
      options_cargos: [],
      // estate_update_user: null,
      // estado_update_options: ['SI', 'NO'],
      dialog_avatar: false,
      urlApi: "https://apis.qinspecting.com/newapp/", //Variable temporal
      avatar: "",
      user_edit: null, //Almacena los datos del usuario a editar
      edit_form: false, //Permite validar que funciones ejecutar dependiendo si se va a crear o editar
      optionsPerson: [
        {
          label: "NATURAL",
          value: 1
        },
        {
          label: "JURIDICA",
          value: 2
        }
      ],
      options_tipo_documento: []
    };
  },
  props: ["editForm", "propDataUser"],
  created() {
    this.getData();
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  watch: {
    selected_rol(newValue) {
      if (newValue) {
        this.usuario.Rol_Id = newValue;
        this.CheckPermissions(newValue);
      }
    },
    file(newValue) {
      if (newValue) {
        let extension_foto = newValue.type.split("/");
        // Creamos un nombre con la fecha y hora del momento que se selecciona el archivo, a esa fecha le reemplazamos los . por ' ', los : y los - por _ y al resultado concatenamos un . y la extensión del archivo
        let name_file_foto =
          this.replaceAll(
            this.replaceAll(
              this.replaceAll(new Date().toISOString().toLowerCase(), ".", ""),
              ":",
              "_"
            ),
            "-",
            "_"
          ) +
          "." +
          extension_foto[1];
        newValue.newname = name_file_foto;
      }
    }
  },
  methods: {
    ...mapActions("access", [
      "GetModules",
      "GetItems",
      "getCheckPermissions",
      "InsertUpdateUsuario",
      "InsertUpdatePersonal",
      "saveFile",
      "getPermissionUserEdit",
      "insertUpdatePersmiso"
    ]),
    ...mapActions("master", ["getRol", "GetDocumentTypes", "getCargos"]),
    ...mapMutations("auth", ["setUser", "setUserPermissions"]),
    ...mapActions("shopping", ["getTpDoc"]),
    ...mapActions("auth", ["login"]),
    // Obtiene datos del servidor, son los que se usan en el frontend, tanto para selects, inputs, cehckbox
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere..."
      });
      this.timer = setTimeout(async () => {
        try {
          const resgetRol = await this.getRol(this.base).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get roles",
          //   data: resgetRol,
          // });
          roles.length = 0;
          resgetRol.data.forEach(rol => {
            if (rol.Rol_Id >= this.data_user.Rol_Id) {
              roles.push({
                label: rol.Rol_Descripcion,
                value: rol.Rol_Id
              });
            }
          });

          const res_docu = await this.getTpDoc().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get tipo documento',
          //   data: res_docu
          // });
          if (res_docu.ok) {
            if (res_docu.result) {
              this.options_tipo_documento.length = 0;
              res_docu.data.forEach(t_docu => {
                this.options_tipo_documento.push({
                  label: t_docu.Td_Descripcion,
                  value: t_docu.Td_Id
                });
              });
            } else {
              this.$q.notify({
                message: "Ops! sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_docu.message);
          }

          const res_carg = await this.getCargos().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get cargos',
          //   data: res_carg
          // });
          if (res_carg.ok) {
            if (res_carg.result) {
              this.options_cargos.length = 0;
              res_carg.data.forEach(cargo => {
                if (cargo.Car_Estado == 1) {
                  this.options_cargos.push({
                    label: cargo.Car_Descripcion,
                    value: cargo.Car_Id
                  });
                }
              });
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_carg.message);
          }
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
            type: "negative"
          });
        } finally {
          this.$q.loading.hide();
        }
        // Si estamos editando el usuario, entonces asignamos los datos del usuario a editar cada uno de los inputs y selects
        if (this.editForm) {
          this.isPwd = true;
          this.timer = setTimeout(this.assingEditData(), 2000);
        }
      }, 2000);
    },
    // Valida el formulario antes de enviar a la BD
    async createUser() {
      if (this.step == 2) {
        // Validamos coincidencia de contraseñas
        if (this.confirmPassword !== this.Password) {
          this.$q.notify({
            message: "Las contraseñas no son iguales",
            type: "warning"
          });
        } else {
          if (this.personal.Per_Imagen) {
            if (this.file) {
              // Se sube la foto al servidor
              const formData = new FormData();
              formData.append("files", this.file, this.file.newname);
              const ressaveFile = await this.saveFile(formData).then(
                async res => {
                  return res.data;
                }
              );
              console.log({
                msg: "Respuesta subida foto de perfil",
                data: ressaveFile
              });

              this.personal.Per_Imagen = `${process.env.__URLAPI__}/adjuntos/${this.file.newname}`;
              /*Se inicia guardado de datos en tabla usuario*/
              this.sendDataUser();
              return;
            } else {
              this.sendDataUser();
              return;
            }
          } else {
            this.$q.notify({
              message: "Debe seleccionar un avatar o una foto de perfil",
              type: "warning"
            });
          }
        }
      } else {
        this.$refs.stepper.next();
      }
    },
    // Envia los datosd el usuario al servidor BD
    async sendDataUser() {
      // Empezamos a registrar el usuario
      this.$q.loading.show({
        message: "Guardando usuario, por favor espere..."
      });
      try {
        this.usuario.Usu_Clave_ppl = this.aesEncrypt(this.Password);
        this.usuario.Usu_Clave_verificacion = this.aesEncrypt(
          this.clave_verificacion
        );
        this.usuario.Usu_User_control = this.data_user.Per_Num_documento;
        this.usuario.base = process.env.__BASE__;
        this.usuario.Per_Num_documento = this.personal.Per_Num_documento;
        this.personal.base = process.env.__BASE__;

        const res_per = await this.InsertUpdatePersonal(this.personal).then(
          res => {
            return res.data;
          }
        );
        console.log({
          msg: "Respuesta insert persona",
          data: res_per
        });
        if (!res_per.ok) {
          throw new Error(res_per.message);
        }
        const res_create = await this.InsertUpdateUsuario(this.usuario).then(
          res => {
            return res.data;
          }
        );
        console.log({
          msg: "Respuesta insert user",
          data: res_create
        });
        if (!res_create.ok) {
          throw new Error(res_create.message);
        }

        // Inserta los permisos
        let promesas_insert = [];
        this.array_modules.forEach(modulo => {
          modulo.items.forEach(item => {
            if (item.selected) {
              let PermitAditional = {
                Id_usuario: this.personal.Per_Num_documento,
                Estado: 1,
                Id_item: item.Id_item,
                Usuario_control: this.data_user.Per_Num_documento,
                Crear: item.Crear ? 1 : 0,
                Leer: item.Leer ? 1 : 0,
                Actualizar: item.Actualizar ? 1 : 0,
                Borrar: item.Borrar ? 1 : 0,
                base: process.env.__BASE__
              };
              let pro_per = this.insertUpdatePersmiso(PermitAditional).then(
                res => {
                  return res.data;
                }
              );
              promesas_insert.push(pro_per);
            } else if (this.edit_form && !item.selected) {
              //Estamos desasociando el permiso
              let PermitAditional = {
                Id_usuario: this.usuario.Per_Num_documento,
                Estado: 0,
                Id_item: item.Id_item,
                Usuario_control: this.data_user.Per_Num_documento,
                Crear: 0,
                Leer: 1,
                Actualizar: 0,
                Borrar: 0,
                base: process.env.__BASE__
              };
              let pro_per = this.insertUpdatePersmiso(PermitAditional).then(
                res => {
                  return res.data;
                }
              );
              promesas_insert.push(pro_per);
            }
          });
        });
        // Ejecuta las peticiones insert de los permisos
        Promise.all(promesas_insert).then(res => {
          res.forEach(data => {
            console.log({
              msg: "Respuesta insert permisos",
              data: data
            });
            if (!data.ok) {
              throw new Error(data.message);
            }
          });
        });
        if (
          this.edit_form &&
          this.data_user.Per_Num_documento == this.usuario.Per_Num_documento
        ) {
          let user_logged = {
            user: this.usuario.Usu_Login,
            password: this.usuario.Usu_Clave_ppl,
            base: process.env.__BASE__
          };
          const resPostLogin = await this.login(user_logged).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'mensaje login',
          //   data: resPostLogin
          // })
          this.setUser({}); //Vaciamos el estado antes de asginar los nuevos valores
          this.setUser(resPostLogin.data);

          const resgetPermissionUser = await this.getPermissionUserEdit(
            this.user_edit.Per_Num_documento
          ).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get permisos asignados del usuario',
          //   data: resgetPermissionUser
          // });
          let state_permissions = [];
          this.setUserPermissions([]);
          // Permisos para el estado
          this.array_modules.forEach(modulo => {
            resgetPermissionUser.data.forEach(permiso_basico => {
              if (
                modulo.Id_modulo == permiso_basico.Id_modulo &&
                permiso_basico.Estado == 1
              ) {
                state_permissions.push({
                  modulo: modulo.label.replace(/\b\w/g, l => l.toUpperCase()),
                  Id_modulo: permiso_basico.Id_modulo,
                  Actualizar: true,
                  Borrar: true,
                  Crear: true,
                  Leer: true,
                  route: `/${permiso_basico.router}`
                });
              }
            });
          });
          this.setUserPermissions(state_permissions);
          location.reload();
        }

        this.$q.notify({
          message: "Guardado",
          type: "positive"
        });
        // Limpiamos el formulario
        this.$emit("reload");
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    // Obtiene los permisos del rol seleccionado
    async CheckPermissions(id_rol) {
      this.$q.loading.show({
        message: "Obteniendo permisos, por favor espere..."
      });
      try {
        const res_modulos = await this.GetModules().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta get modulos",
        //   data: res_modulos,
        // });
        if (res_modulos.ok) {
          this.array_modules.length = 0;
          res_modulos.data.forEach(modulebase => {
            this.array_modules.push({
              Descripcion: modulebase.Descripcion,
              Id_modulo: modulebase.Id_modulo,
              label: modulebase.label.replace(/\b\w/g, l => l.toUpperCase()),
              items: []
            });
          });
        } else {
          throw new Error(res_modulos.message);
        }

        const res_permi = await this.getCheckPermissions(id_rol).then(res => {
          return res.data;
        });
        // console.log({
        //   msg: "Respuesta permisos básicos y adicionales",
        //   data: res_permi,
        // });
        if (res_permi.ok) {
          this.array_modules.forEach(modulo => {
            res_permi.data.forEach(permiso => {
              if (modulo.Id_modulo == permiso.Id_modulo) {
                modulo.items.push({
                  Descripcion: permiso.Descripcion,
                  Actualizar: permiso.Actualizar,
                  Borrar: permiso.Borrar,
                  Crear: permiso.Crear,
                  Estado: permiso.Estado,
                  Id_item: permiso.Id_item,
                  Id_rol: permiso.Id_rol,
                  selected: permiso.Id_rol ? true : false,
                  basico: permiso.Id_rol ? true : false,
                  Actualizar: permiso.Actualizar === 1 ? true : false,
                  Borrar: permiso.Borrar === 1 ? true : false,
                  Crear: permiso.Crear === 1 ? true : false,
                  Leer: permiso.Leer === 1 ? true : false
                });
              }
            });
          });
        } else {
          throw new Error(res_permi.message);
        }
        // Si se esta editando, se busca cuales permisos tiene el usuario y se selecciona
        if (this.edit_form) {
          const resgetPermissionUserEdit = await this.getPermissionUserEdit(
            this.user_edit.Per_Num_documento
          ).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get permisos asignados del usuario a editar',
          //   data: resgetPermissionUserEdit
          // });
          this.array_modules.forEach(modulo => {
            modulo.items.forEach(permiso_basico => {
              let permiso_selecte = resgetPermissionUserEdit.data.find(
                permiso_user => permiso_user.id == permiso_basico.Id_item
              );
              if (permiso_selecte) {
                // permiso_basico.Estado = permiso_selecte.Estado;
                // permiso_basico.Id_modulo = permiso_selecte.Id_modulo;
                // permiso_basico.Id_rol = permiso_selecte.Id_rol;
                // permiso_basico.Descripcion = permiso_selecte.Descripcion;
                permiso_basico.modulo = permiso_selecte.modulo;
                permiso_basico.selected =
                  permiso_selecte.Estado == 1 ? true : false;
                permiso_basico.basico =
                  permiso_selecte.Estado == 1 ? true : false;
                permiso_basico.Actualizar =
                  permiso_selecte.Actualizar == 1 ? true : false;
                permiso_basico.Borrar =
                  permiso_selecte.Borrar == 1 ? true : false;
                permiso_basico.Crear =
                  permiso_selecte.Crear == 1 ? true : false;
                permiso_basico.Leer = permiso_selecte.Leer == 1 ? true : false;
              }
            });
          });
        }
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
      /*Fin funcion api roles*/
    },
    // Asigna los datos a editar a cada input y select
    async assingEditData() {
      this.$q.loading.show({
        message: "Obteniendo datos del usuario, por favor espere..."
      });
      try {
        this.edit_form = this.editForm;
        this.user_edit = this.propDataUser;
        this.url = this.user_edit.img;
        this.selected_rol = this.user_edit.Rol_Id;
        this.personal = {
          base: null,
          Per_Num_documento: this.user_edit.Per_Num_documento,
          Per_Nombre: this.user_edit.Per_Nombre,
          Td_Id: this.user_edit.Td_Id,
          Per_Direccion: this.user_edit.Per_Direccion,
          Per_Telefono: this.user_edit.Per_Telefono,
          Per_Email: this.user_edit.Per_Email,
          Car_Id: this.user_edit.Car_Id,
          Per_Imagen: this.user_edit.img,
          Per_Estado: this.user_edit.Per_Estado,
          Per_tipo_stock: this.user_edit.Per_tipo_stock
        };

        this.usuario = {
          base: null,
          Usu_Login: this.user_edit.Usu_Login,
          Usu_Clave_ppl: this.user_edit.Usu_Clave_ppl,
          Usu_Clave_verificacion: this.user_edit.Usu_Clave_verificacion,
          Rol_Id: this.user_edit.Rol_Id,
          Per_Num_documento: this.user_edit.Per_Num_documento,
          Usu_Estado: this.user_edit.Usu_Estado,
          Usu_User_control: null
        };

        this.Password = this.aesDencrypt(this.user_edit.Usu_Clave_ppl);
        this.clave_verificacion = this.aesDencrypt(
          this.user_edit.Usu_Clave_verificacion
        );
        this.confirmPassword = this.aesDencrypt(this.user_edit.Usu_Clave_ppl);
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    // Deselecciona todos los permisos
    disableItem(mindex, sbindex) {
      this.array_modules.forEach((modulo, index) => {
        if (mindex === index) {
          modulo.items.forEach((item, iindex) => {
            if (sbindex === iindex) {
              item.Actualizar = false;
              item.Crear = false;
            }
          });
        }
      });
    },
    cleanForm() {
      this.dialog = false;
      this.personal = {
        documento: null,
        Id_tipo_documento: null,
        nombres: null,
        apellidos: null,
        fecha_nacimiento: null,
        tipo_persona: null,
        usuario_control: null,
        email: null,
        direccion: null,
        telefonos: null,
        base: null
      };
      this.usuario = {
        ID_Usuario: null,
        ID_Usuario_Person: null,
        cc_creador: null,
        ID_Rol: null,
        Estado: null,
        Password: null,
        Foto: null,
        ID_Usuario_Control: null,
        base: null
      };
      this.selectedCity = null;
      this.selectedProduct = null;
      this.selectedworkgroup = null;
      this.confirmPassword = null;
    },
    // Asigna una url para mostrar la imagen de perfil
    onFileChange(e) {
      const file = e.target.files[0];
      this.file = file;
      this.url = URL.createObjectURL(file);
      this.dialog_avatar = false;
      this.personal.Per_Imagen = this.url;
    },
    // Asigna la imgen cargada y deshabilita el dialogo de avatars
    selectedAvatar(img) {
      this.avatar = img;
      this.url = img;
      this.dialog_avatar = false;
      this.personal.Per_Imagen = this.url;
    },
    // Encripta contraseñas o strings
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(
        txt,
        CryptoJS.enc.Utf8.parse(process.env.__KEY__),
        {
          iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
          mode: CryptoJS.mode.CBC
        }
      ).toString();
      return cipher.toString();
    },
    aesDencrypt(txt) {
      const cipher = this.CryptoJS.AES.decrypt(
        txt,
        CryptoJS.enc.Utf8.parse(process.env.__KEY__),
        {
          iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
          mode: CryptoJS.mode.CBC
        }
      );
      return CryptoJS.enc.Utf8.stringify(cipher).toString();
    },
    // Reemplaza elementos de un string
    replaceAll(text, busca, reemplaza) {
      while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
      return text;
    },
    valState(val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!val && val != 0) {
            resolve(false || "Estado es requerido");
          }
          // call
          resolve(true);
        }, 300);
      });
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
<style scoped>
.avatar_preview {
  width: 100%;
  height: 190px;
  padding: 5px;
  border-radius: 5px;
}
.avatar {
  cursor: pointer;
}
.profile-img {
  border: 1px solid rgb(202, 202, 202);
  border-radius: 10px;
  width: 200px;
}
input[type="file"]#idImgUser {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
label[for="idImgUser"] {
  font-size: 14px;
  color: #ffffff;
  display: inline-block;
  transition: all 0.5s;
  cursor: pointer;
  /* padding: 15px 26px !important; */
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: 100%;
  text-align: center;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.text-toolbar {
  white-space: normal;
}
/* Estilos para los avatars */
.avatar:hover {
  transform: scale(0.9);
}
</style>
