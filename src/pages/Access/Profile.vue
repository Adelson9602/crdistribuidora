<template>
  <q-page padding class="q-mt-md">
    <div class="q-pa-none">
      <q-form>
        <div class="row q-col-gutter-y-md">
          <div class="col-xs-12 q-pa-sm q-gutter-y-md">
            <div class="text-h6">Datos de la cuenta</div>
          </div>
        </div>
        <div class="row q-col-gutter-y-md">
          <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
             <p class="section__p"><b>Foto de perfíl</b></p>
            <div class="row col-xs-12 justify-center profile-img">
              <q-avatar size="200px" square class="q-mb-md">
                <img v-if="url" :src="url" />
              </q-avatar>
              <input type="file" @change="onFileChange" id="idImgUser" />
              <q-btn
                label="Seleccionar imágen"
                flat
                @click="dialogAvatar = true"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
            <p class="section__p"><b>Datos básicos</b></p>
            <q-dialog v-model="dialogAvatar"
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
            <q-input
              class="section__input"
              v-model="dataUsuario.ID_Usuario"
              filled
              type="text"
              label="Usuario"
              disable
              hint="Este será su usuario"
            />
            <q-select
              class="section__input"
              v-model="rol"
              filled
              :options="options_role"
              hint="Rol"
              disable
            />
            <q-input
             class="section__input"
              v-model="dataUsuario.nombres"
              filled
              type="text"
              label="Nombres"
              hint="Nombres"
            />
            <q-input
             class="section__input"
              v-model="dataUsuario.apellidos"
              filled
              type="text"
              label="Apellidos"
              hint="Apellidos"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
            <p class="section__p"><b>Contacto</b></p>
            <q-input
              class="section__input"
              v-model="dataUsuario.telefono1"
              filled
              type="number"
              label="Teléfono principal"
              hint="Teléfono principal"
            />
            <q-input
              class="section__input"
              v-model="dataUsuario.telefono2"
              filled
              type="number"
              label="Teléfono secundario"
              hint="Teléfono secundario (Opcional)"
            />
            <q-input
              class="section__input"
              v-model="dataUsuario.email"
              filled
              type="email"
              label="Email"
              hint="Dirección de correo electrónico"
            />
            <q-input
              class="section__input"
              v-model="dataUsuario.direccion"
              filled
              type="text"
              label="Dirección"
              hint="Dirección"
            />

          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
            <p class="section__p"><b>Contraseña</b></p>
            <q-input
             class="section__input"
              v-model="dataUsuario.Password"
              filled
              :type="isPwd ? 'password' : 'text'"
              label="Contraseña"
              hint="Ingrese la contraseña"
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
             class="section__input"
              v-model="dataUsuario.repeat_pass"
              filled
              :type="isPwd ? 'password' : 'text'"
              label="Confirmar contraseña"
              hint="Confirmar la Contraseña"
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
        </div>
        <div class="row q-col-gutter-y-md">
          <div class="col-xs-12">
            <q-separator></q-separator>
          </div>
          <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md">
          </div>
          <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md">
          </div>
          <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md">
            <q-btn
              v-if="dataUserLogged.ID_Rol1 == 1 ||  dataUserLogged.ID_Rol1 == 2"
              class="full-width"
              label="AGREGAR SALDO"
              type="submit"
              color="primary"
              @click.prevent="addSaldo"
              flat
            />
          </div>
          <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md">
            <q-btn
              class="full-width"
              label="EDITAR"
              type="submit"
              @click.prevent="onSubmit"
              color="primary"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import userDetail from "components/Access/ComponentUserDetail";

import { mapActions, mapMutations, mapState } from "vuex";

// var CryptoJS = require("cryp-to-js").default;
const optionUsuario = [];

export default {
  name: "PageProfile",
  components: {
    userDetail,
  },
  data() {
    return {
      base: process.env.__BASE__,
      dialogEnableAddSaldo: false,
      renderComponent: true,
      dialogAvatar: false,
      isPwd: null,
      options_role: optionUsuario,
      rol: "Seleccione un Rol",
      formUser: false,
      dataUsuario: {
        cc_creador: null,
        Foto: null,
        ID_Usuario: null,
        Password: null,
        repeat_pass: null,
        nombres: null,
        apellidos: null,
        email: null,
        telefonos: "",
        telefono1: "",
        telefono2: "",
        direccion: null,
      },
      files: null,
      url: null,
      urlApi: null,
      phones: null,
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    dataUser() {
      return this.user;
    },
  },
  mounted() {
    this.urlApi = process.env.__URLAPI__;
    // this.editUserData();
    this.getData();
  },
  methods: {
    ...mapActions("access", [
      "GetDataUser",
      "editDataEmploye",
      "editDataUser",
      "saveFile",
      "InsertUpdatePersonal",
      "InsertUpdateUsuario",
    ]),
    ...mapActions("auth", ["PostLogin"]),
    ...mapMutations("auth", ["setUser"]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos de usuario, por favor espere...'
      });
      setTimeout(async () => {
        try{
          this.dataUserLogged = this.dataUser;
          const resGetDataUser = await this.GetDataUser(this.dataUser.ID_Usuario_Person).then( res => {
            return res.data;
          })
          console.log({
            msg: 'Respuesta get datos de usuario',
            data: resGetDataUser.data
          })
          console.log(resGetDataUser.data);
          let dataGetUser = resGetDataUser.data;
          // resGetDataUser.data.forEach(element => {
            let result = dataGetUser.telefonos.split(",");
            this.dataUsuario.telefono1 = result[0];
            if(result.length > 1){
              this.dataUsuario.telefono2 = result[1];
            }
            this.dataUsuario = {
              cc_creador: dataGetUser.cc_creador,
              Foto: dataGetUser.Foto,
              ID_Usuario: dataGetUser.ID_Usuario,
              telefonos: dataGetUser.telefonos,
              telefono1: this.dataUsuario.telefono1,
              telefono2: this.dataUsuario.telefono2,
              nombres: dataGetUser.nombres,
              apellidos: dataGetUser.apellidos,
              email: dataGetUser.email,
              direccion: dataGetUser.direccion,
            };
            this.rol = {
              label: dataGetUser.Rol,
              value: dataGetUser.ID_Rol1
            };
            this.url = dataGetUser.Foto;
          // });
          
          this.renderComponent = true;
        }catch (e) {
          console.log(e);
          if (e.message === "Error de conexión") {
            e = e.message;
          } if (e.message === 'Request failed with status code 404') {
            e = 'URL de solicitud no existe, err 404';
          } else if(e.message) {
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: 'negative'
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
    },
    reload() {
      this.renderComponent = false;
    },
     async onSubmit() {
      if (this.dataUsuario.Password != this.dataUsuario.repeat_pass) {
        this.$q.notify({
          color: "negative",
          icon: "warning",
          message: "Las contraseñas no son iguales",
        });
      } else {
          this.$q.loading.show({
            message: 'Actualizando datos del usuario, por favor espere...'
          })
          setTimeout(async()=>{
            try {
              await this.apiRegister();
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
          }, 500)
      }
     },
    async apiRegister() {

      if(this.dataUsuario.Password){
        this.dataUsuario.Password = this.encryptedAES(this.dataUsuario.Password);
        this.dataUsuario.repeat_pass = this.encryptedAES(this.dataUsuario.Password);
      } else {
        this.dataUsuario.Password = this.dataUser.Password;
        this.dataUsuario.repeat_pass = this.dataUser.Password;
      }
    
      const formData = new FormData();
      if(this.files !== null){
        formData.append('files', this.files, this.files.name.toLowerCase().replace(/ /ig, "_"))
        await this.saveFile(formData).then(res => {
          var nameImage = res.data.url.split('/')
          this.url = `${process.env.__URLAPI__}/adjuntos/`+this.files.name.toLowerCase().replace(/ /ig, "_");
          console.log(this.url);
          if(res.data.saved){
            if(this.dataUsuario.telefono1 && this.dataUsuario.telefono2){
              console.log("Telefono 2 trae -> " + this.dataUsuario.telefono2);
              this.phones = this.dataUsuario.telefono1 + ',' + this.dataUsuario.telefono2;
            }else if(this.dataUsuario.telefono1){
              this.phones =  this.dataUsuario.telefono1 ;
            }else{
              this.phones =  this.dataUsuario.telefono2 ;
            }
            let dataPersonal = {
              base: this.base,
              documento : this.dataUser.ID_Usuario_Person,
              Id_tipo_documento: this.dataUser.Id_tipo_documento,
              nombres : this.dataUsuario.nombres,
              apellidos : this.dataUsuario.apellidos,
              email : this.dataUsuario.email,
              direccion : this.dataUsuario.direccion,
              telefonos : this.phones,
              fecha_nacimiento : date.formatDate(this.dataUser.fecha_nacimiento, 'YYYY-MM-DD'),
              tipo_persona: this.dataUser.tipo_persona,
              usuario_control : this.dataUser.ID_Usuario_Person,
            };
            console.log(dataPersonal);
            this.InsertUpdatePersonal(dataPersonal).then(res => {
              console.log(res.data);
            });
            
            let dataUsuario = {
              base: this.base,
              ID_Usuario: this.dataUsuario.ID_Usuario, 
              ID_Usuario_Person: this.dataUser.ID_Usuario_Person, 
              ID_Rol: this.dataUser.ID_Rol1, 
              Estado: this.dataUser.Estado, 
              cc_creador: this.dataUsuario.cc_creador,
              Password: this.dataUsuario.Password, 
              Foto: this.url, 
              ID_Usuario_Control: this.dataUser.ID_Usuario_Person,
            };
            if(this.dataUsuario.Password == null) {
              dataUsuario.Password = this.dataUser.Password;
            }
            console.log(dataUsuario);
            this.InsertUpdateUsuario(dataUsuario).then(res => {
              console.log(res.data);
            });
            this.$q.notify({
              type: 'positive',
              message: 'Datos actualizados'
            })
          }
        })
        .catch(e => 
          console.log(e)
        );
      } else {
        if(this.dataUsuario.telefono1 && this.dataUsuario.telefono2){
          console.log("Telefono 2 trae -> " + this.dataUsuario.telefono2);
          this.phones = this.dataUsuario.telefono1 + ',' + this.dataUsuario.telefono2;
        }else if(this.dataUsuario.telefono1){
          this.phones =  this.dataUsuario.telefono1 ;
        }else{
          this.phones =  this.dataUsuario.telefono2 ;
        }
        let dataPersonal = {
          base: this.base,
          documento : this.dataUser.ID_Usuario_Person,
          Id_tipo_documento: this.dataUser.Id_tipo_documento,
          nombres : this.dataUsuario.nombres,
          apellidos : this.dataUsuario.apellidos,
          email : this.dataUsuario.email,
          direccion : this.dataUsuario.direccion,
          telefonos : this.phones,
          fecha_nacimiento : date.formatDate(this.dataUser.fecha_nacimiento, 'YYYY-MM-DD'),
          tipo_persona: this.dataUser.tipo_persona,
          usuario_control : this.dataUser.ID_Usuario_Person,
        };
        console.log(dataPersonal);
        const resInsertUpdatePersonal = await this.InsertUpdatePersonal(dataPersonal).then(res => {
          return res.data;
        }).catch(e => {
          throw new Error(e.message);
        });
        console.log({
          msg: "Respuesta insert update personal",
          data: resInsertUpdatePersonal
        });

        // if(!resInsertUpdatePersonal.ok){
        //   throw new Error(resInsertUpdatePersonal.message);
        // }

        let dataUsuario = {
          base: this.base,
          ID_Usuario: this.dataUsuario.ID_Usuario, 
          ID_Usuario_Person: this.dataUser.ID_Usuario_Person, 
          ID_Rol: this.dataUser.ID_Rol1, 
          Estado: this.dataUser.Estado, 
          Password: this.dataUsuario.Password, 
          cc_creador: this.dataUsuario.cc_creador,
          Foto: this.url, 
          ID_Usuario_Control: this.dataUser.ID_Usuario_Person,
        };
        
        console.log(dataUsuario);
        const resInsertUpdateUsuario = await this.InsertUpdateUsuario(dataUsuario).then(res => {
          return res.data;
        }).catch(e => {
          throw new Error(e.message);
        });
        console.log({
          msg: "Respuesta insert update user",
          data: resInsertUpdateUsuario
        });

        this.$q.notify({
          type: 'positive',
          message: 'Datos actualizados'
        })
      }
      let setDataUser = {
        base: this.base,
        user: this.dataUsuario.ID_Usuario,
        password: this.dataUsuario.Password,
      };
      console.log(setDataUser);
      //PostLogin es la acción, está definida en mapActions de la tienda de datos de vuex
      const resPostLogin = await this.PostLogin(setDataUser).then( res => {
        return res.data;
      }).catch(e => {
        throw new Error(e.message);
      })
      this.dataUsuario = {};
      console.log(resPostLogin)
      this.setUser({});
      this.setUser(resPostLogin.data);
      await this.getData();
      this.$emit('reload')
    },
    addSaldo(){
      this.enableAddSaldo();
    },
    enableAddSaldo() {
      this.dialogEnableAddSaldo = true;
    },
    cancelEnable() {
      this.dialogEnableAddSaldo = false;
    },
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
    decryptedAES(encrypted) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.files = file;
      this.url = URL.createObjectURL(file);
      this.dialogAvatar = false;
    },
    selectedAvatar(img){
      this.avatar = img;
      this.url = img;
      this.dialogAvatar = false;
      this.dataUsuario.Foto = this.url;
    }
  },
};
</script>

<style scoped>
  .text-h6{
    font-weight: bold;
    margin-bottom: 20px;
  }
  .profile-img{
    border: 1px solid rgb(202, 202, 202);
    border-radius: 10px;
  }
  .avatar{
    cursor: pointer;
  }
  .profile-img {
    margin-top: 5px;
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
  .text-toolbar{
    white-space: normal;
  }
  /* Estilos para los avatars */
  .avatar:hover{
    transform: scale(.9);
  }
  .section__p{
    margin-bottom: 0;
  }
  .section__input{
    margin-top: 5px;
  }
</style>
