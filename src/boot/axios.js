import axios from 'axios'

export default ({Vue}) => {
    let baseURL = null;
    // Validamos el entorno de la aplicación, para asignar la url de la api, si es dev estamos en desarrollo caso trario en producción
    if(process.env.__ENV__ === 'dev'){
      baseURL = 'https://apis.appears.com.co/sigiP/';
    } else if (process.env.__ENV__ === 'production'){
      baseURL = process.env.__URLAPI__;
    }
    Vue.prototype.$axios = axios.create({
      baseURL
    });
  }
