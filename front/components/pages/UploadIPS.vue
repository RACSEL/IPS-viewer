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
            <v-btn width="140px" color="primary" @click="validateIPS()">Ver IPS</v-btn>
        </v-card-text>
        <v-card-text class="pa-0 pt-4 pb-3">
            <v-btn width="140px" color="error" @click="ips=''">Borrar</v-btn>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row>
      <v-card>
        Los siguientes elementos no existen o no corresponden al formato:
        <v-list-item v-for="error in errors" :key="error">
          <v-list-item-content>
            <v-list-item-title> {{error}} </v-list-item-title>
            <v-list-item-subtitle>-</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-row>
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
        warnings: [],
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
      validateIPS(){
        let ips = JSON.parse(this.ips);
        this.errors = [];
        let required = ["resourceType", "id", "language", "identifier", "identifier-system", "identifier-value", "type", "timestamp", "entry"];
        let v;
        for( let k of required){
          if(k.includes("-")){
            const words = k.split("-");
            v = ips[words[0]][words[1]];
          }
          else{
            v = ips[k]
          }
          if( v == undefined){
            this.errors.push(k);
          }
        }
        if( ! this.isObject(ips)){
          this.errors.push("ips no es un json");
        }
        if( ips.identifier != undefined && !this.isObject(ips.identifier)){
          this.errors.push("identifier");
        }
        if(ips.entry != undefined && ! this.isArray(ips.entry)){
          this.errors.push("entry1");
        }
        console.log(this.errors);
        
      },
      validateComposition(ips){
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
