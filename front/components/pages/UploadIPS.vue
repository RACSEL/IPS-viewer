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
            v-on="on" @click="validateIPS()">Ver IPS</v-btn>
        </v-card-text>
        <v-card-text class="pa-0 pt-4 pb-3">
            <v-btn width="140px" color="error" @click="ips=''">Borrar</v-btn>
        </v-card-text>
      </v-col>
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
        warnings: [],
        cardErrors: [],
        formatErrors: [],
        modelErrors: false,
        dialogErrors: false,
        sectionErrors: false,
        sectionFormat: false,
        formats: {
          "Resource": {
            "id": [2, 2, {}],
            "meta": [2, 0, {}],
            "implicitRules": [2, 2, {}],
            "language": [2, 2, {}],
          },
          "Extension": {
            "url": [0, 2, {}],
            "value": [2, 2, {}] //value[x] not enough info //arreglar
          },
          "Identifier": {
            "use": [2, 2, {}], //verificar code en gral
            "type": [2, 0, "CodeableConcept"],
            "system": [ 2 , 2, {}],
            "value":  [2, 2, {}],
            "period": [2, 0, "Period"],
            "assigner": [2, 0,{}] // missing
          }, 
          "HumanName": {
            "id": [2, 2, ],
            "extension": [3, 2, "Extension"],
            "use": [2, 2, {}],
            "text": [2, 2, ],
            "family": [2, 2, {}],
            "given": [3, 1, {}],
            "prefix": [3, 2, ], // idk 2
            "suffix": [3, 2, ], // idk 2
            "period": [2, 0, "Period"]  
          },
          "Period": {
            "start": [2, 2, {}],
            "end": [2, 2, {}]
          },
          "ContactPoint": {
            "system": [2, 2, {}],
            "value": [2, 2, {}],
            "use": [2, 2, {}],
            "rank": [2, 2, {}],
            "period": [2, 0, "Period"]
          },
          "Address": {
              "use" : [2, 2, {}], 
              "type" :  [2, 2, {}],
              "text" :  [2, 2, {}],
              "line" :  [3, 2, {}], // creo que es -,1,-. Es decir, una lista por ser de tipo 3.
              "city" :  [2, 2, {}],
              "district" :  [2, 2, {}],
              "state" :  [2, 2, {}],
              "postalCode" : [2, 2, {}],
              "country" : [2, 2, {}],
              "period" : [2, 0, "Period"]
          },
          "CodingIPS": {
              "id": [2, 2, {}],
              "extension": [ 3, 1, "Extension"], 
              "system": [ 0, 2, {}],
              "version": [ 2, 2, {}],
              "code": [ 0, 2, {}],
              "display": [ 2, 2, {}], // ver este pq tiene parametros internos en este caso pero en los ejemplos no es así
              "userSelected": [ 2, 2, {}]
          },
          "CodeableConceptIPS": {
            "id": [2, 2, {}],
            "extension": [3, 2, "Extension"],
            "coding": [1, 1, "CodingIPS"],
            "text": [2, 2, {}]
          },
          "CodeableConcept": {
            "coding": [3, 1, "Coding"],
            "text": [2, 2, {}]
          }

        }
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
        this.cardErrors = [];
        this.formatErrors = [];
        // 0: 1..1    //1: 1..*    //2: 0..1   //3: 0..*
        // 0 and 1: required (only once) or (once or more).
        // 2 and 3: optional 

        //values are arrays in order to validate the data type later,
        //for now i will validate if it is an object(0), array(1) or string(2). 
        //fields that dont have second value in the array is because i dont know the datatype.
        let fields = { 
          "id": [2,2, {}],
          "meta": [2, 0,{}],
          "implicitRules": [2, 2,{}],
          "language": [2, 2,{}],
          "identifier": [0, "Identifier", {}], 
          "type": [0,2, {}], 
          "timestamp": [0, 2, {}], 
          "total": [2, ,{}],
          "entry": [1, 1, {
            "fullUrl": [0, 2, {}]
          }],
          "signature": [2, ,{}]
        };
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
        this.validateCardAndFormat(fields, ips);
        this.validateComposition(ips);
        this.validatePatient(ips);
        if(this.cardErrors.length > 0){
          this.dialogErrors = true;
          this.sectionErrors = true;
        }
        if(this.formatErrors.length >0){
          this.dialogErrors = true;
          this.sectionFormat = true;
        }
      },
      validateCardAndFormat(fields, obj){
        for( let k in fields){ //value: fields[k] 
          let val = fields[k]; // [card, tipo de dato, {más variables}]
          let card = val[0];
          let v = obj[k]; //
          if( v == undefined && (card == 0 || card == 1) ){ //no se encontró y era obligatorio:
            this.cardErrors.push(k);
          }
          else if (v != undefined){ // todos los otros q se encontraron: reviso el tipo de dato y sus posibles variables internas
              //si es string es un tipo de dato que ya tengo guardado
            if (typeof val[1] == "string"){ //type: Resource
              console.log("es de tipo guardado:")
              let dataTypeFields = this.formats[val[1]]; // {"a": ..., "b": ..., etc}
              console.log("dataTypeFields: ", dataTypeFields);
              console.log("v: ", v);
              this.validateCardAndFormat(dataTypeFields, v)
            }
            //si no es string es un numero y es de tipo obj (0), lista(1) o string/desconocido(2)
            else{
              if (val[1] < 2){ //tenemos el tipo de dato conocido (0 o 1), ya que 2 es string o no conocido
                let dataType = val[1];
                // 0: obj,  1: array
                if( (dataType == 0 && ! this.isObject(v)) || (dataType == 1 && ! this.isArray(v)) ){ //si debiese ser un obj y no es un obj... error de formato // lo mismo con array
                  this.formatErrors.push(k);
                }
                if (dataType == 1 && card == 1 && v.length<1){ //requiere ser más de 1 y el tipo de dato es array
                  this.cardErrors.push("elementos en " + k);
                }
              }
            }
            //reviso los parametros internos si es q tiene
            console.log("estoy en: ", k, "   ",  v," revisare los campos internos (3ra var): ", val)
            if (val[2].length !=  0){
              if (val[1] == 1){ // es un array, revisar por cada elemento del array q se cumplan las validaciones
                for (let elem of v){
                  this.validateCardAndFormat(val[2], elem);
                }
              }
              else{
                this.validateCardAndFormat(val[2], v);
              }
            }
          }
        }
      },
      validateComposition(ips){
        // 0: 1..1    //1: 1..*    //2: 0..1   //3: 0..*
        // 0 and 1: required (only once) or (once or more).
        // 2 and 3: optional 

        //0: obj, 1:array, 2: string 3: no lo sé
        // si no es undefined y tiene 3ra variable... revisar los hijos... asi hasta el sgte, tipo arbol
        let fields = {  
          "id": [ 2, 2, {}],
          "meta": [ 2, 0, "Meta"], // http://hl7.org/fhir/R4/resource.html#Meta
          "implicitRules": [ 2, 2, {} ],
          "language": [ 2, 2, {}], // tipo code?? arreglar
          "text": [ 2, 2, { // a veces es un obj y otras un string
            //arreglar
          }], 
          "contained": [3, 3, "Resource"], // idk es de tipo Resource
          "versionNumber": [3, 3, {}],
          "modifierExtension": [3, 3, "Extension"],
          "identifier": [2, 0, "Identifier"],
          "status": [0, 2, {}], 
          "type": [0, 0, "CodeableConceptIPS"], 
          "category": [3, 3, "CodeableConcept"], //supongo es una lista pero no lo sé
          "subject": [0, 3, { // es Reference arreglar

          }], 
          "encounter": [2, 3, {}], // es reference arreglar
          "date": [0, 2, {}], 
          "author": [1, 3, {}], // es reference arreglar
          "title": [0, 2, {}],
          "confidentiality": [2, 2, {}],
          "attester": [3, 3, { // arreglar

          }], 
          "custodian": [2, 3, {}], // es reference
          "relatesTo": [3, 3, {}], // arreglar
        }
        let resource;
        
        //check if the field resource field exists

        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Composition'){
            resource = obj.resource;
            this.validateCardAndFormat(fields, resource);
          }
        }
        if( resource == undefined){ // The section Composition was not found
          this.errors.push('Composition');
          return;
        }
      },
      validatePatient(ips){
        let fields = {
          "id": [2, 2, ],
          "meta": [2, 0, {
            // not enough info
          }],
          "implicitRules": [2, 2, ],
          "language": [2, 2, ],
          "text": [2, 0, {
            // not enough info
          }],
          "contained": [3, 'Resource', {}],
          "extension": [3, "Extension", {}],
          "modifierExtension": [3, "Extension", {}],
          "identifier": [3, "Identifier", {}],
          "active": [2, 2, {}],
          "name": [1, 1, "HumanName"],
          "telecom": [3, 1, "ContactPoint"],
          "gender": [2, 2, {}],
          "birthDate": [0, 2, {}],
          //"deceased": [2, , {
          //  "deceasedBoolean": [-, , ],
          //  "deceasedDateTime": [-, , ]
          //}],
          "address": [3, 1, "Address"],
          "maritalStatus": [2, 0, {
            // rellenar
          }],
          //"multipleBirth": [2, , {
          //  "multipleBirthBoolean": [-, , ],
          //  "multipleBirthInteger": [-, , ],
          //}],
          "photo": [3, 2, {}], // arreglar
          "contact": [3, 1, {
            "id": [2, 2, {}],
            "extension": [3, 1, "Extension"],
            "modifierExtension": [3, 2, "Extension"],
            "relationship": [3, 2, { // es 3, 1, algo
              //arreglar
            }],
            "name": [2, 0, "HumanName"],
            "telecom": [3, 1, "ContactPoint"],
            "address": [2, 0, "Address"],
            "gender": [2, 2, {}],
            "organization": [2, 2, {}], //arreglar
            "period": [2, 0, "Period"]
          }],
          "communication": [3, 1, {
            "id": [2, 2, {}],
            "extension": [3, 1, "Extension"],
            "modifierExtension": [3, 1, "Extension"],
            "language": [0, 2, {}], // arreglar
            "preferred": [2, 2, {}]
          }],
          "generalPractitioner": [3, 1, { //arreglar
            
          }],
          "managingOrganization": [2, 0, {}], //arreglar
          "link": [3, 1, { //supongo es 1
            "id": [2, 2, {}],
            "extension": [3, 1, "Extension"],
            "modifierExtension": [3, 1, "Extension"],
            "other": [0, 2, {}], //arreglar es reference
            "type": [0, 2, {}]
          }]
        }
        let resource;
        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Patient'){
            resource = obj.resource;
            this.validateCardAndFormat(fields, resource);
          }
        }
        if( resource == undefined){ // The section Patient was not found
          this.errors.push('Patient');
          return;
        }
      }
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
