<template>
  <v-card elevation="0" class="ma-0 pa-4" color="secondary">
    <v-row>
      <v-col cols="7" class="pa-5">
        <v-textarea
                outlined
                v-model="ips"
                label="Pega el IPS aquí"
        ></v-textarea>
      </v-col>
      <v-col cols='5' class="pa-5">
        <v-card-text class="pa-0 py-3 pb-4" >
            <v-btn width="140px" color="primary" 
            v-bind="attrs"
            v-on="on" @click="validateIPS2()">Ver IPS</v-btn>
        </v-card-text>
        <v-card-text class="pa-0 pt-4 pb-3">
            <v-btn width="140px" color="error" @click="ips=''">Borrar</v-btn>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row align="center"
      justify="center">
      <v-card elevation="0" v-if="false">
        <v-card-title>
          Los siguientes elementos no existen o no corresponden al formato:
        </v-card-title>
        <v-card-text >
          <v-list-item v-for="error in errors" :key="error">
            <v-list-item-content>
              <v-list-item-title>- {{error}} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-row>
    <div class="text-center">
      <v-dialog
        v-model="dialogErrors"
        width="500"
      >

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Problemas con IPS
          </v-card-title>
          <v-card-text>
            <v-card-subtitle class="pa-0 py-3" v-if="sectionErrors">
              Los siguientes campos faltantes son requeridos:
            </v-card-subtitle>
            <v-list-item v-for="error in cardErrors" :key="error">
              <v-list-item-content class="py-2">
                <v-list-item-title>- {{error}} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>          
            <v-card-subtitle class="pa-0 py-3" v-if="sectionFormat">
              Los siguientes campos no cumplen con el formato correcto:
            </v-card-subtitle>
            <v-list-item v-for="format in formatErrors" :key="format" >
              <v-list-item-content class="py-2">
                <v-list-item-title>- {{format}} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogErrors = false, sectionErrors = false, sectionFormat=false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>


<script>
  import {getStore} from "../../services/store.service";
  import sample from "../../utils/sample.json"
  import * as dayjs from 'dayjs';
  export default {
    data(){
      return{
        sampleJson: sample,
        ips: "",
        errors: [],
        formats: [],
        warnings: [],
        cardErrors: [],
        formatErrors: [],
        modelErrors: false,
        dialogErrors: false,
        sectionErrors: false,
        sectionFormat: false,
      }
    },
    mounted() {
      console.log(this.sampleJson);
    },
    methods: {
      isArray(myArray){
        return myArray.constructor === Array;
      },
      isObject(myObj){
        return myObj.constructor === Object;
      },
      validateIPS2(){
        this.cardErrors = [];
        this.formatErrors = [];
        // 0: 1..1    //1: 1..*    //2: 0..1   //3: 0..*
        // 0 and 1: required (only once) or (once or more).
        // 2 and 3: optional 

        //values are arrays in order to validate the data type later,
        //for now i will validate if it is an object(0), array(1) or string(2). 
        //fields that dont have second value in the array is because i dont know the datatype.
        let fields = { "identifier": [0,0], "type": [0,2], "timestamp": [0,2], "entry": [1, 1],
          "id": [2,2], "meta": [2,0], "implicitRules": [2], "language": [2,2], "total": [2], "signature": [2,0] };
        let ips;
        try{
            ips = JSON.parse(this.ips);
            console.log(ips);
            if (! this.isObject(ips)){
              this.formatErrors.push("ips no es un json");
              this.dialogErrors = true;
              this.sectionFormat = true;
              return;
            }
        }
        catch(e){
          this.formatErrors.push("ips no es un json");
          this.dialogErrors = true;
          this.sectionFormat = true;
          return;
        }
        for( let k in fields){ //value: fields[k] type: array
          let val = fields[k];
          let card = val[0];
          let v = ips[k]; //
          if( v == undefined && (card == 0 || card == 1) ){ //no se encontró y era obligatorio:
            this.cardErrors.push(k);
          }
          else{ // todos los otros q se encontraron:
            if (val.length > 1){ //tenemos el tipo de dato.
              let dataType = val[1];
              // 0: obj,  1: array
              if( (dataType == 0 && ! this.isObject(v)) || (dataType == 1 && ! this.isArray(v)) ){ //si debiese ser un obj y no es un obj... error de formato // lo mismo con array
                this.formatErrors.push(k);
              }
              if (dataType == 1 && card == 1 && v.length<1){ //requiere ser más de 1 y el tipo de dato es array
                this.cardErrors.push("slices en entry");
              }
            }
          }

        if(this.cardErrors.length > 0){
          this.dialogErrors = true;
          this.sectionErrors = true;
        }
        if(this.formatErrors.length >0){
          this.dialogErrors = true;
          this.sectionFormat = true;
        }
        }
      },
      validateIPS(){
        this.errors = [];
        this.formats = [];
        let required = ["identifier", "type", "timestamp", "entry"];
        let ips;
        try{
            ips = JSON.parse(this.ips);
            if (! this.isObject(ips)){
              this.formats.push("ips no es un json");
              this.dialogErrors = true;
              this.sectionFormat = true;
              return;
            }
        }
        catch(e){
          this.formats.push("ips no es un json");
          this.dialogErrors = true;
          this.sectionFormat = true;
          return;
        }
        for( let k of required){
          let v = ips[k];
          if( v == undefined ){
            this.errors.push(k);
          }
        }
        if( ips.identifier != undefined && !this.isObject(ips.identifier)){
          this.formats.push("identifier");
        }
        if((ips.entry != undefined && ! this.isArray(ips.entry)) || (ips.entry.length == 0)){
          this.formats.push("entry");
        }
        else{ // if entry is valid i will check that each slices contains the fields fullUrl and resource
          let countfullUrl = 0;
          let countResource = 0;
          for (let obj of ips.entry){
            let f = obj['fullUrl'];
            let r = obj['resource'];
            if( f == undefined && countfullUrl == 0){
              this.errors.push('fullUrl en una o más slice de entry');
              countfullUrl = 1;
            }
            if( r == undefined && countResource == 0){
              this.errors.push('resource en una o más slice de entry');
              countResource = 1;
            }
            if( countfullUrl == 1 && countResource == 1){
              break;
            }
          }
        }
        //this.validateComposition(ips);
        if(this.errors.length > 0){
          this.dialogErrors = true;
          this.sectionErrors = true;
        }
        if(this.formats.length >0){
          this.dialogErrors = true;
          this.sectionFormat = true;
        }
        
      },
      validateComposition(ips){
        let requiredOnce = ["status", "type", "type-coding-system", "type-coding-code", "subject", "subject-reference", "date", "title", ];
        let requiredMore = ["type-coding", "author", "section"];
        let resource;
        
        //check if the field resource field exists

        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Composition'){
            resource = obj.resource;
          }
        }
        if( resource == undefined){ // The section Composition was not found
          this.errors.push('Composition');
          return;
        }
        for( let k of required){
          let v = ips[k]
          if( v == undefined){
            this.errors.push(k);
          }
        }
        let validate = false;
        for( let obj of this.sampleJson.entry){
          if (obj.resource.resourceType == 'Composition'){
            let resource = obj.resource;
            //checking required values
            try{
              let status = resource.status;
            }
            catch(e){
              this.errors.push("status");
            }

            try{
              let type = resource.type;
              if( !this.isObject(type)){
                this.errors.push("type");
              }
            }
            catch(e){
              this.errors.push("type");
            }
            try{
              let coding = resource.type.coding;
              if( !this.isArray(coding) ){
                this.errors.push("type-coding");
              }
            }
            catch(e){
              this.errors.push("type-coding");
            }
            try{
              let system = resource.type.coding[0].system;
            }
            catch(e){
              this.errors.push("type-coding-system");
            }
            try{
              let code = resource.type.coding[0].code;
            }
            catch(e){
              this.errors.push("type-coding-code");
            }

            try{
              let subject = resource.subject;
              if( !this.isObject(subject)){
                this.errors.push("subject");
              }
            }
            catch(e){
              this.errors.push("subject");
            }
            try{
              let reference = resource.subject.reference;
              if( typeof reference != "string"){
                this.errors.push("subject-reference");
              }
            }
            catch(e){
              this.errors.push("subject-reference");
            }

            try{
              let date = resource.date;
            }
            catch(e){
              this.errors.push("date");
            }

            try{
              let author = resource.author;
              if( !this.isObject(author)){
                this.errors.push("author");
              }
            }
            catch(e){
              this.errors.push("author");
            }

            try{
              let title = resource.title;
              if( typeof title != "string"){
                this.errors.push("title");
              }
            }
            catch(e){
              this.errors.push("title");
            }

            try{
              let section = resource.section;
              if( ! this.isArray(section)){
                this.errors.push("section");
              }
            }
            catch(e){
              this.errors.push("section");
            }

            //checking others possible values.
            //if there are others values then the ips isn't valid
          }
        }
      },
    },
    computed: {
      user: getStore("user")
    },
    watch: {
      ips(){
      }
    }
  }
</script>

<style>
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.points {
  align-items: flex-start !important;
}
</style>
