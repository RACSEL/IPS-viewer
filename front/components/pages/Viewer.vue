<template class="ma-0 pa-0">
    <v-card color="secondary" elevation="0" class="ma-0 pa-0">
      <v-card-text color="secondary">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card class="rounded-lg" elevation="0" color="secondary">
                <v-card-text>
                  <v-container>
                    <v-row class="ma-1 pa-3">
                      <v-col cols="6" class="pa-0 ma-0 ">
                        <v-card  class="mb-1 pa-0" elevation="0">
                          <v-row class="pa-0 ma-0">
                            <v-card-title class="ma-0 pa-2 justify-center">
                              <v-icon class="mr-2">mdi-text-box-outline</v-icon>
                              Encabezado
                            </v-card-title>
                          </v-row>
                          <v-row class="ma-0 pa-0">
                            <v-card-text class="ma-0 pa-2">
                              <v-row class="pa-2">
                                {{composition.title}}
                              </v-row>
                              <v-row class="pa-2">
                                Fecha del resumen: {{composition.date}}
                              </v-row>
                              <v-row class="pa-2">
                                Dominio: {{composition.organizationAddress}}
                              </v-row>
                            </v-card-text>
                          </v-row>
                        </v-card>
                      </v-col>
                      <v-col cols="1" class="pa-0 ma-0 text-center"></v-col>
                      <v-col cols="5" class="pa-0 ma-0 text-center">
                        <v-card  class="mb-1 pa-0" elevation="0">
                          <v-row class="pa-0 ma-0">
                            <v-card-title class="ma-0 pa-2 justify-center">
                              {{patient.name}}, {{patient.lastName}}
                              <v-icon v-if="patient.gender == 'female'" class="vertical-center" size="30px">mdi-human-female</v-icon>
                              <v-icon v-else class="vertical-center" size="30px">mdi-human-male</v-icon>
                            </v-card-title>
                          </v-row>
                        </v-card>
                        <v-card class="mt-1 pa-0" elevation="0">
                          <v-row class="ma-0 pa-0">
                            <v-card-text class="ma-0 pa-2">
                              <v-row class="pa-2">
                                Fecha de nacimiento: {{patient.birthDate}}
                              </v-row>
                              <v-row class="pa-2">
                                {{patient.yearsOld}} años. {{patient.country}}
                              </v-row>
                            </v-card-text>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="ma-1">
                      <v-col cols="12" class="ma-0">
                        <v-card elevation="0">
                          <v-card-title>
                            <v-icon class="mr-2">mdi-allergy</v-icon>
                            Alergias
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn  @click="allergiesDetails = true" v-if="!allergiesDetails">
                              <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn  @click="allergiesDetails = false" v-else>
                              <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                          <v-card-text v-if="allergiesDetails">
                            <v-list subheader two-line>
                              <v-list-item v-for="allergy in allergies" :key="allergy.name">
                                <v-list-item-avatar>
                                  <v-icon class="points">mdi-circle-small</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title> {{allergy.name}} ({{allergy.code}}) </v-list-item-title>
                                  <v-list-item-subtitle>{{allergy.type}} - criticidad: {{allergy.criticality}}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="ma-1">
                      <v-col cols="12">
                        <v-card elevation="0">
                          <v-card-title>
                            <v-icon class="mr-2">mdi-bacteria</v-icon>
                            Diagnósticos / Problemas activos
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn  @click="conditionsDetails = true" v-if="!conditionsDetails">
                                <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn  @click="conditionsDetails = false" v-else>
                                <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                          <v-card-text v-if="conditionsDetails">
                            <v-list subheader two-line>
                              <v-list-item v-for="condition in conditions" :key="condition.name">
                                <v-list-item-avatar>
                                  <v-icon class="points">mdi-circle-small</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title> {{condition.name}} ({{condition.code}}) </v-list-item-title>
                                  <v-list-item-subtitle>{{condition.year}}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="ma-1">
                      <v-col cols="12">
                        <v-card elevation="0">
                          <v-card-title>
                            <v-icon class="mr-2">mdi-bacteria</v-icon>
                            Diagnósticos / Problemas pasados
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn  @click="pastConditionsDetails = true" v-if="!pastConditionsDetails">
                                <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn  @click="pastConditionsDetails = false" v-else>
                                <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                          <v-card-text v-if="pastConditionsDetails">
                            <v-list subheader two-line>
                              <v-list-item v-for="pastCondition in pastConditions" :key="pastCondition.name">
                                <v-list-item-avatar>
                                  <v-icon class="points">mdi-circle-small</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title>{{pastCondition.year}}: {{pastCondition.name}} ({{pastCondition.code}})</v-list-item-title>
                                  <v-list-item-subtitle>{{pastCondition.explanation}}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="ma-1">
                      <v-col cols="12">
                        <v-card elevation="0">
                          <v-card-title>
                            <v-icon class="mr-2">mdi-pill</v-icon>
                            Medicamentos activos
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn  @click="medicationsDetails = true" v-if="!medicationsDetails">
                                <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn  @click="medicationsDetails = false" v-else>
                                <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                          <v-card-text v-if="medicationsDetails">
                            <v-list subheader two-line>
                              <v-list-item v-for="medication in medications" :key="medication.name">
                                <v-list-item-avatar>
                                  <v-icon class="points">mdi-circle-small</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title> {{medication.name}} ({{medication.code}}) </v-list-item-title>
                                  <v-data-table
                                    v-if="medication.dosage != false"
                                    dense
                                    :headers="dosageHeaders"
                                    :items="medication.dosage"
                                    item-key="unit"
                                    class="elevation-1"
                                  ></v-data-table>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="ma-1">
                      <v-col cols="12">
                        <v-card elevation="0">
                          <v-card-title>
                            <v-icon class="mr-2">mdi-needle</v-icon>
                            Inmunizaciones
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn  @click="immunizationsDetails = true" v-if="!immunizationsDetails">
                                <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn  @click="immunizationsDetails = false" v-else>
                                <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                          <v-card-text v-if="immunizationsDetails">
                            <v-list subheader two-line>
                              <v-list-item v-for="immunization in immunizations" :key="immunization.id">
                                <v-list-item-avatar>
                                  <v-icon class="points">mdi-circle-small</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title v-if="immunization.doseQuantity != 'indefinido'"> {{immunization.vaccineCode}}, {{immunization.doseQuantity}} - ({{immunization.status}}) </v-list-item-title>
                                  <v-list-item-title v-else> {{immunization.vaccineCode}} - ({{immunization.status}}) </v-list-item-title>
                                  <v-list-item-subtitle> fecha: {{immunization.date}} - vía de administración: {{immunization.route}}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="ma-1">
                      <v-col cols="12">
                        <v-card elevation="0">
                          <v-card-title>
                            <v-icon class="mr-2">mdi-pill</v-icon>
                            Observaciones
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn  @click="observationsDetails = true" v-if="!observationsDetails">
                                <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn  @click="observationsDetails = false" v-else>
                                <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                          <v-card-text v-if="observationsDetails">
                            <v-data-table
                              :headers="observationHeaders"
                              :items="observations"
                              :items-per-page="10"
                              class="elevation-1"
                            ></v-data-table>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
</template>

<script>
  import {getStore} from "../../services/store.service";
  import sample from "../../utils/sample.json"
  import * as dayjs from 'dayjs';
  export default {
    name: "Viewer",
    data() {
      return {
        patient: {
          name: undefined,
          lastName: undefined,
          gender: undefined,
          birthDate: undefined,
          yearsOld: undefined,
          country: undefined,
        },
        composition: {},
        allergies: [],
        allergiesDetails: true,
        allergyLevels: {
          'low': 'bajo',
          'high': 'alto',
          'unable-to-assess': 'incapaz de evaluar',
        },
        conditions: [],
        conditionsDetails: true,
        pastConditions: [],
        pastConditionsDetails: true,
        conditionsStatus: {
          'active': 'activo',
          'remission': 'remisión',
          'recurrence': 'recurrencia',
          'relapse': 'recaída',
          'inactive': 'inactivo',
          'resolved': 'resuelto',
        },
        conditionsSeverity: {
          'severe': 'severo',
          'moderate': 'moderado',
          'mild': 'leve',
        },
        medications: [],
        dosages: {},
        medicationsDetails: true,
        immunizations: [],
        immunizationsDetails: true,
        observations: [],
        observationsDetails: true,
        observationHeaders: [
          {
            text: 'Nombre',
            align: 'start',
            sorteable: false,
            value: 'name',
          },
          {text: 'Fecha', value: 'date'},
          {text: 'Valor', value: 'value'},
          {text: 'Categoría', value: 'category'}
        ],
        dosageHeaders: [
          {
            //text: 'Vía de administración',
            align: 'start',
            sorteable: false,
            //value: 'route'
          },
          {text: 'Vía de adinistración', value: 'route'},
          {text: 'Cantidad', value: 'count'},
          {text: 'Unidad', value: 'unit'},
          {text: 'Frecuencia cantidad', value: 'doseQuantity'},
          {text: 'Frecuencia período', value: 'periodUnit'},
        ],
      }
    },
    mounted() {
      console.log(this.IPSvalidated);
      this.getComposition();
      this.getPatient();
      this.getAllergies();
      this.getConditions();
      this.getDosages();
      this.getMedications();
      this.getImmunizations();
      this.getObservations();
    },
    methods: {
      getComposition(){
        let address = 'indefinido';
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'Composition'){
            let resource = obj.resource;
            let date = 'indefinido';
            let title = 'indefinido';
            try{
              date = resource.date;
            }
            catch(e){}
            try{
              title = resource.title;
            }
            catch(e){}
            this.composition = {
              date: date,
              title: title,
            }
          }
          if (obj.resource.resourceType == 'Organization' & address=='indefinido'){
            let resource = obj.resource;
            try{
              let city = resource.address[0].city;
              let country = resource.address[0].country;
              address = city + ', ' + country;
            }
            catch(e){}
            this.composition.organizationAddress = address;
          }   
        }
      },
      getPatient(){
        let resource = this.IPSvalidated.entry[1].resource;
        let name = resource.name[0].given[0];
        let lastName = resource.name[0].family;
        let gender = resource.gender;
        let birthDate = resource.birthDate;
        let yearsOld = dayjs().diff(birthDate, 'year');
        let country = resource.address[0].country;
        let patient = {
          name: name,
          lastName: lastName,
          gender: gender,
          birthDate: birthDate,
          yearsOld: yearsOld,
          country: country,
        }
        this.patient = patient;
      },
      getAllergies(){
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'AllergyIntolerance'){
            let resource = obj.resource;
            let type = resource.type;
            let category = resource.category[0];
            let criticality = resource.criticality;
            let name = resource.code.coding[0].display;
            let code = resource.code.coding[0].code;
            if(type == 'allergy'){
              type = 'alergia'
            }
            else{
              if( type.length > 13){
                let underlyingMechanism = type.substring(11);
                type = 'intolerancia' + underlyingMechanism
              }
              else{
                type = 'intolerancia'
              }
            }
            if(name == undefined){
              name = 'indefinido'
            }
            criticality = this.allergyLevels[criticality]
            let allergy = {
              type: type,
              category: category,
              criticality: criticality,
              name: name,
              code: code
            }
            this.allergies.push(allergy);
          }
        }
      },
      getConditions(){
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'Condition'){
            let resource = obj.resource;
            let name = resource.code.coding[0].display;
            let code = resource.code.coding[0].code;
            let status = resource.clinicalStatus.coding[0].code; //active, remission, recurrence, relapse, inactive, resolved
            let category = resource.category[0].coding[0].display; //'Problem'
            let severity = resource.severity.coding[0].display; //severe, moderate, mild
            let year = resource.onsetDateTime;
            let explanation = 'indefinido';

            try{
              explanation = resource.code.coding[0].extension[0].extension[1].valueString;
            }
            catch(e){}
            
            status = this.conditionsStatus[status];
            severity = this.conditionsSeverity[severity];
            let condition = {
              name: name,
              code: code,
              status: status,
              severity: severity,
              year: year,
              explanation: explanation
            }
            if(status == 'activo'){
              this.conditions.push(condition);
            }
            else{
              this.pastConditions.push(condition);
            }
          }
        }
      },
      getMedications(){
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'Medication'){
            let resource = obj.resource;
            let medication = {}
            let id = resource.id;
            let dosage = false;
            for( let med of resource.code.coding){
              let name = med.display;
              let code = med.code;
              medication = {
                name: name,
                code: code,
                dosage: dosage,
              }
              this.medications.push(medication);
            }
            if(id in this.dosages){
              //cambiamos el valor de dosage a true en el ultimo med agregado
              medication.dosage = [this.dosages[id]];
              this.medications[this.medications.length-1] = medication;
            }

          }
        }
      },
      getDosages(){
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'MedicationStatement'){
            let resource = obj.resource;
            let medicationReference = resource.medicationReference.reference;
            const re = /(http.*\/)/;
            medicationReference = medicationReference.replace(re, "");
            try{
              let count = resource.dosage[0].timing.repeat.count;
              let periodUnit = resource.dosage[0].timing.repeat.periodUnit;
              let route = resource.dosage[0].route.coding[0].display;
              let doseQuantity = resource.dosage[0].doseAndRate[0].doseQuantity.value;
              let unit = resource.dosage[0].doseAndRate[0].doseQuantity.unit;
              let dosage = {
                count: count,
                periodUnit: periodUnit,
                route: route,
                doseQuantity: doseQuantity,
                unit: unit,
              }
              this.dosages[medicationReference] = dosage;
            }
            catch(e){
            }
          }
        }
      },
      getObservations(){
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'Observation'){
            let resource = obj.resource;
            let name = 'indefinido'
            let date = 'indefinido'
            let value = 'indefinido'
            let category = 'indefinido'
            let code = ''
            try{
              name = resource.code.coding[0].display;
            }
            catch(e){}
            try{ 
              date = resource.effectiveDateTime;
            } 
            catch(e){}
            try{
              value = resource.valueCodeableConcept.coding[0].display;
            }
            catch(e){}
            try{
              category = resource.category[0].coding[0].code;
            }
            catch(e){}
            try{
              code = resource.code.coding[0].code;
            }
            catch(e){
              try{
                code = resource.code.text;
              }
              catch(e){}
            }
            let observation = {
              name: name + ' (' + code + ')',
              category: category,
              date: date,
              value: value,
              code: code,
            }
            this.observations.push(observation);
            
          }
        }
      },
      getImmunizations(){
        for( let obj of this.IPSvalidated.entry){
          if (obj.resource.resourceType == 'Immunization'){
            let resource = obj.resource;
            let id = 0;
            let status = 'indefinido';
            let vaccineCode = 'indefinido';
            let date = 'indefinido';
            let route = 'indefinido';
            let doseQuantity = 'indefinido';
            try{
              id = resource.id;
            }
            catch(e){}
            try{
              status = resource.status;
            }
            catch(e){}
            try{
              vaccineCode = resource.vaccineCode.coding[0].code;
            }
            catch(e){}
            try{
              let display = resource.vaccineCode.coding[0].display;
              if(display != undefined){
                vaccineCode =  vaccineCode + ' ' + display;
              }
            }
            catch(e){}
            try{
              date = resource.occurrenceDateTime;
            }
            catch(e){}
            try{
              route = resource.route.coding[0].display;
            }
            catch(e){}
            try{
              doseQuantity = resource.doseQuantity.value + " " + resource.doseQuantity.code;
            }
            catch(e){}
            let immunization = {
              id: id,
              status: status,
              vaccineCode: vaccineCode,
              date: date,
              route: route,
              doseQuantity: doseQuantity,
            };
            this.immunizations.push(immunization);
          }
        }
      },
    },
    computed: {
      user: getStore("user"),
      IPSvalidated: getStore("ips")
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
