<template>
  <div>
    <div class="limiter">
      <div class="backgorund_gradient"></div>
      <div class="container-login100">
        <div class="wrap-login100">
          <div class="login bg-white">
            <div class="content-login">
              <img
                class="logo"
                src="../statics/logo_cr.png"
                alt="Logo de empresa"
              />

              <login-form
                class="col-xs-12"
                v-if="!isForgot"
                @onLogin="onLogin"
              />
              <div class="forgot-pass text-center p-t-12" v-if="!isForgot">
                <a class="txt2" href="#" @click="isForgot = true">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <forgot-password
                class="col-xs-12"
                v-if="isForgot"
                @login="forgot"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer items-center">
      <div class="footer-container">
        <!-- Rights-->
        <p class="footer__p">
          <span>&copy;</span><span class="copyright-year"></span
          ><span>&nbsp;</span
          ><span
            ><b>{{ name_company }}</b
            >. Todos los derechos reservados</span
          ><span>.&nbsp;</span
          ><a
            class="footer__appears"
            target="_blank"
            href="https://appears.com.co"
          >
            Desarrollado por Appears</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import loginForm from "components/out/LoginForm";
import forgotPassword from "components/out/forgotPassword";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      name_company: process.env.__PROJECT__,
      isForgot: false
    };
  },
  name: "PageLogin",
  components: {
    loginForm,
    forgotPassword
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  methods: {
    ...mapActions("auth", ["login"]),
    ...mapMutations("auth", ["setUser", "setIsLogged"]),
    async onLogin(user) {
      this.$q.loading.show({
        message: "Iniciando sesión, por favor espere..."
      });
      try {
        user.base = process.env.__BASE__;
        const { data } = await this.login(user); //login es la acción, está definida en mapActions de la tienda de datos de vuex
        this.setUser(data.data);
        this.setIsLogged(true);
        this.$router.push("desktop");
        this.$q.notify({
          type: "positive",
          message: "Bienvenido"
        });
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: e.message
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    forgot() {
      this.isForgot = false;
    }
  }
};
</script>
<style scoped>
@media (max-width: 767.98px) {
  .my-card {
    box-shadow: none !important;
  }
}

@font-face {
  font-family: Poppins-Regular;
  src: url("../statics/fonts/poppins/Poppins-Regular.ttf");
}

@font-face {
  font-family: Poppins-Bold;
  src: url("../statics/fonts/poppins/Poppins-Bold.ttf");
}

@font-face {
  font-family: Poppins-Medium;
  src: url("../statics/fonts/poppins/Poppins-Medium.ttf");
}

@font-face {
  font-family: Montserrat-Bold;
  src: url("../statics/fonts/montserrat/Montserrat-Bold.ttf");
}

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

/*---------------------------------------------*/
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0px;
}

p {
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
}

ul,
li {
  margin: 0px;
  list-style-type: none;
}

/*---------------------------------------------*/
input {
  outline: none;
  border: none;
}

textarea {
  outline: none;
  border: none;
}

textarea:focus,
input:focus {
  border-color: transparent !important;
}

input:focus::-webkit-input-placeholder {
  color: transparent;
}
input:focus:-moz-placeholder {
  color: transparent;
}
input:focus::-moz-placeholder {
  color: transparent;
}
input:focus:-ms-input-placeholder {
  color: transparent;
}

textarea:focus::-webkit-input-placeholder {
  color: transparent;
}
textarea:focus:-moz-placeholder {
  color: transparent;
}
textarea:focus::-moz-placeholder {
  color: transparent;
}
textarea:focus:-ms-input-placeholder {
  color: transparent;
}

input::-webkit-input-placeholder {
  color: #999999;
}
input:-moz-placeholder {
  color: #999999;
}
input::-moz-placeholder {
  color: #999999;
}
input:-ms-input-placeholder {
  color: #999999;
}

textarea::-webkit-input-placeholder {
  color: #999999;
}
textarea:-moz-placeholder {
  color: #999999;
}
textarea::-moz-placeholder {
  color: #999999;
}
textarea:-ms-input-placeholder {
  color: #999999;
}

button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}

iframe {
  border: none !important;
}

.txt1 {
  font-family: Poppins-Regular;
  font-size: 13px;
  line-height: 1.5;
  color: #999999;
}

.txt2 {
  font-family: Poppins-Regular;
  font-size: 13px;
  line-height: 1.5;
  color: #666666;
}

.backgorund_gradient {
  margin: 0 auto;
  background-image: url("../statics/background_des.jpg");
  background-image: no-repeat;
  background-position: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  position: absolute;
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
  z-index: 2000;
}

.backgorund_gradient::after {
  content: "";
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(90deg, rgb(75, 75, 75), rgb(0, 0, 0));
  opacity: 0.5;
}

.wrap-login100 {
  /* width: 520px; */
  /* height: 600px; */
  background: #fff;
  border-radius: 5px;
  overflow: hidden;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* .login100-pic {
  width: 50%;
  display: grid;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url('../statics/back-tips.png');
  background-image: no-repeat;
  background-image: fixed;
  background-image: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
} */

.login {
  width: 100%;
  padding: 30px 50px;
  display: grid;
  justify-content: center;
  position: relative;
}

.logo {
  display: flex;
  margin: auto;
}

.img-back-login-left {
  position: absolute;
  left: 0;
  top: 0;
}

.img-back-login {
  position: absolute;
  right: 0;
  bottom: 0;
}

.content-login {
  z-index: 1000;
  position: relative;
}

.wrap-input100 {
  position: relative;
  width: 100%;
  z-index: 1;
  margin-bottom: 10px;
}

.symbol-input100 {
  font-size: 15px;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 35px;
  pointer-events: none;
  color: #666666;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.input100:focus + .focus-input100 + .symbol-input100 {
  color: #57b846;
  padding-left: 28px;
}

@media (max-width: 840px) {
  .login {
    width: 100%;
  }

  .wrap-login100 {
    width: 480px;
  }
}

@media (max-width: 575px) {
  .container-login100 {
    background: #ffffff;
    padding: 0;
  }

  .login {
    align-items: center;
    padding-top: 0;
  }

  .wrap-login100 {
    width: 100vw !important;
    height: 100vh;
    -webkit-box-shadow: 0px 0px 15px -4px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 15px -4px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -4px rgba(0, 0, 0, 0.75);
    border-radius: 0;
  }

  .img-back-login {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
  }
}

@media (max-width: 360px) {
  .content-login img {
    width: 260px;
  }
}

.validate-input {
  position: relative;
}

.alert-validate::before {
  content: attr(data-validate);
  position: absolute;
  max-width: 70%;
  background-color: white;
  border: 1px solid #c80000;
  border-radius: 13px;
  padding: 4px 25px 4px 10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
  pointer-events: none;
  font-family: Poppins-Medium;
  color: #c80000;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  visibility: hidden;
  opacity: 0;

  -webkit-transition: opacity 0.4s;
  -o-transition: opacity 0.4s;
  -moz-transition: opacity 0.4s;
  transition: opacity 0.4s;
}

.alert-validate::after {
  content: "\f06a";
  font-family: FontAwesome;
  display: block;
  position: absolute;
  color: #c80000;
  font-size: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 13px;
}

.alert-validate:hover:before {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 992px) {
  .alert-validate::before {
    visibility: visible;
    opacity: 1;
  }
}

/* utils */
.p-t-12 {
  padding-top: 12px;
}

/* Footer */
.footer {
  background: white;
  bottom: 0;
  text-align: center;
  position: absolute;
  z-index: 1111;
  width: 100%;
}
.footer__p {
  color: black;
}
.footer__appears {
  text-decoration: none;
  color: black;
  font-weight: bold;
}
</style>
