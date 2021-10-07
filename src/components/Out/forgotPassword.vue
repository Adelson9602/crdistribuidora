<template>
  <form class="login100-form validate-form" @submit="onSubmit">
    <span class="login100-form-title">
      Recuperar contraseña
    </span>
    <q-input
      filled
      v-model="datauser.user"
      type="number"
      label="Ingrese su usuario"
    >
      <template v-slot:prepend>
        <q-icon name="account_circle" />
      </template>
    </q-input>
    <div class="container-login100-form-btn">
      <button class="login100-form-btn" type="submit">
        RECUPERAR CONTRASEÑA
      </button>
    </div>
    <div class="forgot-pass text-center p-t-12">
      <a class="txt2" href="#" @click="login">
        Iniciar sesión
      </a>
    </div>
  </form>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: 'ForgotPassword',
  data() {
    return {
      datauser: {
        user: null
      }
    };
  },

  methods: {
    onSubmit() {
      this.$q.loading.show({
        message: "Recuperando contraseña"
      });
      setTimeout(async () => {
        try {
          
        } catch (e) {
          console.log(e);
        } finally {
          this.$q.loading.hide();
        }
      }, 500);
    },
    login() {
      this.$emit("login");
    },
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(process.env.__KEY__), {
        iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
        mode: CryptoJS.mode.CBC
      }).toString()
      return cipher.toString()
    },
    aesDencrypt(txt) {
      const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(process.env.__KEY__), {
        iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
        mode: CryptoJS.mode.CBC
      })
      return CryptoJS.enc.Utf8.stringify(cipher).toString()
    },
  }
};
</script>

<style scoped>
a {
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

a:focus {
  outline: none !important;
}

a:hover {
  text-decoration: none;
  color: #57b846;
}

button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}

.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-image: url("../../statics/back-login.png");
  background-image: no-repeat;
  background-image: fixed;
  background-image: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.login100-form {
  width: 290px;
  margin-top: 30px;
  z-index: 1000;
  position: relative;
}

.login100-form-title {
  font-family: Poppins-Bold;
  font-size: 24px;
  color: #333333;
  line-height: 1.2;
  text-align: center;

  width: 100%;
  display: block;
  padding-bottom: 30px;
}

.container-login100-form-btn {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 20px;
}

.login100-form-btn {
  font-family: Montserrat-Bold;
  font-size: 15px;
  line-height: 1.5;
  color: #fff;
  text-transform: uppercase;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background: rgb(74,98,220);
  background: linear-gradient(90deg, rgba(74,98,220,1) 0%, rgba(0,11,171,1) 52%, rgba(24,75,217,1) 100%);
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login100-form-btn:hover {
  background: #333333;
}

@media (max-width: 768px) {
  .login100-form {
    width: 100%;
  }
}

.forgot-pass {
  position: relative;
  z-index: 1000;
}

.txt2 {
  font-family: Poppins-Regular;
  font-size: 13px;
  line-height: 1.5;
  color: #666666;
}

/* utils */
.p-t-12 {
  padding-top: 12px;
}
</style>
