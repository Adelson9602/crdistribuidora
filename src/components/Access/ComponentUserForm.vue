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
            <div class="col-xs-12 col-md-4 offset-md-4">
              <div class="text-body1 text-center">
                Foto de perfil
              </div>
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
              <q-dialog v-model="dialog_avatar"><!-- Empieza el dialog del avatar -->
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
                        selectedAvatar(`${urlApi}/adjuntos/men_avatar/m${item}.svg`)
                      "
                      v-for="item in 24"
                      :key="`m${item}`"
                      class="avatar"
                    >
                      <img :src="`${urlApi}/adjuntos/men_avatar/m${item}.svg`" />
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
                      <img :src="`${urlApi}/adjuntos/male_avatar/f${item}.svg`" />
                    </q-avatar>
                  </q-card-section>
                </q-card>
              </q-dialog><!-- Finaliza el dialog del avatar -->
            </div>
            <!-- inputs -->
            <div class="col-xs-12 row q-gutter-y-md q-mt-sm">
              <div class="col-xs-12 text-body1 q-px-sm">
                Datos personales
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.nombres"
                  hint="Nombres"
                  :rules="[(val) => !!val || 'Nombres es obligatorio']"
                  maxlength="50"
                  @input= "val => { personal.nombres = val.toUpperCase() }"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.apellidos"
                  hint="Apellidos"
                  :rules="[(val) => !!val || 'Apellidos es obligatorio']"
                  maxlength="50"
                  @input= "val => { personal.apellidos = val.toUpperCase() }"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input filled v-model="personal.fecha_nacimiento" mask="date" :rules="['date']" hint="Fecha nacimiento">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="personal.fecha_nacimiento">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Ok" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-select
                  v-model="personal.Id_tipo_documento"
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
                  v-model="usuario.ID_Usuario_Person"
                  hint="No. Documento"
                  :rules="[(val) => !!val || 'No. Documento es obligatorio']"
                  maxlength="15"
                  mask="###############"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.email"
                  hint="Email"
                  :rules="[(val) => !!val || 'Email es obligatorio']"
                  type="email"
                  maxlength="50"
                  @input= "val => { personal.email = val.toUpperCase() }"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.direccion"
                  hint="Dirección"
                  type="text"
                  maxlength="250"
                  @input= "val => { personal.direccion = val.toUpperCase() }"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <q-input
                  filled
                  v-model="personal.telefonos"
                  hint="Teléfono"
                  :rules="[(val) => !!val || 'Teléfono es obligatorio']"
                  maxlength="12"
                  mask="############"
                  @input= "val => { personal.telefonos = val.toUpperCase() }"
                  counter
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
                <!-- select tipo persona -->
                <q-select
                  filled
                  v-model="personal.tipo_persona"
                  :options="optionsPerson"
                  hint="Tipo persona"
                  :rules="[val => !!val || 'Tipo persona es obligatorio']"
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
                  v-model="usuario.ID_Usuario"
                  hint="Usuario"
                  :rules="[(val) => !!val || 'Usuario es obligatorio']"
                  type="text"
                  maxlength="36"
                  @input= "val => { usuario.ID_Usuario = val.toUpperCase() }"
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
                  :rules="[(val) => !!val || 'Contraseña es obligatorio']"
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
                  :rules="[(val) => !!val || 'Contraseña es obligatorio']"
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
                  v-model="usuario.Estado"
                  :options="estadooptions"
                  hint="Estado"
                  :rules="[val => !!val || 'Estado es obligatorio']"
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
            <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm" v-if="selected_rol">
              <div class="text-body1 text-uppercase">
                Modulos (Permisos básicos)
              </div>
              <q-scroll-area style="height: 67vh">
                <div class="col-xs-12 col-sm-6">
                  <div v-for="(modulo, index) in array_modules" :key="index">
                    <div v-if="modulo.items.length > 0">
                      <b v-if="modulo.items.length > 0"><label>{{ modulo.label }}</label></b>
                      <div v-for="(items, sbindex) in modulo.items" :key="sbindex">
                        <q-list class="full-width" v-if="items.Estado == 1">
                          <q-item
                            v-if="items.selected"
                            clickable
                            v-ripple
                          >
                            <q-item-section >
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
                              <!-- <q-item-label caption class="q-px-xl">
                                Acciones para el usuario
                              </q-item-label>
                              <q-item-label caption class="q-px-xl">
                                <q-checkbox
                                  v-model="items.Actualizar"
                                  color="secondary"
                                  label="Actualizar"
                                  val="1"
                                  v-if="items.selected"
                                  disable
                                />
                                <q-checkbox
                                  v-model="items.Crear"
                                  color="secondary"
                                  label="Crear"
                                  val="1"
                                  v-if="items.selected"
                                  disable
                                />
                                <q-checkbox
                                  v-model="items.Leer"
                                  color="secondary"
                                  label="Leer"
                                  val="1"
                                  v-if="items.selected"
                                  disable
                                />
                              </q-item-label> -->
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="row q-pt-md">
                </div> -->
              </q-scroll-area>
            </div>
            <!--Modulos para permisos adicionales-->
            <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm" v-if="selected_rol">
              <div class="text-body1 text-uppercase">
                Modulos (Permisos adicionales)
              </div>
              <q-scroll-area style="height: 67vh">
                <div v-for="(modulo, index) in array_modules" :key="index">
                  <div v-if="modulo.items.length > 0" class="row">
                    <b><label>{{ modulo.label }}</label></b>
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
            <q-btn type="submit" color="primary" :label="step === 2 ? 'Guardar' : 'Continuar'" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Volver" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import CryptoJS from 'crypto-js';

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
      items: [],
      array_modules: [],
      optionsRoles: roles,
      selected_rol: null,
      file: null, //Almacenamiento de datos Array de imagen
      array_bodegas: [],
      personal: {
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
      },
      usuario: {
        ID_Usuario: null, //usuario tipo string
        ID_Usuario_Person: null, // Cedula usuario
        cc_creador: null, //Usuario control, solo cuando se crea, no se puede editar
        ID_Rol: null,
        Estado: null,
        Password: null,
        Foto: null,
        ID_Usuario_Control: null,
        base: null
      },
      estadooptions: [
        {
          label: "Activo",
          value: 1,
        },
        {
          label: "Inactivo",
          value: 0,
        },
      ],
      // estate_update_user: null,
      // estado_update_options: ['SI', 'NO'],
      dialog_avatar: false,
      urlApi: "https://apis.qinspecting.com/newapp/", //Variable temporal
      avatar: "",
      user_edit: null, //Almacena los datos del usuario a editar
      edit_form: false, //Permite validar que funciones ejecutar dependiendo si se va a crear o editar
      optionsPerson: [
        {
          label: 'NATURAL',
          value: 1
        },
        {
          label: 'JURIDICA',
          value: 2
        },
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
        this.usuario.ID_Rol = newValue;
        this.CheckPermissions(newValue);
      }
    },
    file(newValue){
      if(newValue){
        let extension_foto = newValue.type.split('/');
        // Creamos un nombre con la fecha y hora del momento que se selecciona el archivo, a esa fecha le reemplazamos los . por ' ', los : y los - por _ y al resultado concatenamos un . y la extensión del archivo 
        let name_file_foto= this.replaceAll(this.replaceAll(this.replaceAll(new Date().toISOString().toLowerCase(), ".", ""), ":", "_"), "-", "_")+"."+extension_foto[1];
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
      'InsertUpdatePersonal',
      "saveFile",
      "getPermissionUser",
      "getPermissionUserEdit",
      "insertUpdatePersmiso",
      "GetDataUser"
    ]),
    ...mapActions("master", [
      "getRol",
      "GetDocumentTypes"
    ]),
    ...mapMutations("auth", ["setUser", "setUserPermissions"]),
    ...mapActions("shopping", ["getTpDoc"]),
    ...mapActions("auth", ["PostLogin"]),
    // Obtiene datos del servidor, son los que se usan en el frontend, tanto para selects, inputs, cehckbox
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const resgetRol = await this.getRol(this.base).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get roles",
          //   data: resgetRol,
          // });
          roles.length = 0;
          resgetRol.data.forEach((rol) => {
            if(rol.Rol_Id >= this.data_user.Rol_Id){
              roles.push({
                label: rol.Rol_Descripcion,
                value: rol.Rol_Id
              });
            }
          });

          const res_docu = await this.getTpDoc().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get tipo documento',
          //   data: res_docu
          // });
          if(res_docu.ok){
            if(res_docu.result){
              this.options_tipo_documento.length = 0;
              res_docu.data.forEach( t_docu => {
                this.options_tipo_documento.push({
                  label: t_docu.Td_Descripcion,
                  value: t_docu.Td_Id
                })
              });
            } else {
              this.$q.notify({
                message: 'Ops! sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_docu.message);
          }

          // Si estamos editando el usuario, entonces asignamos los datos del usuario a editar cada uno de los inputs y selects
          if(this.editForm){
            setTimeout(()=> {
              this.isPwd = true;
              this.assingEditData();
            }, 500)
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    // Obtiene los permisos del rol seleccionado
    CheckPermissions(id_rol) {
      this.$q.loading.show({
        message: "Obteniendo permisos, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const res_modulos = await this.GetModules().then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get modulos",
          //   data: res_modulos,
          // });
          if(res_modulos.ok){
            this.array_modules.length = 0;
            res_modulos.data.forEach((modulebase) => {
              this.array_modules.push({
                Descripcion: modulebase.Descripcion,
                Id_modulo: modulebase.Id_modulo,
                label: modulebase.label.replace(/\b\w/g, (l) => l.toUpperCase()),
                items: [],
              });
            });
          } else {
            throw new Error(res_modulos.message)
          }
          
          const res_permi = await this.getCheckPermissions(id_rol).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta permisos básicos y adicionales",
          //   data: res_permi,
          // });
          if(res_permi.ok){
            this.array_modules.forEach((modulo) => {
              res_permi.data.forEach((permiso) => {
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
                    Leer: permiso.Leer === 1 ? true : false,
                  });
                }
              });
            });
          } else {
            throw new Error(res_permi.message);
          }
          // Si se esta editando, se busca cuales permisos tiene el usuario y se selecciona
          if(this.edit_form){
            let data = {
              base: process.env.__BASE__, 
              Id_usuario: this.user_edit.documento //Numero documento
            };
            const resgetPermissionUserEdit = await this.getPermissionUserEdit(data).then( res => {
              return res.data;
            });
            // console.log({
            //   msg: 'Respuesta get permisos asignados del usuario a editar',
            //   data: resgetPermissionUserEdit
            // });
            this.array_modules.forEach((modulo) => {
              modulo.items.forEach( permiso_basico => {
                let permiso_selecte = resgetPermissionUserEdit.data.find( permiso_user => permiso_user.id == permiso_basico.Id_item );
                if(permiso_selecte){
                  permiso_basico.Estado = permiso_selecte.Estado;
                  permiso_basico.Id_modulo = permiso_selecte.Id_modulo;
                  permiso_basico.Id_rol = permiso_selecte.Id_rol;
                  permiso_basico.Descripcion = permiso_selecte.Descripcion;
                  permiso_basico.modulo = permiso_selecte.modulo;
                  permiso_basico.selected = permiso_selecte.Estado == 1 ? true : false;
                  permiso_basico.basico = permiso_selecte.Estado == 1 ? true : false;;
                  permiso_basico.Actualizar = permiso_selecte.Actualizar == 1 ? true : false;
                  permiso_basico.Borrar = permiso_selecte.Borrar == 1 ? true : false;
                  permiso_basico.Crear = permiso_selecte.Crear == 1 ? true : false;
                  permiso_basico.Leer = permiso_selecte.Leer == 1 ? true : false;
                }
              })
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
      /*Fin funcion api roles*/
    },
    // Valida el formulario antes de enviar a la BD
    async createUser() {
      if(this.step == 2 ){
        // Validamos coincidencia de contraseñas
        if(this.confirmPassword !== this.Password){
          this.$q.notify({
            message: 'Las contraseñas no son iguales',
            type: 'warning'
          })
        } else { 
          if(this.usuario.Foto) {
            if(this.file){
              // Se sube la foto al servidor
              const formData = new FormData();
              formData.append( "files", this.file, this.file.newname );
              const ressaveFile = await this.saveFile(formData).then(async res => {
                return res.data;
              });
              console.log({
                msg: 'Respuesta subida foto de perfil',
                data: ressaveFile
              })
  
              this.usuario.Foto = `${process.env.__URLAPI__}/adjuntos/${this.file.newname}`;
              /*Se inicia guardado de datos en tabla usuario*/
              this.sendDataUser();
              return;
            } else {
              this.sendDataUser();
              return;
            }
          } else {
            this.$q.notify({
              message: 'Debe seleccionar un avatar o una foto de perfil',
              type: 'warning'
            })
          }
        }
      } else {
        this.$refs.stepper.next();
      }
    },
    // Asigna los datos a editar a cada input y select
    assingEditData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del usuario, por favor espere...'
      });
      setTimeout(async() => {
        try {
          const res_data = await this.GetDataUser(this.propDataUser.documento_sf).then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get data user edit',
          //   data: res_data
          // })
          if(res_data.ok){
            this.user_edit = res_data.data;
            this.edit_form = this.editForm;
            this.url = this.user_edit.Foto;

            this.Password = this.decryptedAES(this.user_edit.Password);
            this.confirmPassword = this.decryptedAES(this.user_edit.Password);
            this.usuario = {
              ID_Usuario: this.user_edit.ID_Usuario, //usuario tipo string
              ID_Usuario_Person: this.user_edit.documento, // Cedula usuario
              cc_creador: this.user_edit.cc_creador, //Usuario control, solo cuando se crea, no se puede editar
              ID_Rol: this.user_edit.ID_Rol1,
              Estado: this.user_edit.Estado,
              Password: this.Password,
              Foto: this.user_edit.Foto,
              ID_Usuario_Control: this.user_edit.ID_Usuario_Control,
              base: process.env.__BASE__
            }
            this.personal = {
              documento: this.user_edit.documento,
              Id_tipo_documento: this.user_edit.Id_tipo_documento, //Pendiente
              nombres: this.user_edit.nombres,
              apellidos: this.user_edit.apellidos,
              fecha_nacimiento: this.user_edit.fecha_nacimiento,
              tipo_persona: this.user_edit.tipo_persona,
              usuario_control: this.user_edit.usuario_control,
              email: this.user_edit.email,
              direccion: this.user_edit.direccion,
              telefonos: this.user_edit.telefonos,
              base: process.env.__BASE__
            };
            this.selected_rol = this.user_edit.ID_Rol1;
          } else {
            throw new Error(res_data.message)
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000)
    },
    // Deselecciona todos los permisos
    disableItem(mindex, sbindex){
      this.array_modules.forEach( (modulo, index) => {
        if(mindex === index){
          modulo.items.forEach( (item, iindex) => {
            if(sbindex === iindex){
              item.Actualizar = false;
              item.Crear = false;
            }
          })
        }
      })
    },
    // Envia los datosd el usuario al servidor BD
    sendDataUser(){
      // Empezamos a registrar el usuario
      this.confirmPassword = this.encryptedAES(this.confirmPassword);
      this.usuario.Password = this.encryptedAES(this.Password);
      this.$q.loading.show({
        message: "Guardando usuario, por favor espere...",
      });
      setTimeout(async () => {
        try {
          this.usuario.cc_creador = this.dataUser.ID_Usuario_Person;
          this.usuario.ID_Usuario_Control = this.dataUser.ID_Usuario_Person;
          this.usuario.base = process.env.__BASE__;

          this.personal.base = process.env.__BASE__;
          this.personal.usuario_control = this.dataUser.ID_Usuario_Person;
          this.personal.documento = this.usuario.ID_Usuario_Person;
          
          const res_per = await this.InsertUpdatePersonal(this.personal).then( res => {
            return res.data;
          })
          // console.log({
          //   msg: 'Respuesta insert persona',
          //   data: res_per
          // })
          if(!res_per.ok){
            throw new Error (res_per.message);
          }

          const res_create = await this.InsertUpdateUsuario(this.usuario).then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta insert user',
          //   data: res_create
          // })
          if(!res_create.ok){
            throw new Error (res_create.message);
          }
          
          // Inserta los permisos
          let promesas_insert = [];
          this.array_modules.forEach( modulo => {
            modulo.items.forEach( item => {
              if(item.selected){
                let PermitAditional = {
                  Id_usuario: this.personal.documento,
                  Estado: 1,
                  Id_item: item.Id_item,
                  Usuario_control: this.dataUser.ID_Usuario_Person,
                  Crear: 1,
                  Leer: 1,
                  Actualizar: 1,
                  Borrar: 1,
                  base: process.env.__BASE__
                };
                let pro_per = this.insertUpdatePersmiso(PermitAditional).then( res => {
                  return res.data;
                })
                promesas_insert.push(pro_per);
              } else if (this.edit_form && !item.selected){ //Estamos desasociando el permiso
                let PermitAditional = {
                  Id_usuario: this.usuario.ID_Usuario_Person,
                  Estado: 0,
                  Id_item: item.Id_item,
                  Usuario_control: this.dataUser.ID_Usuario_Person,
                  Crear: 0,
                  Leer: 0,
                  Actualizar: 0,
                  Borrar: 0,
                  base: process.env.__BASE__
                };
                let pro_per = this.insertUpdatePersmiso(PermitAditional).then( res => {
                  return res.data;
                })
                promesas_insert.push(pro_per);
              }
            })
          });
          // Ejecuta las peticiones insert de los permisos
          Promise.all(promesas_insert).then( res => {
            res.forEach( data => {
              console.log({
                msg: 'Respuesta insert permisos',
                data: data
              });
              if(!data.ok){
                throw new Error(data.message)
              }
            })
          });
          if(this.edit_form && this.dataUser.ID_Usuario_Person == this.usuario.ID_Usuario_Person){
            let user_logged = {
              user: this.dataUser.ID_Usuario,
              password: this.usuario.Password,
              base: process.env.__BASE__,
            }
            const resPostLogin = await this.PostLogin(user_logged).then( res => {
              return res.data;
            })
            // console.log({
            //   msg: 'mensaje login',
            //   data: resPostLogin
            // })
            this.setUser({}); //Vaciamos el estado antes de asginar los nuevos valores
            this.setUser(resPostLogin.data);

            let data = {
              base: process.env.__BASE__, 
              Id_usuario: this.user_edit.documento //Numero documento
            };
            const resgetPermissionUser = await this.getPermissionUserEdit(data).then( res => {
              return res.data;
            });
            // console.log({
            //   msg: 'Respuesta get permisos asignados del usuario',
            //   data: resgetPermissionUser
            // });
            let state_permissions = [];
            this.setUserPermissions([]);
            // Permisos para el estado
            this.array_modules.forEach( modulo => {
              resgetPermissionUser.data.forEach( permiso_basico => {
                if (modulo.Id_modulo == permiso_basico.Id_modulo && permiso_basico.Estado == 1) {
                  state_permissions.push({
                    modulo: modulo.label.replace(/\b\w/g, (l) => l.toUpperCase()),
                    Id_modulo: permiso_basico.Id_modulo,
                    Actualizar: true,
                    Borrar: true,
                    Crear: true,
                    Leer: true,
                    route: `/${permiso_basico.router}`,
                  })
                }
              });
            })
            this.setUserPermissions(state_permissions);
            location.reload();
          }

          this.$q.notify({
            message: 'Guardado',
            type: 'positive'
          })
          // Limpiamos el formulario
          this.$emit('reload')
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
      }, 2000);
    },
    cleanForm(){
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
      this.usuario.Foto = this.url;
    },
    // Asigna la imgen cargada y deshabilita el dialogo de avatars
    selectedAvatar(img) {
      this.avatar = img;
      this.url = img;
      this.dialog_avatar = false;
      this.usuario.Foto = this.url;
    },
    // Encripta contraseñas o strings
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(process.env.__KEY__), {
        iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
        mode: CryptoJS.mode.CBC
      }).toString()
      return cipher.toString()
    },
    aesDencrypt(txt) {
      const cipher = this.CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(process.env.__KEY__), {
        iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
        mode: CryptoJS.mode.CBC
      })
      return CryptoJS.enc.Utf8.stringify(cipher).toString()
    },
    // Reemplaza elementos de un string
    replaceAll( text, busca, reemplaza ){
      while (text.toString().indexOf(busca) != -1)
          text = text.toString().replace(busca,reemplaza);
      return text;
    }
  },
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
