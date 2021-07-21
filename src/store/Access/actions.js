import Vue from "vue";
// Obtiene personal en general
export function getPersons (context) {
    return Vue.prototype.$axios.get(`select_personal_general/${process.env.__BASE__}`)
}
