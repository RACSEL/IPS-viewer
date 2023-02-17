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
            <v-card-subtitle class="pa-0 py-3" v-if="sectionMissing">
              Los siguientes campos faltantes son requeridos:
            </v-card-subtitle>
            <v-list-item v-for="error in missingErrors" :key="error">
              <v-list-item-content class="py-2">
                <v-list-item-title>- {{error}} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>          
            <v-card-subtitle class="pa-0 py-3" v-if="sectionCard">
              Los siguientes campos no cumplen con la cardinalidad correcta:
            </v-card-subtitle>
            <v-list-item v-for="error in cardErrors" :key="error" >
              <v-list-item-content class="py-2">
                <v-list-item-title>- {{error}} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-card-subtitle class="pa-0 py-3" v-if="sectionFormat">
              Los siguientes campos no cumplen con el formato correcto:
            </v-card-subtitle>
            <v-list-item v-for="error in formatErrors" :key="error" >
              <v-list-item-content class="py-2">
                <v-list-item-title>- {{error}} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogErrors = false, sectionCard = false, sectionFormat=false, sectionMissing=false">
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
        missingErrors: [],
        cardErrors: [],
        formatErrors: [],
        modelErrors: false,
        dialogErrors: false,
        sectionCard: false,
        sectionFormat: false,
        sectionMissing: false,
        formats: {
          "Resource": {
            "id": [2, 2, {}],
            "meta": [2, 0, "Meta"],
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
          },
          "BackboneElement": {
            "modifierExtension": [3, 1, "Extension"]
          },
          "Signature": {
            "type": [1, 1, "Coding"],
            "when": [0, 2, {}],
            "who": [0, 1, []], // the type is reference to several types (organization, patient, etc). I propose a list to solve this 
            "onBehalfOf": [2, 1, []], // same problem with type reference
            "targetFormat": [2, 2, {}],
            "sigFormat": [2, 2, {}],
            "data": [2, 2, {}]
          },
          "Coding": {
            "system": [2, 2, {}],
            "version": [2, 2, {}],
            "code": [2, 2, {}], // same problem with code
            "display": [2, 2, {}], 
            "userSelected": [2, 2, {}]
          },
          "Meta": {
            "versionId": [2, 2, {}],
            "lastUpdated": [2, 2, {}],
            "source": [2, 2, {}],
            "profile": [3, 1, []], // it has a structureDefinition reference
            "security": [3, 1, "Coding"],
            "tag": [3, 1, "Coding"]
          },
          "Range": {
            "low": [2, 2, {}], //SimpleQuantity (?)
            "high": [2, 2, {}] //SimpleQuantity (?)
          },
          "ContactDetail": {
            "name": [2, 2, {}],
            "telecom": [3, 1, "ContactPoint"]
          },
          "Narrative": {
            "status": [0, 2, {}],
            "div": [0, 2, {}]
          },
          "Annotation": {
            "author": [2, , ], // can be of two types, reference or string 
            "time": [2, 2, {}],
            "text": [0, 2, {}]
          },
          "Quantity": {
            "value": [2, 2, {}],
            "comparator": [2, 2, {}],
            "unit": [2, 2, {}],
            "system": [2, 2, {}],
            "code": [2, 2, {}]
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
      validateSection(fields, section, nameSection){ // fields are documentation.
        for( let param in fields){ //id, meta, etc...
          let data = fields[param]; // [card, tipo y dataType]
          let card = data[0];
          let pointer = section[param]; // parte del ips que estoy revisando

          // chequeo la cardinalidad:
          // no pueden haber 0 de los sgtes campos
          console.log('P: ', param);
          console.log( "chequeo cardinalidad: ", data);
          if ( (card == 0 || card == 1) && pointer == undefined ){ // no debe ser undefined
            this.missingErrors.push(nameSection + "-" + param);
          }
          // no pueden haber más de uno de los sgtes campos
          else if ( ( pointer != undefined) && (card == 0 || card == 2) && this.isArray(pointer) ){ // no debe ser array pq eso da chanche a que sea más de uno y debe ser minimo 0 y max 1
            this.cardErrors.push(nameSection + "-" + param);
          }

          console.log('chequeo tipo de dato de: ', pointer, ' deberia ser: ', data[2])
          // chequeo tipo de dato:
          if (pointer != undefined){
            console.log( "OBJ?? ", typeof data[2])
            if (typeof data[2] == 'object') { //{} or { más parametros } or 'DataType'
              if (Object.keys(data[2]).length == 0) { // {}
                console.log('es STRING')
                //se refiere a que son de tipo string
                if ( (card == 0 || card == 2) && (typeof pointer != 'string' && typeof pointer != 'boolean') ){
                  console.log( 'solo 1')
                  this.formatErrors.push(nameSection + "-" + param);
                }
                else if ( (card == 1 || card == 3) ){
                  console.log( 'varios, los chequeo todos:')
                  for (let elem of pointer){
                    console.log(elem);
                    if (typeof elem != 'string' && typeof elem != 'boolean'){
                      this.formatErrors.push(nameSection + "-" + param);
                      break
                    }
                  }
                }
              }
              else{ // { más parametros}
                
                
                if ( card == 0 || card == 2){ //unico dato
                  this.validateSection(data[2], pointer, nameSection + "-" + param)
                } 
                else{ //varios datos
                  for( let elem of pointer){
                    console.log('fields: ', this.formats[data[2]])
                    console.log('sectionIPS: ', elem)
                    console.log(nameSection + '-' + param)
                    this.validateSection(data[2], elem, nameSection + '-' + param)
                  }
                }
              }
            }
            else if( typeof data[2] == 'string'){ // 'DataType'
              //separo en unico o varios datos
              console.log('validaré la SUBseccion de: ', param, '---  EN: ', pointer)
              if(card == 0 || card == 2){ //unico dato
                this.validateSection(this.formats[data[2]], pointer, nameSection + '-' + param)
              }
              else{ //varios datos
                for (let elem of pointer){
                  console.log('fields: ', this.formats[data[2]])
                  console.log('sectionIPS: ', elem)
                  console.log(nameSection + '-' + param)
                  this.validateSection(this.formats[data[2]], elem, nameSection + '-' + param)

                }
              }
            }
          }
        }
      },
      
      validateIPS(){
        this.cardErrors = [];
        this.formatErrors = [];
        this.missingErrors = [];
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
        //this.validateSection(fields, ips, 'Inicio');
        //this.validateComposition(ips);
        this.validatePatient(ips);
        if(this.cardErrors.length > 0){
          this.dialogErrors = true;
          this.sectionCard = true;
        }
        if(this.formatErrors.length >0){
          this.dialogErrors = true;
          this.sectionFormat = true;
        }
        if(this.missingErrors.length > 0){
          this.dialogErrors = true;
          this.sectionMissing = true;
        }
        if( this.dialogErrors == false){
          console.log('PERFECT');
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
            this.validateSection(fields, resource, 'Composition');
          }
        }
        if( resource == undefined){ // The section Composition was not found
          this.cardErrors.push('Composition');
          return;
        }
      },
      validatePatient(ips){
        let fields = {
          "id": [2, 2, {}], //id
          "meta": [2, 0, "Meta"],
          "implicitRules": [2, 2, {}], // uri
          "language": [2, 2, {}], // code
          "text": [2, 0, {}], //Narrative
          "contained": [3, 1, "Resource"],
          "extension": [3, 1, "Extension"],
          "modifierExtension": [3, 1, "Extension"],
          "identifier": [3, 1, "Identifier"],
          "active": [2, 2, {}], //boolean
          "name": [1, 1, "HumanName"],
          "telecom": [3, 1, "ContactPoint"],
          "gender": [2, 2, {}], //code
          "birthDate": [0, 2, {}], //date
          //"deceased": [2, , {
          //  "deceasedBoolean": [-, , ],
          //  "deceasedDateTime": [-, , ]
          //}],
          "address": [3, 1, "Address"],
          "maritalStatus": [2, 0, "CodeableConcept"],
          //"multipleBirth": [2, , {
          //  "multipleBirthBoolean": [-, , ],
          //  "multipleBirthInteger": [-, , ],
          //}],
          "photo": [3, 2, {}], //Attachment
          "contact": [3, 1, {
            "id": [2, 2, {}], //string
            "extension": [3, 1, "Extension"],
            "modifierExtension": [3, 2, "Extension"],
            "relationship": [3, 2, "CodeableConceptIPS"],
            "name": [2, 0, "HumanName"],
            "telecom": [3, 1, "ContactPoint"],
            "address": [2, 0, "Address"],
            "gender": [2, 2, {}], //code
            "organization": [2, 2, {}], //Reference(Organization)
            "period": [2, 0, "Period"]
          }],
          "communication": [3, 1, {
            "id": [2, 2, {}], //string
            "extension": [3, 1, "Extension"],
            "modifierExtension": [3, 1, "Extension"],
            "language": [0, 2, "CodeableConcept"], 
            "preferred": [2, 2, {}] //boolean
          }],
          "generalPractitioner": [3, 1, {}], //Reference(Organization | Practicioner)
          "managingOrganization": [2, 0, {}], // Reference(Organization)
          "link": [3, 1, { //supongo es 1
            "id": [2, 2, {}], //string
            "extension": [3, 1, "Extension"],
            "modifierExtension": [3, 1, "Extension"],
            "other": [0, 2, {}], // Reference(Patient 1 RelatedPerson)
            "type": [0, 2, {}] //code
          }]
        }
        let resource;
        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Patient'){
            resource = obj.resource;
            this.validateSection(fields, resource, 'Patient');
          }
        }
        if( resource == undefined){ // The section Patient was not found
          this.cardErrors.push('Patient');
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
