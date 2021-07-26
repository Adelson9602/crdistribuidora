import Vue from "vue";
let base = process.env.__BASE__;
// Obtiene personal en general
export function getPersons (context) {
    return Vue.prototype.$axios.get(`select_personal_general/${base}`)
}

// Lista las metas fijadas 
export function getGoals(){
    return Vue.prototype.$axios.get(`select_metas_general/${base}`);
}

// METAS
// Inserta o actualiza las metas
export function insertUpdateGoals(context, data){
    return Vue.prototype.$axios.post(`insert_update_metas`, data);
}