<template>
  <div>
    <q-form @submit="createUser" class="q-gutter-md" id="form">
      <div class="row">
        <!-- Foto de perfil -->
        <div class="col-xs-12 col-md-2 q-pa-sm q-gutter-y-md">
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
            </q-card> </q-dialog
          ><!-- Finaliza el dialog del avatar -->
          <!-- inputs -->
          <q-input
            filled
            v-model="userNew.Primer_Nombre"
            hint="Primer nombre"
            :rules="[(val) => !!val || 'Primer es obligatorio']"
            maxlength="36"
            @input= "val => { userNew.Primer_Nombre = val.toUpperCase() }"
            counter
          />
          <q-input
            filled
            v-model="userNew.Segundo_Nombre"
            hint="Segundo nombre"
            maxlength="36"
            @input= "val => { userNew.Segundo_Nombre = val.toUpperCase() }"
            counter
          />
          <q-input
            filled
            v-model="userNew.Primer_Apellido"
            hint="Primer apellido"
            :rules="[(val) => !!val || 'Primer es obligatorio']"
            maxlength="36"
            @input= "val => { userNew.Primer_Apellido = val.toUpperCase() }"
            counter
          />
          <q-input
            filled
            v-model="userNew.Segundo_Apellido"
            hint="Segundo apellido"
            maxlength="36"
            @input= "val => { userNew.Segundo_Apellido = val.toUpperCase() }"
            counter
          />
          <q-input
            filled
            v-model="userNew.ID_Usuario"
            hint="Usuario"
            :rules="[(val) => !!val || 'Usuario es obligatorio']"
            type="number"
            maxlength="12"
            @input= "val => { userNew.ID_Usuario = val.toUpperCase() }"
            counter
          />
          <q-input
            filled
            v-model="Password"
            :type="isPwd ? 'password' : 'text'"
            hint="Contraseña"
            :rules="[val => !!val || 'Contraseña es obligatorio']"
            maxlength="12"
            v-if="!editForm || user_edit.usuario == dataUser.ID_Usuario"
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
          <q-input
            filled
            v-model="confirmPassword"
            type="password"
            hint="Confirmar Contraseña"
            :rules="[val => !!val || 'Contraseña es obligatorio']"
            maxlength="12"
            v-if="!editForm || user_edit.usuario == dataUser.ID_Usuario"
          />
          <!-- selects -->
          <q-select
            filled
            v-model="estate_user"
            :options="estadooptions"
            hint="Estado"
            :rules="[validateSelect]"
          />
          <!-- selects -->
          <q-select
            filled
            v-model="estate_update_user"
            :options="estado_update_options"
            hint="Encuesta sociodemográfica"
            :rules="[validateSelect]"
          />
          <q-select
            filled
            v-model="selectedRol"
            :options="optionsRoles"
            hint="Rol"
            @filter="filterRoles"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :rules="[validateSelect]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- checkbox -->
        <div class="col-xs-12 col-md-10">
          <q-scroll-area style="height: 95vh">
            <div class="row q-pt-md q-px-sm">
              <!-- Bodegas -->
              <div class="col-xs-12 col-sm-6 col-md-2">
                <div class="text-body1 text-uppercase">Bodegas</div>
                <div v-for="(bodega, index) in array_bodegas" :key="index">
                  <q-checkbox
                    v-model="bodega.selected"
                    color="secondary"
                    :label="bodega.Bodega"
                  />
                </div>
              </div>
              <!--Modulos para permisos Básicos-->
              <div class="col-xs-12 col-sm-6 col-md-5" v-if="selectedRol">
                <div class="text-body1 text-uppercase">
                  Modulos (Permisos básicos)
                </div>
                <div v-for="(modulo, index) in array_modules" :key="index">
                  <b v-if="modulo.items.length > 0"><label>{{ modulo.label }}</label></b>
                  <div v-if="modulo.items.length > 0" class="row">
                    <q-list class="full-width" v-for="(items, sbindex) in modulo.items" :key="sbindex">
                      <q-item
                        v-if="items.selected"
                        clickable
                        v-ripple
                      >
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
              <!--Modulos para permisos adicionales-->
              <div class="col-xs-12 col-sm-6 col-md-5" v-if="selectedRol">
                <div class="text-body1 text-uppercase">
                  Modulos (Permisos adicionales)
                </div>
                <div v-for="(modulo, index) in array_modules" :key="index">
                  <b v-if="modulo.items.length > 0"
                    ><label>{{ modulo.label }}</label></b
                  >
                  <div v-if="modulo.items.length > 0" class="row">
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
              </div>
            </div>
          </q-scroll-area>
        </div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn label="Guardar" type="submit" color="green" />
      </q-page-sticky>
    </q-form>
  </div>
</template>
<script>
const users = [];
const roles = [];
import { mapActions, mapState, mapMutations } from "vuex";
import CryptoJS from 'crypto-js';
export default {
  name: "ComponentuserForm",
  data() {
    return {
      isPwd: false, //Cambia el tipo de input del password
      regex : /^(?=(?=.*\d){2})(?=(?:.*[A-Z]){1})(?=(?=.*[a-z]){0})\S{6,}$/,
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
      selectedRol: null,
      roles: [],
      file: null, //Almacenamiento de datos Array de imagen
      array_bodegas: [],
      estate_user: null,
      userNew: {
        ID_Usuario: null,
        ID_Rol: null,
        Estado: null,
        Password: null,
        Primer_Apellido: null,
        Segundo_Apellido: '',
        Primer_Nombre: null,
        Segundo_Nombre: '',
        Estado_Actualizacion: 0,
        Foto: null,
        Usuario_control: null,
        Fecha_Hora: null,
      },
      estadooptions: [
        {
          label: "Activo",
          value: "1",
        },
        {
          label: "Inactivo",
          value: "0",
        },
      ],
      estate_update_user: null,
      estado_update_options: ['SI', 'NO'],
      dialog_avatar: false,
      urlApi: "https://apis.qinspecting.com/newapp/", //Variable temporal
      avatar: "",
      user_edit: {
        usuario: null
      }, //Almacena los datos del usuario a editar
      edit_form: false, //Permite validar que funciones ejecutar dependiendo si se va a crear o editar
    };
  },
  props: ["editForm", "propDataUser"],
  created() {
    this.getData();
  },
  computed: {
    ...mapState("auth", ["user"]),
    dataUser() {
      return this.user;
    },
  },
  watch: {
    estate_user(newValue){
      if(newValue){
        this.userNew.Estado = newValue.value;
      }
    },
    selectedRol(newValue) {
      if (newValue) {
        let result_rol = this.roles.find((rol) => rol.Rol === newValue);
        if (result_rol) {
          this.userNew.ID_Rol = result_rol.Id;
          this.CheckPermissions(result_rol);
        }
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
    // ...mapActions("access", [
    //   "GetModules",
    //   "GetItemsModules",
    //   "getCheckPermissions",
    //   "GetModulesHasItem",
    //   "PostCreateUser",
    //   "PostCreateUserBodega",
    //   "saveFile",
    //   "PostInsertUpdateAditionalPermits",
    //   "getPermissionUser",
    //   "getPermissionUserEdit"
    // ]),
    // ...mapActions("master", ["getRol", "getMovilUser", "getBodegas"]),
    // ...mapMutations("auth", ["setUser", "setUserPermissions"]),
    // ...mapActions("auth", ["PostLogin"]),
    // ...mapActions("inventory", ["requestGetCellarUser"]),
    // Obtiene datos del servidor, son los que se usan en el frontend, tanto para selects, inputs, cehckbox
    getData() {
      this.$q.loading.show({
        message: "Obteniendo usuarios existentes, por favor espere...",
      });
      setTimeout(async () => {
        try {

          // const resgetRol = await this.getRol().then((res) => {
          //   return res.data;
          // });
          // console.log({
          //   msg: "Respuesta get roles",
          //   data: resgetRol,
          // });

          // roles.length = 0;
          // this.roles.length = 0;
          // resgetRol.forEach((rolbase) => {
          //   roles.push(rolbase.Rol);
          //   this.roles.push(rolbase);
          // });

          // const resgetBodegas = await this.getBodegas().then((res) => {
          //   return res.data;
          // });
          // console.log({
          //   msg: "Respuesta get bodegas",
          //   data: resgetBodegas,
          // });

          // this.array_bodegas.length = 0;
          // resgetBodegas.forEach((rolbase) => {
          //   this.array_bodegas.push({
          //     Bodega: rolbase.Bodega,
          //     Estado: rolbase.Estado,
          //     ID_Ciudad1: rolbase.ID_Ciudad1,
          //     ID_Regional1: rolbase.ID_Regional1,
          //     Id: rolbase.Id,
          //     Regional: rolbase.Regional,
          //     cedula_control: rolbase.cedula_control,
          //     fecha_control: rolbase.fecha_control,
          //     id_campo: rolbase.id_campo,
          //     nombre_control: rolbase.nombre_control,
          //     tabla: rolbase.tabla,
          //     selected: false,
          //   });
          // });

          // // Si estamos editando el usuario, entonces asignamos los datos del usuario a editar cada uno de los inputs y selects
          // if(this.editForm){
          //   this.isPwd = true;
          //   this.assingEditData();
          // }
        } catch (e) {
          console.log(e);
          if (e.message === "Network Error") {
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
    // Valida el formulario antes de enviar a la BD
    async createUser() {
      var date = new Date();
      var dateToDay = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      var hourNow = date.toTimeString().split(":");
      var seconds = hourNow[2].split(" ");
      var hour = hourNow[0] + ":" + hourNow[1] + ":" + seconds[0];
      var fullDate = dateToDay + " " + hour; //Concatenamos la hora y fecha, para luego asignarla a la variable que se enviara en el post
      // Escripta contraseñas
      // Validamos coincidencia de contraseñas
      if(this.confirmPassword !== this.Password){
        this.$q.notify({
          message: 'Las contraseñas no son iguales',
          type: 'warning'
        })
      } else {
        // Validamos si hay bodega seleccioanda
        let resul_bodega = this.array_bodegas.find(e => e.selected === true);
        if(!resul_bodega){
          this.$q.notify({
            message: 'Debe seleccionar una bodega',
            type: 'warning'
          });
        } else if(this.userNew.Foto) {
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

            this.userNew.Foto = `${process.env.__URLAPI__}/adjuntos/${this.file.newname}`;
            /*Se inicia guardado de datos en tabla usuario*/
            this.sendDataUser(fullDate);
            return;
          } else {
            this.sendDataUser(fullDate);
            return;
          }
        } else {
          this.$q.notify({
            message: 'Debe seleccionar un avatar o una foto de perfil',
            type: 'warning'
          })
        }
      }
    },
    // Asigna los datos a editar a cada input y select
    assingEditData(){
      this.user_edit = this.propDataUser;
      this.edit_form = this.editForm;
      this.estate_user = {
        label: this.user_edit.Estado === 'Activo' ? 'Activo' : 'Inactivo',
        value: this.user_edit.Estado === 'Activo' ? 1 : 0,
      }
      let result_rol = this.roles.find((rol) => rol.Id === this.user_edit.Id_Rol1);
      this.selectedRol = result_rol.Rol;
      this.url = this.user_edit.Foto;
      this.Password = this.decryptedAES(this.user_edit.Password);
      this.userNew = {
        ID_Usuario: this.user_edit.usuario,
        ID_Rol1: this.user_edit.Id_Rol1,
        Estado: this.user_edit.Estado === 'Activo' ? 1 : 0,
        Password: this.decryptedAES(this.user_edit.Password),
        Foto: this.user_edit.Foto,
        ID_Usuario14: this.user_edit.nombre_control,
        Fecha_Hora: this.user_edit.fechaprueba,
        Primer_Apellido: this.user_edit.Primer_Apellido,
        Segundo_Apellido: this.user_edit.Segundo_Apellido,
        Primer_Nombre: this.user_edit.Primer_Nombre,
        Segundo_Nombre: this.user_edit.Segundo_Nombre,
        Estado_Actualizacion: this.user_edit.Estado_Actualizacion,
      }
      this.estate_update_user = this.user_edit.Estado_Actualizacion === 1 ? 'SI' : 'NO';
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
    sendDataUser(fullDate){
      // Empezamos a registrar el usuario
      this.confirmPassword = this.encryptedAES(this.confirmPassword);
      this.userNew.Password = this.encryptedAES(this.Password);
      this.userNew.Fecha_Hora = fullDate;
      if(this.edit_form){
        this.userNew.Estado_Actualizacion = this.estate_update_user === 'SI' ? 1 : 0;
      }
      this.$q.loading.show({
        message: "Guardando usuario, por favor espere...",
      });
      setTimeout(async () => {
        try {
          this.userNew.Usuario_control = this.dataUser.ID_Usuario; //Usuario que esta creando el usuario
          const resPostCreateUser = await this.PostCreateUser(this.userNew).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta insert user',
            data: resPostCreateUser
          })
          if(!resPostCreateUser.affectedRows){
            throw 'Error al crear el usuario';
          }
          // Inserta las bodegas del usuario,
          let promesa_insert_bodega = []; //Almacena todas la promesas de los insert permisos
          let promesas_insert = []; //Almacena todas la promesas de los insert permisos
          this.array_bodegas.forEach(async bodega => {
            if (bodega.selected) {
              let bodega_user = {
                ID_Usuario19: this.userNew.ID_Usuario,
                ID_Bodega1: bodega.Id,
                Estado: 1,
                ID_Usuario20: this.dataUser.ID_Usuario,
              };
              promesa_insert_bodega.push(this.PostCreateUserBodega(bodega_user));
            } 
            else if (this.edit_form && !bodega.selected){ //Estamos desasociando la bodega
              let bodega_user = {
                ID_Usuario19: this.userNew.ID_Usuario,
                ID_Bodega1: bodega.Id,
                Estado: 0,
                ID_Usuario20: this.dataUser.ID_Usuario,
              };
              promesa_insert_bodega.push(this.PostCreateUserBodega(bodega_user));
            }
          });
          
          // Inserta los permisos
          this.array_modules.forEach( modulo => {
            modulo.items.forEach( item => {
              if(item.selected){
                let PermitAditional = {
                  Id_usuario: this.userNew.ID_Usuario,
                  Id_has_frontend2: item.Id_has_frontend,
                  Estado: 1,
                  Usuario_control: this.dataUser.ID_Usuario,
                  Fecha_control: fullDate,
                  Crear: item.Crear ? 1 : 0,
                  Leer: item.Leer ? 1 : 0,
                  Actualizar: item.Actualizar ? 1 : 0,
                  Borrar: item.Borrar ? 1 : 0,
                };
                promesas_insert.push(this.PostInsertUpdateAditionalPermits(PermitAditional));
              } else if (this.edit_form && !item.selected && item.Id_has_frontend){ //Estamos desasociando el permiso
                let PermitAditional = {
                  Id_usuario: this.userNew.ID_Usuario,
                  Id_has_frontend2: item.Id_has_frontend,
                  Estado: 0,
                  Usuario_control: this.dataUser.ID_Usuario,
                  Fecha_control: fullDate,
                  Crear: 0,
                  Leer: 1,
                  Actualizar: 0,
                  Borrar: 0,
                };
                promesas_insert.push(this.PostInsertUpdateAditionalPermits(PermitAditional));
              }
            })
          });
          // Ejecuta las peticiones insert de las bodegas
          Promise.all(promesa_insert_bodega).then( res => {
            res.forEach( data => {
              console.log({
                msg: 'Respuesta insert bodegas',
                data: data.data
              });
            })
          })
          // Ejecuta las peticiones insert de los permisos
          Promise.all(promesas_insert).then( res => {
            res.forEach( data => {
              console.log({
                msg: 'Respuesta insert permisos',
                data: data.data
              });
            })
          });
          if(this.edit_form && this.dataUser.ID_Usuario === this.userNew.ID_Usuario){
            let user_logged = {
              user: this.dataUser.ID_Usuario,
              password: this.userNew.Password
            }
            const resPostLogin = await this.PostLogin(user_logged).then( res => {
              return res.data;
            })
            this.setUser({}); //Vaciamos el estado antes de asginar los nuevos valores
            this.setUser(resPostLogin.user);

            const resgetPermissionUser = await this.getPermissionUser(this.userNew.ID_Usuario).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Respuesta get permisos asignados del usuario a editar',
              data: resgetPermissionUser
            });
            let state_permissions = [];
            this.setUserPermissions([]);
            // Permisos para el estado
            this.array_modules.forEach( modulo => {
              resgetPermissionUser.forEach( permiso_basico => {
                if (modulo.Id_modulo === permiso_basico.Id_modulo) {
                  state_permissions.push({
                    modulo: modulo.label.replace(/\b\w/g, (l) => l.toUpperCase()),
                    Id_modulo: permiso_basico.Id_modulo,
                    Actualizar: permiso_basico.Actualizar === 1 ? true : false,
                    Borrar: permiso_basico.Borrar === 1 ? true : false,
                    Crear: permiso_basico.Crear === 1 ? true : false,
                    Leer: permiso_basico.Leer === 1 ? true : false,
                    route: `/${permiso_basico.route}`,
                  })
                }
              });
            })
            this.setUserPermissions(state_permissions);
            location.reload();
          }

          this.$q.notify({
            message: `${this.edit_form ? 'Cambios guardados' : 'Usuario guardado'}`,
            type: 'positive'
          })
          // Limpiamos el formulario
          this.$emit('reload')
        } catch (e) {
          console.log(e);
          if (e.message === "Network Error") {
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
      this.userNew = {
        ID_Usuario: null,
        ID_Rol1: null,
        Estado: null,
        Password: null,
        Foto: null,
        ID_Usuario14: null,
        Fecha_Hora: null,
      };
      this.cellar_bodega = {
        ID_Usuario19: null,
        ID_Bodega1: null,
        Estado: null,
        ID_Usuario20: null,
        Fecha_Hora: null,
      };
      this.cellar_adicionales = {
        Id_usuario: null,
        Id_has_frontend2: null,
        Estado: null,
        Usuario_control: null,
        Fecha_control: null,
      };
      this.selectedCity = null;
      this.selectedProduct = null;
      this.selectedworkgroup = null;
      this.confirmPassword = null;
    },
    // Obtiene los permisos del rol seleccionado
    CheckPermissions(rol_selected) {
      this.$q.loading.show({
        message: "Obteniendo permisos básicos, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const resGetModules = await this.GetModules().then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get modulos",
            data: resGetModules,
          });
          this.array_modules.length = 0;
          resGetModules.forEach((modulebase) => {
            this.array_modules.push({
              Descripcion: modulebase.Descripcion,
              Id_modulo: modulebase.Id_modulo,
              label: modulebase.label.replace(/\b\w/g, (l) => l.toUpperCase()),
              items: [],
            });
          });
          
          const resgetCheckPermissions = await this.getCheckPermissions(
            rol_selected
          ).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta permisos, basicos y adicionales",
            data: resgetCheckPermissions,
          });
          this.array_modules.forEach((modulo) => {
            resgetCheckPermissions.forEach((permiso) => {
              if (modulo.Id_modulo === permiso.Id_modulo) {
                modulo.items.push({
                  Estado: permiso.Estado,
                  Id_has_frontend: permiso.Id_has_frontend,
                  Id_has_frontend1: permiso.Id_has_frontend1,
                  Id_modulo: permiso.Id_modulo,
                  Id_rol1: permiso.Id_rol1,
                  label: permiso.label,
                  Descripcion: permiso.Descripcion,
                  modulo: permiso.modulo,
                  validator: permiso.validator,
                  selected: permiso.Id_rol1 ? true : false,
                  basico: permiso.Id_rol1 ? true : false,
                  Actualizar: permiso.Actualizar === 1 ? true : false,
                  Borrar: permiso.Borrar === 1 ? true : false,
                  Crear: permiso.Crear === 1 ? true : false,
                  Leer: permiso.Leer === 1 ? true : false,
                });
              }
            });
          });
          // Si se esta editando, se busca cuales permisos tiene el usuario y se selecciona
          if(this.edit_form){
            
            const resrequestGetCellarUser = await this.requestGetCellarUser(this.userNew).then(res => {
              return res.data;
            });
            console.log({
              msg: 'Respuesta get bodegas usuario',
              data: resrequestGetCellarUser
            });
            this.array_bodegas.forEach( bodega => {
              let bodega_user = resrequestGetCellarUser.find( b => b.id === bodega.Id);
              if(bodega_user){
                bodega.selected = true;
              }
            });

            const resgetPermissionUserEdit = await this.getPermissionUserEdit(this.userNew.ID_Usuario).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Respuesta get permisos asignados del usuario a editar',
              data: resgetPermissionUserEdit
            });
            this.array_modules.forEach((modulo) => {
              modulo.items.forEach( permiso_basico => {
                let permiso_selecte = resgetPermissionUserEdit.find( permiso_user => permiso_basico.Id_has_frontend === permiso_user.Id_has_frontend );
                if(permiso_selecte){
                  permiso_basico.Estado = permiso_selecte.Estado;
                  permiso_basico.Id_has_frontend = permiso_selecte.Id_has_frontend;
                  permiso_basico.Id_has_frontend1 = permiso_selecte.Id_has_frontend1;
                  permiso_basico.Id_modulo = permiso_selecte.Id_modulo;
                  permiso_basico.Id_rol1 = permiso_selecte.Id_rol1;
                  permiso_basico.label = permiso_selecte.label;
                  permiso_basico.Descripcion = permiso_selecte.Descripcion;
                  permiso_basico.modulo = permiso_selecte.modulo;
                  permiso_basico.validator = permiso_selecte.validator;
                  permiso_basico.selected = true;
                  permiso_basico.basico = true;
                  permiso_basico.Actualizar = permiso_selecte.Actualizar === 1 ? true : false;
                  permiso_basico.Borrar = permiso_selecte.Borrar === 1 ? true : false;
                  permiso_basico.Crear = permiso_selecte.Crear === 1 ? true : false;
                  permiso_basico.Leer = permiso_selecte.Leer === 1 ? true : false;
                }
              })
            });
          }
        } catch (e) {
          console.log(e);
          if (e.message === "Network Error") {
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
    // Buscadores de los selects
    searchUser(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.optionsUsers = users.filter((v) => v > -1);
      });
    },
    filterRoles(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.optionsRoles = roles.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    // Valida los selects
    validateSelect(val) {
      if (!val) {
        return "Campo es obligatorio, seleccione una opción";
      }
    },
    // Asigna una url para mostrar la imagen de perfil
    onFileChange(e) {
      const file = e.target.files[0];
      this.file = file;
      this.url = URL.createObjectURL(file);
      this.dialog_avatar = false;
      this.userNew.Foto = this.url;
    },
    // Asigna la imgen cargada y deshabilita el dialogo de avatars
    selectedAvatar(img) {
      this.avatar = img;
      this.url = img;
      this.dialog_avatar = false;
      this.userNew.Foto = this.url;
    },
    // Encripta contraseñas o strings
    encryptedAES(data) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    },
    // Desencripta las contraseñas o strings
    decryptedAES(encrypted) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
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
