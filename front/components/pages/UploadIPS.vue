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
  import sampleNow from "../../utils/sampleBegin.json"
  import {getStore} from "../../services/store.service";
  //import sample from "../../utils/sample.json"
  import * as dayjs from 'dayjs';
  export default {
    data(){
      return{
        //sampleJson: sample,
        ips: "",
        sample: sampleNow,
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
            "id": {"card": 2, 
                   "dataType": [1]}, // 1 is going to be string for now
            "meta": {"card": 2, 
                   "dataType": ["Meta"]},
            "implicitRules": {"card": 2, 
                            "dataType": [1]},
            "language": {"card": 2,
                        "dataType": [1]},
          },
          "Extension": {
            "url": {"card": 0, 
                   "dataType": [1]},
            "value": {"card": 2, 
                      "dataType": ["Value"],
                      "setDataType": true}
          },
          "MultipleBirth": {
            "multipleBirthBoolean": 1,
            "multipleBirthInteger": 1,
          },
          "Value": {
            "valueBase64Binary": 1,
            "valueBoolean": 1,
            "valueCanonical": 1,
            "valueCode": 1,
            "valueDate": 1,
            "valueDateTime": 1,
            "valueDecimal": 1,
            "valueId": 1,
            "valueInstant": 1,
            "valueInteger": 1,
            "valueMarkdown": 1,
            "valueOid": 1,
            "valuePositiveInt": 1,
            "valueString": 1,
            "valueTime": 1,
            "valueUnsignedInt": 1,
            "valueUri": 1,
            "valueUrl": 1,
            "valueUuid": 1,
            "valueAddress": "Address",
            "valueAge": "Age",
            "valueAnnotation": "Annotation",
            "valueAttachment": "Attachment",
            "valueCodeableConcept": "CodeableConcept",
            "valueCoding": "Coding",
            "valueContactPoint": "ContactPoint",
            "valueCount": "Count", 
            "valueDistance": "Distance",
            "valueDuration": "Duration",
            "valueHumanName": "HumanName",
            "valueIdentifier": "IdentIdentifierifier",
            "valueMoney": "Money",
            "valuePeriod": "Period",
            "valueQuantity": "Quantity",
            "valueRange": "Range",
            "valueRatio": "Ratio",
            "valueReference": "Reference", 
            "valueSampledData": "SampledData",
            "valueSignature" : "Signature",
            "valueTiming": "Timing",
            "valueContactDetail": "ContactDetail",
            "valueContributor": "Contributor",
            "valueDataRequirement": "DataRequirement",
            "valueExpression": "Expression",
            "valueParameterDefinition": "ParameterDefinition",
            "valueRelatedArtifact": "RelatedArtifact",
            "valueTriggerDefinition": "TriggerDefinition",
            "valueUsageContext": "UsageContext",
            "valueDosage": "Dosage",
            "valueMeta": "Meta"
          },
          "Identifier": {
            "use": {"card": 2, 
                   "dataType": [1]}, // code 
            "type": {"card": 2, 
                   "dataType": ["CodeableConcept"]},
            "system": {"card": 2, 
                      "dataType": [1]},
            "value": {"card": 2, 
                      "dataType": [1]},
            "period": {"card": 2, 
                      "dataType": ["Period"]},
            "assigner": {"card": 2, 
                        "dataType": ["Reference"]}, // Reference to Organization
          }, 
          "HumanName": {
            "id": {"card": 2, 
                   "dataType": [1]},
            "extension": {"card": 3, 
                   "dataType": ["Extension"]},
            "use": {"card": 2, 
                   "dataType": [1]},
            "text": {"card": 2, 
                   "dataType": [1]},
            "family": {"card": 2, 
                   "dataType": [1]},
            "given": {"card": 3, 
                    "dataType": [1]},
            "prefix": {"card": 3, 
                      "dataType": [1]}, // idk 2
            "suffix": {"card": 3, 
                      "dataType": [1]}, // idk 2
            "period": {"card": 2, 
                      "dataType": ["Period"]}  
          },
          "Period": {
            "start": {"card": 2, 
                   "dataType": [1]},
            "end": {"card": 2, 
                   "dataType": [1]}
          },
          "ContactPoint": {
            "system": [2, 2, {}],
            "value": [2, 2, {}],
            "use": [2, 2, {}],
            "rank": [2, 2, {}],
            "period": [2, 0, "Period"]
          },
          "Address": {
              "use": {"card": 2, 
                    "dataType": [1]}, 
              "type": {"card": 2, 
                      "dataType": [1]},
              "text": {"card": 2, 
                      "dataType": [1]},
              "line": {"card": 3, 
                      "dataType": [1]}, 
              "city": {"card": 2, 
                      "dataType": [1]},
              "district": {"card": 2, 
                          "dataType": [1]},
              "state": {"card": 2, 
                      "dataType": [1]},
              "postalCode": {"card": 2, 
                            "dataType": [1]},
              "country": {"card": 2, 
                         "dataType": [1]},
              "period": {"card": 2, 
                   "dataType": ["Period"]}
          },
          "CodingIPS": {
              "id": {"card": 2, 
                    "dataType": [1]},
              "extension": {"card": 3, 
                            "dataType": ["Extension"]}, 
              "system": {"card": 0, 
                         "dataType": [1]},
              "version": {"card": 2, 
                         "dataType": [1]},
              "code": {"card": 0, 
                      "dataType": [1]},
              "display": {"card": 2, 
                         "dataType": [1]}, // ver este pq tiene parametros internos en este caso pero en los ejemplos no es así
              "userSelected": {"card": 2, 
                              "dataType": [1]}
          },
          "CodeableConceptIPS": {
            "id": {"card": 2, 
                  "dataType": [1]},
            "extension": {"card": 3, 
                        "dataType": ["Extension"]},
            "coding": {"card": 1, 
                      "dataType": ["CodingIPS"]},
            "text": {"card": 2, 
                    "dataType": [1]},
          },
          "CodeableConcept": {
            "coding": {"card": 3, 
                      "dataType": ["Coding"]},
            "text": {"card": 2, 
                    "dataType": [1]}
          },
          "BackboneElement": {
            "modifierExtension": {"card": 3, 
                                "dataType": ["Extension"]}
          },
          "Signature": {
            "type": {"card": 1, 
                    "dataType": ["Coding"]},
            "when": {"card": 0, 
                    "dataType": [1]},
            "who": {"card": 2, 
                    "dataType": ["Reference"]}, // the type is reference to several types (organization, patient, etc). I propose a list to solve this 
            "onBehalfOf": {"card": 2, 
                          "dataType": ["Reference"]}, // same problem with type reference
            "targetFormat": {"card": 2, 
                            "dataType": [1]},
            "sigFormat": {"card": 2, 
                          "dataType": [1]},
            "data": {"card": 2, 
                    "dataType": [1]}
          },
          "Coding": {
            "system": {"card": 2, 
                      "dataType": [1]},
            "version": {"card": 2, 
                       "dataType": [1]},
            "code": {"card": 2, 
                    "dataType": [1]}, // same problem with code
            "display": {"card": 2, 
                       "dataType": [1]}, 
            "userSelected": {"card": 2, 
                            "dataType": [1]}
          },
          "Meta": {
            "versionId": {"card": 2, 
                          "dataType": [1]}, //id
            "lastUpdated": {"card": 2,  
                            "dataType": [1]}, //instant
            "source": {"card": 2, 
                      "dataType": [1]}, //uri
            "profile": {"card": 3, 
                        "dataType": [1]}, // CANONICAL
            "security": {"card": 3, 
                        "dataType": ["Coding"]},
            "tag": {"card": 2, 
                    "dataType": ["Coding"]}
          },
          "Range": {
            "low": {"card": 2, 
                    "dataType": []}, //SimpleQuantity (?)
            "high": {"card": 2, 
                    "dataType": []} //SimpleQuantity (?)
          },
          "ContactDetail": {
            "name": {"card": 2, 
                    "dataType": [1]},
            "telecom": {"card": 3, 
                      "dataType": ["ContactPoint"]}
          },
          "Narrative": {
            "status": {"card": 0, 
                      "dataType": [1]},
            "div": {"card": 0, 
                    "dataType": [1]},
          },
          "Annotation": {
            "author": {"card": 2, 
                      "dataType": [1, "Reference"]}, // can be of two types, reference or string 
            "time": {"card": 2, 
                    "dataType": [1]},
            "text": {"card": 0, 
                    "dataType": [1]}
          },
          "Quantity": {
            "value": {"card": 2, 
                      "dataType": [1]},
            "comparator": {"card": 2, 
                          "dataType": [1]},
            "unit": {"card": 2, 
                    "dataType": [1]},
            "system": {"card": 2, 
                      "dataType": [1]},
            "code": {"card": 2, 
                    "dataType": [1]}, 
          },
          "Attachment": {
            "contentType": {"card": 2, 
                            "dataType": [1]},
            "language": {"card": 2, 
                        "dataType": [1]},
            "data": {"card": 2, 
                    "dataType": [1]},
            "url": {"card": 2, 
                    "dataType": [1]},
            "size": {"card": 2, 
                     "dataType": [1]},
            "hash": {"card": 2, 
                     "dataType": [1]},
            "title": {"card": 2, 
                      "dataType": [1]},
            "creation": {"card": 2, 
                        "dataType": [1]},
          },
          "Age": { //Specialized Quantity

          },
          "Count": { //Specialized Quantity

          },
          "Distance": { //Specialized Quantity

          },
          "Duration": { //Specialized Quantity

          },
          "Money": {
            "value": {"card": 2, 
                      "dataType": [1]},
            "currency": {"card": 2, 
                        "dataType": [1]},
          },
          "Ratio": {
            "numerator": {"card": 2, 
                          "dataType": ["Quantity"]},
            "denominator": {"card": 2, 
                            "dataType": ["Quantity"]}
          },
          "Reference": {
            "reference": {"card": 2, 
                         "dataType": [1]},
            "type": {"card": 2, 
                    "dataType": [1]},
            "identifier": {"card": 2, 
                          "dataType": ["Identifier"]},
            "display": {"card": 2, 
                       "dataType": [1]}
          },
          "SampledData": {
            "origin": {"card": 0, 
                      "dataType": []}, // SimpleQuantity
            "period": {"card": 0, 
                      "dataType": [1]},
            "factor": {"card": 2, 
                      "dataType": [1]},
            "lowerLimit": {"card": 2, 
                          "dataType": [1]},
            "upperLimit": {"card": 2, 
                          "dataType": [1]},
            "dimensions": {"card": 0, 
                          "dataType": [1]},
            "data": {"card": 2, 
                    "dataType": [1]}
          },
          "Timing": {
            "event": {"card": 3, 
                      "dataType": [1]},
            "repeat": {"card": 2, 
                      "dataType": ["Repeat"]},
            "code": {"card": 2, 
                      "dataType": ["CodeableConcept"]},                  
          },
          "Repeat": {
            "bounds": {"card": 2, 
                      "dataType": ["Bounds"],
                      "setDataType": true},
            "count": {"card": 2, 
                    "dataType": [1]},
            "countMax": {"card": 2, 
                        "dataType": [1]},
            "duration": {"card": 2, 
                        "dataType": [1]},
            "durationMax": {"card": 2, 
                            "dataType": [1]},
            "durationUnit": {"card": 2, 
                            "dataType": [1]},
            "frequency": {"card": 2, 
                          "dataType": [1]},
            "frequencyMax": {"card": 2, 
                            "dataType": [1]},
            "period": {"card": 2, 
                      "dataType": [1]},
            "periodMax": {"card": 2, 
                          "dataType": [1]},
            "periodUnit": {"card": 2, 
                          "dataType": [1]},      
            "dayOfWeek": {"card": 3, 
                          "dataType": [1]},
            "timeOfDay": {"card": 3, 
                          "dataType": [1]},
            "when": {"card": 3, 
                     "dataType": [1]},
            "offset": {"card": 2, 
                       "dataType": [1]}
          },
          "Bounds": {
            "boundsDuration": "Duration",
            "boundsRange": "Range",
            "boundsPeriod": "Period"
          },
          "Contributor": {
            "type": {"card": 0, 
                     "dataType": [1]},
            "name": {"card": 0, 
                     "dataType": [1]},
            "contact": {"card": 3, 
                        "dataType": ["ContactDetail"]}
          },
          "DataRequirement": {
            "type": {"card": 0, 
                     "dataType": [1]},
            "profile": {"card": 3, 
                        "dataType": []}, // type canonical(StructureDefinition)
            "subject": {"card": 2, 
                        "dataType": ["Subject"],
                        "setDataType": true},
            "mustSupport": {"card": 3, 
                            "dataType": [1]},
            "codeFilter": {"card": 3, 
                           "dataType": ["CodeFilter"]},
            "dateFilter": {"card": 3, 
                           "dataType": ["DateFilter"]},
            "limit": {"card": 2, 
                      "dataType": [1]},
            "sort": {"card": 3, 
                     "dataType": ["Sort"]}
          },
          "Subject": {
            "subjectCodeableConcept": "CodeableConcept",
            "subjectReference": "Reference" // Reference to group
          },
          "CodeFilter": {
            "path": {"card": 2, 
                       "dataType": [1]},
            "searchParam": {"card": 2, 
                            "dataType": [1]},
            "valueSet": {"card": 2, 
                         "dataType": []}, //canonical(ValueSet)
            "code": {"card": 3, 
                     "dataType": ["Coding"]}
          },
          "DateFilter": {
            "path": {"card": 2, 
                       "dataType": [1]},
            "searchParam": {"card": 2, 
                            "dataType": [1]},
            "value": {"card": 2, 
                      "dataType": ["ValueDateFilter"],
                      "setDataType": true}
          },
          "ValueDateFilter": {
            "valueDateTime": 1,
            "valuePeriod": "Period",
            "valueDuration": "Duration"
          },
          "Sort": {
            "path": {"card": 0, 
                     "dataType": [1]},
            "type": {"direction": 0, 
                     "dataType": [1]},
          },
          "Expression": {
            "description": {"card": 2, 
                            "dataType": [1]},
            "name": {"card": 2, 
                     "dataType": [1]},
            "language": {"card": 0, 
                         "dataType": [1]},
            "expression": {"card": 2, 
                           "dataType": [1]},
            "reference": {"card": 2, 
                          "dataType": [1]}
          },
          "ParameterDefinition": {
            "name": {"card": 2, 
                     "dataType": [1]},
            "use": {"card": 0, 
                    "dataType": [1]},
            "min": {"card": 2, 
                    "dataType": [1]},
            "max": {"card": 2, 
                    "dataType": [1]},
            "documentation": {"card": 2, 
                              "dataType": [1]},
            "type": {"card": 0, 
                     "dataType": [1]},
            "profile": {"card": 2, 
                        "dataType": []} //canonical(StructureDefinition)
          },
          "RelatedArtifact": {
            "type": {"card": 0, 
                     "dataType": [1]},
            "label": {"card": 2, 
                      "dataType": [1]},
            "display": {"card": 2, 
                        "dataType": [1]},
            "citation": {"card": 2, 
                         "dataType": [1]},
            "url": {"card": 2, 
                    "dataType": [1]},
            "document": {"card": 2, 
                         "dataType": ["Attachment"]},
            "resource": {"card": 2, 
                         "dataType": []} // canonical(Any)
          },
          "TriggerDefinition": {
            "type": {"card": 0, 
                     "dataType": [1]},
            "name": {"card": 2, 
                     "dataType": [1]},
            "timing": {"card": 2, 
                      "dataType": ["TimingTiming"],
                      "setDataType": true},
            "data": {"card": 3, 
                     "dataType": ["DataRequirement"]},
            "condition": {"card": 2, 
                          "dataType": ["Expression"]}
          },
          "TimingTiming": {
            "timingTiming": "Timing",
            "timingReference": "Reference", // Reference to Schedule
            "timingDate": 1,
            "timingDateTime": 1
          },
          "Dosage": {
            "sequence": {"card": 2, 
                         "dataType": [1]},
            "name": {"card": 2, 
                     "dataType": [1]}
          },
          "Organization": {

          },
          "Patient": {
            "deceased": {"card": 2, 
                      "dataType": ["Deceased"],
                      "setDataType": true}
          },
          "Deceased": {
            "deceasedBoolean": 1, // poner tipo string 
            "deceasedDateTime": 1 // poner tipo string 
          }, 
          "StructureDefinition": {

          }
        }
      }
    },
    mounted() {
      console.log(this.sample);

    },
    methods: {
      isArray(myArray){
        return myArray.constructor === Array;
      },
      isObject(myObj){
        return myObj.constructor === Object;
      },
      errorDT(dataType, section, nameSection){
        console.log('DT: ', dataType);
        console.log('pointer: ', section);
        console.log('nameS: ', nameSection);
        for( let elem of dataType ){
          console.log('elem: ', elem, 'typeof: ', typeof elem)
          if (typeof elem == 'object' || typeof elem == 'string'){
            let v;
            if(typeof elem == 'string'){
              elem = this.formats[elem];
            }
            if(this.isArray(section)){
              console.log("LLEGÓ UN ARRAY")
            }
            //v = 
            this.validateSection(elem, section, nameSection, true);
            
            //if (v == true){
            //  console.log(elem, 'fue aprobado')
            //  return false // coincidió el formato
            //}
          }
          else if (elem == 1){
            console.log('pointer: ', section, ' type: ', typeof section)
            if( typeof section == 'string' || typeof section == 'boolean'){
              // coincidió el formato:
              console.log('coincidio formato')
              //return false // se termina
            }
            else{
              this.formatErrors.push(nameSection);
              //return true;
            }
          }
        }
        //console.log('formato incorrecto')
        //this.formatErrors.push(nameSection);
        //return true; // en caso de que NO haya error, retornará antes con false
      },
      validateSection(fields, section, nameSection, flag){
        for( let param in fields){
          let data = fields[param];
          console.log('data: ', param , ': ', data)
          let card = data.card;
          let setDataType = data.setDataType;
          let dataType = data.dataType;
          let pointer = section[param];
          console.log("pointer: ", pointer, 'tipo: ', typeof pointer)
          console.log('chequeando cardinalidad')
          //check cardinality:
          if ( (card == 0 || card == 1) && pointer == undefined ){ // no debe ser undefined
            console.log('if 1')
            if (flag){
              return false;
            }
            this.missingErrors.push(nameSection + "-" + param);
          }
          // no pueden haber más de uno de los sgtes campos
          else if ( ( pointer != undefined) && (card == 0 || card == 2) && this.isArray(pointer) ){ // no debe ser array pq eso da chanche a que sea más de uno y esta cardinalidad solo permite 0..1 o 1..1
            console.log('else if 1')
            if (flag){
              return false;
            }
            if (pointer.length == 1){
              this.formatErrors.push(nameSection + "-" + param);
            }
            else{
              this.cardErrors.push(nameSection + "-" + param);
            }
          }
          else if ( ( pointer != undefined ) && (card == 3 || card == 1) && (this.isArray(pointer)) && (pointer.length == 0) ){
            this.cardErrors.push(nameSection + "-" + param);
          }

          console.log('chequeando datatypes')
          // check dataTypes:
          if (pointer != undefined ){
            if (setDataType != true){
              //// if (dataType == 1){ // es de tipo string
                // only one data

              // CORROBORO QUE POINTER SEA DE ALGUNO DE LOS TIPOS DE DATATYPE
              if ( (card == 0 || card == 2) ){//&&  ( this.errorDT(Array.from(dataType), pointer, nameSection + "-" + param) ) ){ //(typeof pointer != 'string' && typeof pointer != 'boolean') ){
                this.errorDT(Array.from(dataType), pointer, nameSection + "-" + param)
                
                //if (flag){
                 // return false;
                //}
                //this.formatErrors.push(nameSection + "-" + param);
              } 
              // there is an array with data to check
              else if ( (card == 1 || card == 3) ){
                for (let elem of pointer){
                  console.log('elem: ', elem)
                  this.errorDT(Array.from(dataType), elem, nameSection + "-" + param)
                  //if (this.errorDT(Array.from(dataType), elem, nameSection + "-" + param)){
                    //if (flag){
                     // return false;
                    //}
                    //this.formatErrors.push(nameSection + "-" + param);
                    //break
                  //}
                }
              }
            }
            // else {} // when setDataType == true
          }
        }
      },
      validateSection2(fields, section, nameSection){ // fields are documentation.
        for( let param in fields){ //id, meta, etc...
          let data = fields[param]; // [card, tipo y dataType]
          let card = data[0];
          let pointer = section[param]; // parte del ips que estoy revisando
          // chequeo la cardinalidad:
          // no pueden haber 0 de los sgtes campos
          console.log('P: ', param);
          console.log( "chequeo cardinalidad: ", data);
          if ( (card == 0 || card == 1) && pointer == undefined ){ // no debe ser undefined
            this.missingErrors.push(nameSection + "-" + param);}
          // no pueden haber más de uno de los sgtes campos
          else if ( ( pointer != undefined) && (card == 0 || card == 2) && this.isArray(pointer) ){ // no debe ser array pq eso da chanche a que sea más de uno y debe ser minimo 0 y max 1
            this.cardErrors.push(nameSection + "-" + param);}
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
                  this.validateSection2(data[2], pointer, nameSection + "-" + param)
                } 
                else{ //varios datos cada elemento debe ser de tipo {}
                  for( let elem of pointer){
                    if (this.isArray(elem)){
                      console.log("LOOL")
                      this.formatErrors.push(nameSection + '-' + param)
                      break
                    }
                    console.log('fields: ', this.formats[data[2]])
                    console.log('sectionIPS: ', elem)
                    console.log(nameSection + '-' + param)
                    this.validateSection2(data[2], elem, nameSection + '-' + param)
                  }
                }
              }
            }
            else if( typeof data[2] == 'string'){ // 'DataType'
              //separo en unico o varios datos
              console.log('validaré la SUBseccion de: ', param, '---  EN: ', pointer)
              if(card == 0 || card == 2){ //unico dato
                this.validateSection2(this.formats[data[2]], pointer, nameSection + '-' + param)
              }
              else{ //varios datos
                for (let elem of pointer){
                  console.log('fields: ', this.formats[data[2]])
                  console.log('sectionIPS: ', elem)
                  console.log(nameSection + '-' + param)
                  this.validateSection2(this.formats[data[2]], elem, nameSection + '-' + param)

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
          "id": { card: 2,
                  dataType: [1] }, //id
          "meta": { card: 2,
                  dataType: ["Meta"] },
          "implicitRules": { card: 2,
                  dataType: [1] }, //uri
          "language": { card: 2,
                  dataType: [1] }, //code
          "identifier": { card: 0,
                  dataType: ["Identifier"] }, 
          "type": { card: 0,
                  dataType: [1] }, //code
          "timestamp": { card: 0,
                  dataType: [1] }, //instant
          "total": { card: 2,
                  dataType: [1] }, //unsignedInt
          "entry": { card: 1,
                  dataType: [ 
                    {"id": { card: 2,
                              dataType: [1] }, //string
                      "extension": { card: 3,
                              dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                              dataType: ["Extension"] },
                      "link": { card: 3,
                              dataType: [1] }, // link (Bundle) ?? arreglar
                      "fullUrl": { card: 0,
                              dataType: [1] }, 
                      "resource": { card: 2,
                              dataType: ["Resource"] },
                      }]
                  },
          "signature": { card: 2,
                  dataType: ["Signature"] }
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
        this.validateSection(fields, ips, 'Inicio', false);

        if(this.formatErrors.length >0){
          this.dialogErrors = true;
          this.sectionFormat = true;
          if(this.cardErrors.length > 0){
            this.dialogErrors = true;
            this.sectionCard = true;
          }
          if(this.missingErrors.length > 0){
            this.dialogErrors = true;
            this.sectionMissing = true;
          }
          //return;
        }
        //this.validateComposition(ips);
        this.validatePatient(ips);

        this.cardErrors = this.cardErrors.filter((valor, indice) => {
          return this.cardErrors.indexOf(valor) === indice;
        });

        this.formatErrors = this.formatErrors.filter((valor, indice) => {
          return this.formatErrors.indexOf(valor) === indice;
        });

        this.missingErrors = this.missingErrors.filter((valor, indice) => {
          return this.missingErrors.indexOf(valor) === indice;
        });

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
          "id": { card: 2,
                  dataType: [1] },
          "meta": { card: 2,
                  dataType: ["Meta"] }, 
          "implicitRules": { card: 2,
                  dataType: [1] }, // uri
          "language": { card: 2,
                  dataType: [1] }, // code
          "text": { card: 2,
                  dataType: ["Narrative"] }, 
          "contained": { card:3, 
                  dataType: ["Resource"] }, // idk es de tipo Resource
          "versionNumber": { card:3, 
                  dataType: [1] }, // string
          "modifierExtension": { card:3, 
                  dataType: ["Extension"] },
          "identifier": { card:2, 
                  dataType: ["Identifier"] },
          "status": { card:0, 
                  dataType: [1] }, // code
          "type": { card:0, 
                  dataType: ["CodeableConceptIPS"] }, 
          "category": { card:3, 
                  dataType: ["CodeableConcept"] }, //supongo es una lista pero no lo sé
          "subject": { card:0, 
                  dataType: [1] }, // Reference (Patient IPS) 
          "encounter": { card:2, 
                  dataType: [1] }, // es reference (Encounter)
          "date": { card:0, 
                  dataType: [1] }, //dateTime 
          "author": { card:1, 
                  dataType: [1] }, // es reference (varios)
          "title": { card:0, 
                  dataType: [1] }, // string
          "confidentiality": { card:2, 
                  dataType: [1] }, // code
          "attester": { card: 3,  
                        dataType: [
                          {"id": { card: 2,
                                  dataType: [1] },
                          "extension": { card: 3 ,
                                        dataType: ["Extension"] },
                          "modifierExtension": { card: 3 ,
                                        dataType: ["Extension"] },
                          "mode": { card: 0 ,
                                        dataType: [1] }, //code
                          "time": { card: 2 ,
                                        dataType: [1] }, // dateTime
                          "party": { card: 2 ,
                                        dataType: [1] } // Reference (varios)
                        }]},
          "custodian": { card: 2,
                          dataType: [1] }, // es reference
          "relatesTo": { card: 3,  
                          dataType: [
                              {"id": { card: 2,
                                      dataType: [1] },
                              "extension": { card: 3 ,
                                            dataType: ["Extension"] },
                              "modifierExtension": { card: 3 ,
                                            dataType: ["Extension"] },
                              "code": { card: 0 ,
                                            dataType: [1] }, // code
                              "target": { card: 0 ,
                                            dataType: ["Target"],
                                            setDataType: true }
                          }]},
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
          "id": { card: 2, 
                  dataType: [1] }, //id
          "meta": { card: 2, 
                  dataType: ["Meta"] },
          "implicitRules": { card: 2, 
                  dataType: [1] }, // uri
          "language": { card: 2, 
                  dataType: [1] }, // code
          "text": { card: 2, 
                  dataType: ["Narrative"] }, 
          "contained": { card: 3, 
                  dataType: ["Resource"] },
          "extension": { card: 3, 
                  dataType: ["Extension"] },
          "modifierExtension": { card: 3, 
                  dataType: ["Extension"] },
          "identifier": { card: 3, 
                  dataType: ["Identifier"] },
          "active": { card: 2, 
                  dataType: [1] }, //boolean
          "name": { card: 1, 
                  dataType: ["HumanName"] },
          "telecom": { card: 3, 
                  dataType: ["ContactPoint"] },
          "gender": { card: 2, 
                  dataType: [1] }, //code
          "birthDate": { card: 0, 
                  dataType: [1] }, //date
          "deceased": { card: 2,
                      dataType: ["Deceased"],
                      setDataType: true },
          "address": { card: 3, 
                  dataType: ["Address"] },
          "maritalStatus": { card: 2, 
                  dataType: ["CodeableConcept"] },
          "multipleBirth": { card: 2, 
                            dataType: ["MultipleBirth"],
                            setDataType: true }, 
          "photo": { card: 3,
                    dataType: [1] }, //Attachment
          "contact": { card: 3,
                    dataType: [
                      {"id": { card: 2,
                                dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "relationship": { card: 3,
                                dataType: ["CodeableConceptIPS"] },
                      "name": { card: 2,
                                dataType: ["HumanName"] },
                      "telecom": { card: 3,
                                dataType: ["ContactPoint"] },
                      "address": { card: 2,
                                dataType: ["Address"] },
                      "gender": { card: 2,
                                dataType: [1] }, //code
                      "organization": { card: 2,
                                dataType: [1] }, //Reference(Organization)
                      "period": { card: 2,
                                dataType: ["Period"] }
                      }]},
          "communication": { card: 3,
                    dataType: [
                      {"id": { card: 2,
                                dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "language": { card: 0,
                                dataType: ["CodeableConcept"] }, 
                      "preferred": { card: 2,
                                dataType: [1] } //boolean
                      }]},
          "generalPractitioner": { card: 3,
                    dataType: [1] }, //Reference(Organization | Practicioner)
          "managingOrganization": { card: 2,
                    dataType: [1] }, // Reference(Organization)
          "link": { card: 3,
                    dataType: [
                      {"id": { card: 2,
                      dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "other": { card: 0,
                                dataType: [1] }, // Reference(Patient 1 RelatedPerson)
                      "type": { card: 0,
                                dataType: [1] } //code
                      }]}
        };
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
      },
      validateCondition(ips){
        // card: 0: 1..1 // 1: 1..* // 2: 0..1 // 3: 0..*
        // dataType: 1: string // 
        let fields = {
          "id": { card: 2, 
                  dataType: [1] }, //id
          "meta": { card: 2, 
                  dataType: ["Meta"] },
          "implicitRules": { card: 2, 
                  dataType: [1] }, // uri
          "language": { card: 2, 
                  dataType: [1] }, // code
          "text": { card: 2, 
                  dataType: ["Narrative"] }, 
          "contained": { card: 3, 
                  dataType: ["Resource"] },
          "extension": { card: 3, 
                  dataType: ["Extension"] },
          "modifierExtension": { card: 3, 
                  dataType: ["Extension"] },
          "identifier": { card: 3, 
                  dataType: ["Identifier"] },
          "clinicalStatus": { card: 0, 
                  dataType: ["CodeableConceptIPS"] }, 
          "verificationStatus": { card: 2, 
                  dataType: ["CodeableConceptIPS"] },
          "category": { card: 3, 
                  dataType: ["CodeableConceptIPS"] },
          "severity": { card: 2, 
                  dataType: ["CodeableConceptIPS"] }, 
          "code": { card: 0, 
                  dataType: ["CodeableConceptIPS"] }, 
          "bodySite": { card: 3,
                      dataType: ["CodeableConceptIPS"] },
          "subject": { card: 0,
                  dataType: [1] }, //Reference (Patient (IPS))
          "encounter": { card:2, 
                  dataType: [1] }, // es reference (Encounter)
          "onset": { card: 2, 
                  dataType: ["Onset"], // fix add
                  setDataType: true }, 
          "abatement": { card: 2, 
                  dataType: ["Abatement"], // fix add
                  setDataType: true }, 
          "recordedDate": { card:2, 
                  dataType: [1] }, // dateTime
          "recorder": { card:2, 
                  dataType: [1] }, // Reference (varios)
          "asserter": { card:2,  
                  dataType: [1] }, // Reference(varios)
          "stage": { card: 3,
                    dataType: [
                      {"id": { card: 2,
                                dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "summary": { card: 2,
                                dataType: ["CodeableConcept"] },
                      "assessment": { card: 3,
                                dataType: ["HumanName"] }, // Reference (varios)
                      "type": { card: 2,
                                dataType: ["CodeableConcept"] }
                      }]},
          "evidence": { card: 3,
                    dataType: [
                      {"id": { card: 2,
                                dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "code": { card: 3,
                                dataType: ["CodeableConcept"] }, 
                      "detail": { card: 3,
                                dataType: [1] } //Reference(Resource)
                      }]},
          "note": { card: 3,
                    dataType: ["Annotation"] }
        };
        let resource;
        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Condition'){
            resource = obj.resource;
            this.validateSection(fields, resource, 'Condition');
          }
        }
        if( resource == undefined){ // The section Condition was not found
          this.cardErrors.push('Condition');
          return;
        }
      },
      validateMedication(ips){
        // card: 0: 1..1 // 1: 1..* // 2: 0..1 // 3: 0..*
        // dataType: 1: string // 
        let fields = {
          "id": { card: 2, 
                  dataType: [1] }, //id
          "meta": { card: 2, 
                  dataType: ["Meta"] },
          "implicitRules": { card: 2, 
                  dataType: [1] }, // uri
          "language": { card: 2, 
                  dataType: [1] }, // code
          "text": { card: 2, 
                  dataType: ["Narrative"] }, 
          "contained": { card: 3, 
                  dataType: ["Resource"] },
          "extension": { card: 3, 
                  dataType: ["Extension"] },
          "modifierExtension": { card: 3, 
                  dataType: ["Extension"] },
          "identifier": { card: 3, 
                  dataType: ["Identifier"] },
          "code": { card: 0, 
                  dataType: ["CodeableConceptIPS"] }, 
          "status": { card: 2, 
                  dataType: [1] }, // code
          "manufacturer": { card: 2, 
                  dataType: [1] }, // Reference (Organization)
          "form": { card: 2, 
                  dataType: ["CodeableConceptIPS"] }, 
          "amount": { card: 2, 
                  dataType: ["Ratio"] }, 
          "ingredient": { card: 3,
                      dataType: [
                        {"id": { card: 2,
                                dataType: [1] }, //string
                        "extension": { card: 3,
                                  dataType: ["Extension"] },
                        "modifierExtension": { card: 3,
                                  dataType: ["Extension"] },
                        "item": { card: 0,
                                  dataType: ["Item"], //fix add 
                                  setDataType: true },
                        "isActive": { card: 2,
                                  dataType: [1] }, // boolean
                        "strength": { card: 2,
                                  dataType: ["RatioIPS"] }
                      }]},
          "batch": { card: 2,
                  dataType: [
                    {"id": { card: 2,
                                dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "lotNumber": { card: 2,
                                dataType: [1] }, // string
                      "expirationDate": { card: 2,
                                dataType: [1] } // dateTime
                    }] }
        };
        let resource;
        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Medication'){
            resource = obj.resource;
            this.validateSection(fields, resource, 'Medication');
          }
        }
        if( resource == undefined){ // The section Medication was not found
          this.cardErrors.push('Medication');
          return;
        }
      },
      validateAllergy(ips){
        // card: 0: 1..1 // 1: 1..* // 2: 0..1 // 3: 0..*
        // dataType: 1: string // 
        let fields = {
          "id": { card: 2, 
                  dataType: [1] }, //id
          "meta": { card: 2, 
                  dataType: ["Meta"] },
          "implicitRules": { card: 2, 
                  dataType: [1] }, // uri
          "language": { card: 2, 
                  dataType: [1] }, // code
          "text": { card: 2, 
                  dataType: ["Narrative"] }, 
          "contained": { card: 3, 
                  dataType: ["Resource"] },
          "extension": { card: 3, 
                  dataType: ["Extension"] },
          "abatement-datetime": { card: 2,
                  dataType: [1]}, // dateTime
          "modifierExtension": { card: 3, 
                  dataType: ["Extension"] },
          "identifier": { card: 3, 
                  dataType: ["Identifier"] },
          "clinicalStatus": { card: 2, 
                  dataType: ["CodeableConceptIPS"] }, 
          "verificationStatus": { card: 2, 
                  dataType: ["CodeableConceptIPS"] }, // code
          "type": { card: 2, 
                  dataType: [1] }, // code
          "category": { card: 3, 
                  dataType: [1] },  // code
          "criticality": { card: 2, 
                  dataType: [1] }, // code
          "code": { card: 0, 
                  dataType: ["CodeableConceptIPS"] }, 
          "patient": { card: 3,
                      dataType: [1]}, // Reference (Patient(IPS))
          "encounter": { card: 2, 
                  dataType: [1] }, // Reference (Encounter)
          "onset": { card: 2, 
                  dataType: ["Onset"],
                  setDataType: true }, // code
          "recordedDate": { card:2, 
                  dataType: [1] }, // dateTime
          "recorder": { card:2, 
                  dataType: [1] }, // Reference (varios)
          "asserter": { card:2,  
                  dataType: [1] }, // Reference(varios)
          "lastOccurrence": { card: 2, 
                  dataType: [1] }, // dateTime
          "note": { card: 3, 
                  dataType: ["Annotation"] }, 
          "reaction": { card: 3,
                  dataType: [
                    {"id": { card: 2,
                                dataType: [1] }, //string
                      "extension": { card: 3,
                                dataType: ["Extension"] },
                      "modifierExtension": { card: 3,
                                dataType: ["Extension"] },
                      "substance": { card: 2,
                                dataType: ["CodeableConcept"] }, 
                      "manifestation": { card: 1,
                                dataType: ["CodeableConceptIPS"] }, // 
                      "description": { card: 2,
                                dataType: [1] }, // string
                      "onset": { card: 2,
                                dataType: [1] }, // dateTime
                      "severity": { card: 2,
                                dataType: [1] }, // code
                      "exposureRoute": { card: 2,
                                dataType: ["CoadeableConcept"] },
                      "note": { card: 3,
                                dataType: ["Annotation"] }, 
                    }] }
        };
        let resource;
        for( let obj of ips.entry){
          if (obj.resource.resourceType == 'Allergy'){
            resource = obj.resource;
            this.validateSection(fields, resource, 'Allergy');
          }
        }
        if( resource == undefined){ // The section Allergy was not found
          this.cardErrors.push('Allergy');
          return;
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
