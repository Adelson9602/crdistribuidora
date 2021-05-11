<template>
  <div class="q-pa-md">
    <div class="row q-pt-md content-card">
      <div class="q-pa-xs content-card-one ">
        <q-card
          class="my-card text-white card-one"
        >
          <q-card-section class="row my-card__up">
            <div class="my-card__content-up">
                <span class="text_card self-center">Compras</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-xs content-card-two">
        <q-card
          class="my-card text-white card-two"
        >
          <q-card-section class="row my-card__up">
            <div class="my-card__content-up">
                <span class="text_card self-center">Ventas</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-xs content-card-three">
        <q-card
          class="my-card text-white card-three"
        >
          <q-card-section class="row my-card__up">
            <div class="my-card__content-up">
                <span class="text_card self-center">Card 3</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-xs content-card-for">
        <q-card
          class="my-card text-white card-four"
        >
          <q-card-section class="row my-card__up">
            <div class="my-card__content-up">
                <span class="text_card self-center">Card 4</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
// import tableDesktop from "components/Generals/ComponentTable";
// import InspectionHistory from "components/Reports/ComponentInspectionHistory";
// import componentSkeletonTable from "components/Generals/componentSkeletonTable";
import { openURL } from "quasar";

export default {
  // components: {
  //   tableDesktop,
  //   componentSkeletonTable
  // },
  data() {
    return {
      renderComponent: true,
      dateRange: {
        from: null,
        to: null
      },
      arrayTitles: [
        {
          name: "consecutivo",
          required: true,
          label: "ID",
          align: "center",
          field: "consecutivo",
          sortable: true
        },
        {
          name: "Creado",
          label: "Persona responsable",
          align: "center",
          field: "Creado",
          sortable: true
        },
        {
          name: "hora",
          label: "Hora inspección",
          align: "center",
          field: "hora",
          sortable: true
        },
        {
          name: "Detalle",
          label: "Detalle",
          align: "center",
          field: "Detalle",
          sortable: true
        },
        {
          name: "tanqueo",
          label: "Tanqueo",
          align: "center",
          field: "tanqueo",
          sortable: true
        },
        {
          name: "grave",
          label: "Fallas Graves",
          align: "center",
          field: "grave",
          sortable: true
        },
        {
          name: "moderada",
          label: "Fallas Moderadas",
          align: "center",
          field: "moderada",
          sortable: true
        },
        {
          name: "CANT_FALLAS",
          label: "Cant fallas",
          align: "center",
          field: "CANT_FALLAS",
          sortable: true
        },
        {
          name: "estado",
          label: "Estado",
          align: "center",
          field: "estado",
          sortable: true
        }
      ],
      headerJspdf: [
        { header: "Consecutivo", dataKey: "consecutivo" },
        { header: "Persona responsable", dataKey: "Creado" },
        { header: "Hora Inspección", dataKey: "hora" },
        { header: "Detalle", dataKey: "Detalle" },
        { header: "Tanqueo?", dataKey: "tanqueo" },
        { header: "Fallas Graves", dataKey: "grave" },
        { header: "Fallas Moderadas", dataKey: "moderada" },
        { header: "Cant fallas", dataKey: "CANT_FALLAS" },
        { header: "Estado", dataKey: "estado" }
      ],
      inception: false,
      secondDialog: false,
      group: [],
      tableData: [],
      dashData: {},
      teal: null,
      failuresPreoperational: [],
      formInforme: false,
      formAuditoria: false,
      informe: {
        Observaciones: null,
        Foto: null,
        fecha_auditoria: null, //sistena
        idResumen_Preoperacional: null,
        Persona_Documento: null
      },
      phtoInforme: null,
      title: null,
      files: null,
      idResumen_Preoperacional: null,
      haveFailures: false,
      dataUserSilge: {},
      exportData: [],
    };
  },
  computed: {
    ...mapState("dekstop", ["inspections"]),
    ...mapState("app", ["isOnline"]),
    ...mapState("auth", ["user"]),
    ...mapState("reports", ["Lastenmonts", "Lasteninspection"]),
    arrayLastenmonts() {
      if (this.isOnline) {
        return this.Lastenmonts;
      }
    },
    arrayLasteninspection() {
      if (this.isOnline) {
        return this.Lasteninspection;
      }
    },
    arrayHystory() {
      if (this.isOnline) {
        return this.tableData;
      } else {
        return this.inspections; //Datos del indexDB, los mostrará cuando este offline
      }
    },
    dataUser() {
      return this.user;
    },
    online(){
      return this.isOnline
    }
  },
  async mounted() {
    // this.apiGetdashdesktop();
    // this.getData();
    // // this.getKey();
    // var ulrActual = location.href.split("/");
    // if (ulrActual.length === 4 && ulrActual[3] === 'desktop') {
    //   setInterval(() => {
    //     if(navigator.onLine){
    //       this.apiGetdashdesktop();
    //     }
    //   }, 60000);
    // }
  },
  methods: {
    // ...mapActions("dekstop", [
    //   "getInspectionsDesktop",
    //   "getdashdesktop",
    //   "getInspectionsDefault",
    //   "getFailures",
    //   "insertInformeExpress",
    //   "troubleshoot",
    //   "dashdesktopdriver",
    //   "historyUser",
    //   "exportPdf"
    // ]),
    // ...mapMutations("dekstop", [
    //   "setInspectionsDesktop",
    //   "setidPreoperacional",
    //   "setFolder",
    // ]),
    // ...mapActions("inspections", [
    //   "saveFile",
    //   "getAllCities",
    //   "getPlates",
    //   "getItemsInspection",
    //   "getTrailers",
    // ]),
    // ...mapMutations("inspections", [
    //   "setAllCities",
    //   "setPlatesVehicle",
    //   "setDataVehicle",
    //   "setItemInspection",
    //   "setAllDataTrailers",
    // ]),
    // ...mapActions("access", ["getUsers", "getDeparments"]),
    // ...mapMutations("access", ["setDataSingleUser", "setDeparments"]),
    // ...mapMutations("reports", ["setinspectionsday"]),
    // ...mapActions("reports", ["getlastenmonts", "getlasteninspection"]),
    // async getData() {
    //   this.$q.loading.show({
    //     message: "Obteniendo datos del servidor, por favor espere..."
    //   });
    //   setTimeout(async () => {
    //     try {
    //       if(this.dataUser.Rol_Id !== 2){
    //         const latestInspections = await this.getInspectionsDefault().then(
    //           res => {
    //             return res.data;
    //           }
              
    //         ); 
    //         // hacemos el foreach para asignar los datos de la petición a una variable local
    //         latestInspections.forEach(element => {
    //           this.tableData.push(element);
    //         });

    //       } else {
    //         var usuario = {
    //           idusuario: this.dataUser.UsuarioUser
    //         };

    //         const reshistoryUser = await this.historyUser(usuario).then( res => {
    //           return res.data
    //         })
    //         reshistoryUser.forEach( element => {
    //           this.tableData.push(element);
    //         })
    //       }

    //       const lastenmont = await this.getlastenmonts().then(res => {
    //         return res.data;
    //       });

    //       const lasteninsp = await this.getlasteninspection().then(res => {
    //         return res.data;
    //       });
    //       let datos = [lastenmont, lasteninsp];
    //       this.setinspectionsday(datos);
    //       //Obtenemos todas las ciudades
    //       const AllCities = await this.getAllCities().then(res => {
    //         return res.data;
    //       });
    //       this.setAllCities(AllCities);

    //       // Enviamos los datos al state, este lo guarda en el indexDB
    //       this.setInspectionsDesktop(this.tableData);

    //       const allUsers = await this.getUsers().then(res => {
    //         return res.data;
    //       }); //This is for get data of the api, this is a action
    //       // Recorremos el obtejo que nos retorna la api

    //       allUsers.forEach(user => {
    //         if (user.UsuarioUser === this.dataUser.UsuarioUser) {
    //           this.dataUserSilge = user;
    //         }
    //       });

    //       this.setDataSingleUser(this.dataUserSilge); // send data to mutations

    //       // PETICIONES PARA LAS INSPECCIONES
    //       //Obtains data from the vehicle license plate
    //       const platesVehicle = await this.getPlates().then(res => {
    //         return res.data;
    //       });
    //       var plateLocal = [];
    //       this.setPlatesVehicle([]);
    //       platesVehicle.forEach((element, index) => {
    //         if(element.State !== 0){
    //           plateLocal.push(element.Veh_Placa);
    //         }
    //       });
    //       this.setDataVehicle(platesVehicle); //Guardamos los datos del vehículo en la tienda de datos, este se recorrera cuando la placa del vehículo cambie en el select
    //       this.setPlatesVehicle(plateLocal);
    //       // Enviamos los items a la tienda de datos, permite la persistencia de datos
  
    //       // Obtenemos los items de inpsección
    //       this.setItemInspection([]);
    //       const itemsInspection = await this.getItemsInspection().then(res => {
    //         return res.data;
    //       });
    //       // Enviamos los items a la tienda de datos, permite la persistencia de datos
    //       this.setItemInspection(itemsInspection);
  
    //       //Obtenemos todos los datos de los trailers
    //       this.setAllDataTrailers([]);
    //       const dataTrailers = await this.getTrailers().then(res => {
    //         return res.data;
    //       });
    //       // Enviamos los datos de los trailers a la tienda de datos, permite la persistencia de datos
    //       this.setAllDataTrailers(dataTrailers);

    //       this.setDeparments([]);
    //       const deparments = await this.getDeparments().then(res=>{
    //         return res.data
    //       });
    //       this.setDeparments(deparments);

    //       this.renderComponent = true;
    //     } catch (e) {
    //       console.log(e)
    //       let type_notify = 'negative';
    //       if ( e.message === "Network Error" ) {
    //         e = e.message;
    //         type_notify = 'warning';
    //       } else if ( e.message === "Request failed with status code 404" ){
    //         e = 'Error 404 al hacer la petición al servidor';
    //       } else if(e.message){
    //         e = e.message;
    //       }
    //       this.$q.notify({
    //         message: e,
    //         type: type_notify
    //       });
    //     } finally {
    //       this.$q.loading.hide();
    //     }
    //   }, 2000);
    // },
    // async apiGetInspections() {
    //   let range = {
    //     from: this.dateRange.from,
    //     to: this.dateRange.to
    //   }
    //   this.$q.loading.show({
    //     message: "Obteniendo inspecciones, por favor espere..."
    //   });
    //   setTimeout(async () => {
    //     try {
    //       this.tableData.length = 0;
    //       const { data } = await this.getInspectionsDesktop(range); // Get user from api
    //       data.forEach(element => {
    //         this.tableData.push(element);
    //       });
    //       console.log({
    //         msg: 'Respuesta get inspecciones por rango',
    //         data: data
    //       })
    //       // this.setInspectionsDesktop(data);

    //       const resexportPdf = await this.exportPdf(range).then( res => {
    //         return res.data;
    //       })
    //       console.log({
    //         msg: 'Respuesta get inspecciones por rango para exportar',
    //         data: resexportPdf
    //       })
    //       resexportPdf.forEach( doc => {
    //         this.exportData.push( doc )
    //       })
    //       // this.dataTable = data;
    //     } catch (e) {
    //       console.log(e)
    //       let type_notify = 'negative';
    //       if ( e.message === "Network Error" ) {
    //         e = e.message;
    //         type_notify = 'warning';
    //       } else if ( e.message === "Request failed with status code 404" ){
    //         e = 'Error 404 al hacer la petición al servidor';
    //       } else if(e.message){
    //         e = e.message;
    //       }
    //       this.$q.notify({
    //         message: e,
    //         type: type_notify
    //       });
    //     } finally {
    //       this.$q.loading.hide();
    //     }
    //   }, 2000);
    // },
    // async apiGetdashdesktop() {
    //   setTimeout(async () => {
    //     try {
    //       var usuario = {
    //         idusuario: this.dataUser.UsuarioUser
    //       };
    //       if(this.dataUser.Rol_Id !== 2){
    //         const data  = await this.getdashdesktop(usuario).then( res => {
    //           return res.data
    //         });
    //         this.dashData = data;
            
    //       } else {
    //         const data  = await this.dashdesktopdriver(usuario).then( res => {
    //           return res.data
    //         });
          
    //         this.dashData = data;
    //       }
         
    //       this.setFolder(this.dashData.carpeta)
      
    //     } catch (e) {
    //       console.log(e)
    //       let type_notify = 'negative';
    //       if ( e.message === "Network Error" ) {
    //         e = e.message;
    //         type_notify = 'warning';
    //       } else if ( e.message === "Request failed with status code 404" ){
    //         e = 'Error 404 al hacer la petición al servidor';
    //       } else if(e.message){
    //         e = e.message;
    //       }
    //       this.$q.notify({
    //         message: e,
    //         type: type_notify
    //       });
    //     }
    //   }, 2000);
    // },
    // openDialogEnable(idPreoperacional) {
    //   this.idResumen_Preoperacional = idPreoperacional;
    //   this.$q.loading.show({
    //     message: "Obteniendo datos del servidor, por favor espere..."
    //   });
    //   setTimeout(async () => {
    //     try {
    //       this.failuresPreoperational.length = 0;
    //       this.setidPreoperacional(idPreoperacional);
    //       const failures = await this.getFailures().then(res => {
    //         var failures = [];
    //         res.data.forEach(element => {
    //           failures.push({
    //             idItemMalo: element.IInsp_Id,
    //             idresumenpreoperacional: element.ResuPre_Id,
    //             fechaReporteFalla: element.ResuPre_Fecha,
    //             Rdp_Id: element.Rdp_Id,
    //             nombre_item: element.nombre_item,
    //             value: null,
    //             Foto: null,
    //             Observaciones: null,
    //             fechaReporteSolucion: null,
    //             Persona_Documento: null
    //           });
    //         });
    //         this.inception = true;
    //         return failures;
    //       });
    //       if (failures.length > 0) {
    //         this.haveFailures = true;
    //       } else {
    //         this.haveFailures = false;
    //       }
    //       failures.forEach(element => {
    //         this.failuresPreoperational.push(element);
    //       });
    //     } catch (e) {
    //       console.log(e)
    //       let type_notify = 'negative';
    //       if ( e.message === "Network Error" ) {
    //         e = e.message;
    //         type_notify = 'warning';
    //       } else if ( e.message === "Request failed with status code 404" ){
    //         e = 'Error 404 al hacer la petición al servidor';
    //       } else if(e.message){
    //         e = e.message;
    //       }
    //       this.$q.notify({
    //         message: e,
    //         type: type_notify
    //       });
    //     } finally {
    //       this.$q.loading.hide();
    //     }
    //   }, 2000);
    // },
    // onSubmit() {
    //   var date = new Date();
    //   var dateToDay =
    //     date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //   var hourNow = date.toTimeString().split(":");
    //   var seconds = hourNow[2].split(" ");
    //   var hour = hourNow[0] + ":" + hourNow[1] + ":" + seconds[0];
    //   var fullDate = dateToDay + " " + hour; //Concatenamos la hora y fecha, para luego asignarla a la variable que se enviara en el post
    //   this.dateHour = fullDate;
    //   if (this.formInforme) {
    //     if (this.informe.Observaciones !== null) {
    //       this.$q.loading.show({
    //         message: "Validando informe, por favor espere..."
    //       });
    //       setTimeout(async () => {
    //         try {
    //           console.log("informe Expresss");
    //           if (this.phtoInforme !== null) {
    //             // Enviamos la foto del informe al server
    //             const formData = new FormData();
    //             formData.append(
    //               "files",
    //               this.phtoInforme,
    //               this.phtoInforme.name
    //                 .toLowerCase()
    //                 .replace(/ /ig, "_")
    //             );
    //             await this.saveFile(formData).then(async res => {
                 
    //               var photoInforme = process.env.__URLAPI__+"/adjuntos/" +
    //                 this.phtoInforme.name .toLowerCase()
    //                 .replace(/ /ig, "_");
                                      
    //               if (res.data.saved) {
    //                 //Si la imagen se logra subir entonces procedemos a enviar las respuestas a la DB
                   
    //                 this.informe.Foto = photoInforme;
    //                 this.informe.fecha_auditoria = fullDate;
    //                 this.informe.idResumen_Preoperacional = this.idResumen_Preoperacional;
    //                 this.informe.Persona_Documento = this.dataUser.UsuarioUser;
    //                 // Se envia la petición para guardar el informe Express
    //                 const resinsertInformeExpress = await this.insertInformeExpress(
    //                   this.informe
    //                 ).then(res => {
    //                   return res.data;
    //                 });
    //                 console.log({
    //                   msg: 'Respuesta guardado informe express',
    //                   data: resinsertInformeExpress
    //                 })
    //                 if(!resinsertInformeExpress.affectedRows){
    //                   throw 'Error al guardar el informe express';
    //                 }
    //                 this.$q.notify({
    //                   type: "positive",
    //                   message: "Informe guardado"
    //                 });
    //                 this.formInforme = false; //Cerramos el dialog luego de guardar el informe
    //                 this.informe = {}; //Vaciamos el objeto informe para que el formulario quede en blanco;
    //                 this.phtoInforme = null; //Dejamos el input file en blanco nuevamente
    //                 this.inception = false;
    //                 this.secondDialog = false;
    //               }
    //             });
    //           } else {
    //             this.informe.fecha_auditoria = fullDate;
    //             this.informe.idResumen_Preoperacional = this.idResumen_Preoperacional;
    //             this.informe.Persona_Documento = this.dataUser.UsuarioUser;
    //             const resinsertInformeExpress = await this.insertInformeExpress(
    //               this.informe
    //             ).then(res => {
    //               return res.data;
    //             });
    //             this.$q.notify({
    //               type: "positive",
    //               message: "Informe guardado"
    //             });
    //             console.log({
    //               msg: 'Respuesta guardado informe express',
    //               data: resinsertInformeExpress
    //             });
    //             this.formInforme = false; //Cerramos el dialog luego de guardar el informe
    //             this.informe = {}; //Vaciamos el objeto informe para que el formulario quede en blanco;
    //             this.phtoInforme = null; //Dejamos el input file en blanco nuevamente
    //             this.inception = false;
    //             this.secondDialog = false;
    //           }
    //           // Reload
    //           this.reload();
    //         } catch (e) {
    //           console.log(e)
    //           let type_notify = 'negative';
    //           if ( e.message === "Network Error" ) {
    //             e = e.message;
    //             type_notify = 'warning';
    //           } else if ( e.message === "Request failed with status code 404" ){
    //             e = 'Error 404 al hacer la petición al servidor';
    //           } else if(e.message){
    //             e = e.message;
    //           }
    //           this.$q.notify({
    //             message: e,
    //             type: type_notify
    //           });
    //         } finally {
    //           this.$q.loading.hide();
    //         }
    //       }, 2000);
    //     } else {
    //       this.$q.notify({
    //         type: "negative",
    //         message: "El campo observaciones es obligatorio"
    //       });
    //     }
    //   } else {
    //     this.$q.loading.show({
    //       message: "Validando auditoría, por favor espere..."
    //     });
    //     setTimeout(() => {
    //       try {
    //         //Se envia petición para solucionar las fallas
    //         this.failuresPreoperational.forEach(async element => {
    //           if (element.value === "OK") {
    //             element.fechaReporteSolucion = dateToDay;
    //             if (element.Foto !== null) {
    //               const formData = new FormData();
    //               formData.append(
    //                 "files",
    //                 element.Foto,
    //                 element.Foto.name.toLowerCase().replace(/ /gi, "_")
    //               );
    //               await this.saveFile(formData).then(async res => {
    //                 var nameImage = res.data.url.split("/"); //Hacemos un split para obtener el nombre del archivo subido, no podemos asignar res.data.url directamente ya que este nos retorna como respuesta la ip del servidor y este no es apto para acceder al archivo subido
    //                 var photoAuditoria = process.env.__URLAPI__+"/adjuntos/" +
    //                   element.Foto.name
    //                     .toLowerCase()
    //                     .replace(/ /gi, "_");
    //                 element.Foto = photoAuditoria;
    //                 element.Persona_Documento = this.dataUser.UsuarioUser;
    //                 await this.troubleshoot(element).then(res => {
    //                   if (res.data.affectedRows > 0) {
    //                     this.$q.notify({
    //                       type: "positive",
    //                       message: "Auditoría guardada"
    //                     });
    //                     element = {};
    //                     this.formAuditoria = false;
    //                     this.secondDialog = false;
    //                     this.inception = false;
    //                   } else {
    //                     this.$q.notify({
    //                       type: "negative",
    //                       message:
    //                         "No pudimos guardar la auditoría, por favor intente nuevamente"
    //                     });
    //                   }
    //                   console.log(JSON.stringify(res.data));
    //                 });
    //               });
    //             } else {
    //               if (element.Observaciones !== null) {
    //                 console.log(element);
    //                 element.Persona_Documento = this.dataUser.UsuarioUser;
    //                 await this.troubleshoot(element).then(res => {
    //                   if (res.data.affectedRows > 0) {
    //                     this.$q.notify({
    //                       type: "positive",
    //                       message: "Auditoría guardada"
    //                     });
    //                     element = {};
    //                     this.formAuditoria = false;
    //                     this.inception = false;
    //                     this.secondDialog = false;
    //                   } else {
    //                     this.$q.notify({
    //                       type: "negative",
    //                       message:
    //                         "No pudimos guardar la auditoría, por favor intente nuevamente"
    //                     });
    //                   }
    //                   console.log(JSON.stringify(res.data));
    //                 });
    //               } else {
    //                 this.$q.notify({
    //                   type: "negative",
    //                   message: "El campo observaciones es obligatorio"
    //                 });
    //               }
    //             }
    //           }
    //         });
    //         // Reload
    //         this.reload();
    //       } catch (e) {
    //         console.log(e)
    //         let type_notify = 'negative';
    //         if ( e.message === "Network Error" ) {
    //           e = e.message;
    //           type_notify = 'warning';
    //         } else if ( e.message === "Request failed with status code 404" ){
    //           e = 'Error 404 al hacer la petición al servidor';
    //         } else if(e.message){
    //           e = e.message;
    //         }
    //         this.$q.notify({
    //           message: e,
    //           type: type_notify
    //         });
    //       } finally {
    //         this.$q.loading.hide();
    //       }
    //     }, 2000);
    //   }
    // },
    // reload(){
    //   this.renderComponent = false;
    //   this.group = [];
    //   this.tableData = [];
    //   this.dashData = [];
    //   this.failuresPreoperational = [];
    //   this.getData();
    // },
    // openSecondDialog(mode) {
    //   if (mode === "informe") {
    //     this.formInforme = true;
    //     this.formAuditoria = false;
    //     this.title = "Informe express";
    //   } else {
    //     this.formAuditoria = true;
    //     this.formInforme = false;
    //     this.title = "Auditoría";
    //   }
    //   this.secondDialog = true;
    // },
    // showPdf(id) {
    //   openURL(
    //     `${process.env.__URLPDF__}=${id}&carpe=${this.dashData.carpeta}`
    //   );
    // },
    // showQr(id) {
    //   openURL(
    //     `https://qinspecting.com/QR/qr2.php?id=${id}&opc=2&carpe=${this.dashData.carpeta}`
    //   );
    // },
    // sendNotification(){
    //   const notificationOps = {
    //     body: 'Cuerpo de la notificación',
    //     icon: '../statics/icons/icon-72x72.png'
    //   }

    //   const notification = new Notification ( 'Hola mundo! - aceptada', notificationOps);
    //   notification.onclick = () => {
    //     console.log('Click')
    //   }
    // },
    // notification(){
    //   if(!window.Notification){
    //     console.log('No soporta notificaciones')
    //     return
    //   }
    //   // Si el permiso es aceptado
    //   if(Notification.permission === 'granted'){
    //     this.sendNotification();
    //   } else if ( Notification.permission !== 'denied' || Notification.permission === 'default' ){
    //     Notification.requestPermission( permission => {
    //       console.log(permission)
    //       if(permission === 'granted'){
    //         new Notification('Notificación desde pregunta')
    //       }
    //     })
    //   }
    // },
    // getKey(){
    //   try {
    //     const publicKey = fetch('http://localhost:3000/key').then( res => res.arrayBuffer())
    //       .then( key => new Uint8Array( key ))
    //     console.log( publicKey.then( console.log ) )
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // onExport(){
    //   this.exportData.forEach( doc => {
    //     window.open('google.com.co', "nombre de la ventana", "width=300, height=200")
    //   })
    // }
  }
};
</script>

<style scoped>
.q-card{
  border-radius: 10px;
}

.q-pt-md{
  padding-top: 0;
}

.date_training {
  width: 70%;
}
.content-card{
  display: grid;
  grid-template-columns: repeat(4, 25%);
}
.my-card {
  height: 100px !important;
  /* min-width: 265px !important; */
}
.my-card__up{
  display: flex;
}
.my-card__content-up{
  /* margin: auto; */
  display: flex;
}
.card-one{
  background: rgb(46,91,219);
  background: linear-gradient(90deg, rgba(46,91,219,1) 0%, rgba(88,109,221,1) 0%, rgba(27,38,181,1) 30%, rgba(27,38,181,1) 53%, rgba(66,83,206,1) 90%, rgba(88,109,221,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4eeb00', endColorstr='#1d9a02', GradientType=1 );
}
/* .card-one{
  background: rgba(255,190,226,1);
  background: -moz-linear-gradient(-45deg, rgba(255,190,226,1) 15%, rgba(255,152,211,1) 53%, rgba(253,132,197,1) 64%, rgba(249,92,169,1) 86%, rgba(249,92,169,1) 100%);
  background: -webkit-gradient(left top, right bottom, color-stop(15%, rgba(255,190,226,1)), color-stop(53%, rgba(255,152,211,1)), color-stop(64%, rgba(253,132,197,1)), color-stop(86%, rgba(249,92,169,1)), color-stop(100%, rgba(249,92,169,1)));
  background: -webkit-linear-gradient(-45deg, rgba(255,190,226,1) 15%, rgba(255,152,211,1) 53%, rgba(253,132,197,1) 64%, rgba(249,92,169,1) 86%, rgba(249,92,169,1) 100%);
  background: -o-linear-gradient(-45deg, rgba(255,190,226,1) 15%, rgba(255,152,211,1) 53%, rgba(253,132,197,1) 64%, rgba(249,92,169,1) 86%, rgba(249,92,169,1) 100%);
  background: -ms-linear-gradient(-45deg, rgba(255,190,226,1) 15%, rgba(255,152,211,1) 53%, rgba(253,132,197,1) 64%, rgba(249,92,169,1) 86%, rgba(249,92,169,1) 100%);
  background: linear-gradient(135deg, rgba(255,190,226,1) 15%, rgba(255,152,211,1) 53%, rgba(253,132,197,1) 64%, rgba(249,92,169,1) 86%, rgba(249,92,169,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffbee2', endColorstr='#f95ca9', GradientType=1 );
} */
.card-two{
  background: rgb(46,91,219);
  background: linear-gradient(90deg, rgba(46,91,219,1) 0%, rgba(88,109,221,1) 0%, rgba(27,38,181,1) 30%, rgba(27,38,181,1) 53%, rgba(66,83,206,1) 90%, rgba(88,109,221,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffd77e', endColorstr='#ff8811', GradientType=1 );
}
.card-three{
  background: rgb(46,91,219);
  background: linear-gradient(90deg, rgba(46,91,219,1) 0%, rgba(88,109,221,1) 0%, rgba(27,38,181,1) 30%, rgba(27,38,181,1) 53%, rgba(66,83,206,1) 90%, rgba(88,109,221,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fbbce3', endColorstr='#9d65e3', GradientType=1 );
}
.card-four{
  background: rgb(46,91,219);
  background: linear-gradient(90deg, rgba(46,91,219,1) 0%, rgba(88,109,221,1) 0%, rgba(27,38,181,1) 30%, rgba(27,38,181,1) 53%, rgba(66,83,206,1) 90%, rgba(88,109,221,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#40faee', endColorstr='#2592c8', GradientType=1 );
}

.card_auditoria {
  width: 470px;
}
.text_card {
  font-size: 17px;
  font-weight: 500;
  padding-left: 5px;
  line-height: 1;
}
.content-card-info{
  display: flex;
  justify-content: center;
  height: 50%;
  padding: unset;
  text-align: center;
}
.card-info{
  align-self: center;
}
.card-info__small{
  font-size: 16px;
}
.card-info__large{
  font-size: 25px;
  font-weight: bold;
}
b {
  font-size: 18px;
}
@media screen and (max-width: 1200px){
  .text_card{
    font-size: 15px;
  }
  .card-info__small{
  font-size: 13px;
  }
  .card-info__large{
    font-size: 17px;
  }
}
@media screen and (max-width: 800px){
  .content-card{
    grid-template-columns: 50%;
  }
  .content-card-one{
    grid-column: 1/2;
  }  
  .content-card-two{
    grid-column: 2/3;
  }  
  .text_card{
    font-size: 17px;
  }
  .card-info__small{
  font-size: 16px;
  }
  .card-info__large{
    font-size: 25px;
  }
}
@media screen and (max-width: 580px){
  .content-card{
    grid-template-columns: 100%;
  }
  .content-card-one{
    grid-column:initial;
  }  
  .content-card-two{
    grid-column:initial;
  }  
}
@media (max-width: 575.98px) {
  .card_dialog_report {
    min-width: 100% !important;
  }
  .container-btns {
    justify-content: center !important;
  }
  .mt{
    margin-top: 15px;
  }
}
</style>
