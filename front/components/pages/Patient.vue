<template>
  <v-card color="secondary" elevation="0">
    <v-card-text color="secondary">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-lg" elevation="0" color="secondary">
              <v-card-text>
                <v-container>
                  <v-row class="ma-1 pa-3">
                    <v-col cols="3" class="pa-0 ma-0 text-center" >
                      <v-card height="100%" class="ma-0 pa-0 text-center" elevation="0">
                        <v-icon large="true" v-if="patient.gender == 'female'" class="vertical-center" x-large>mdi-human-female</v-icon>
                        <v-icon large="true" v-else class="vertical-center" size="large">mdi-human-male</v-icon>
                      </v-card>
                    </v-col>
                    <v-col cols="3" class="pa-0 ma-0 text-center"></v-col>
                    <v-col cols="6" class="pa-0 ma-0 text-center">
                      <v-card  class="ma-1 pa-0" elevation="0">
                        <v-row class="pa-0 ma-0">
                          <v-card-title class="ma-0 pa-2 justify-center">
                            {{patient.name}}, {{patient.lastName}}
                          </v-card-title>
                        </v-row>
                      </v-card>
                      <v-card class="ma-1 pa-0" elevation="0">
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
                            <v-list-item v-for="condition in conditions" :key="conditions.name">
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
                            <v-list-item v-for="medication in medications" :key="medications.name">
                              <v-list-item-avatar>
                                <v-icon class="points">mdi-circle-small</v-icon>
                              </v-list-item-avatar>

                              <v-list-item-content>
                                <v-list-item-title> {{medication.name}} ({{medication.code}}) </v-list-item-title>
                                <v-list-item-subtitle></v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
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
    data() {
      return {
        sampleJson: sample,
        patient: {
          name: undefined,
          lastName: undefined,
          gender: undefined,
          birthDate: undefined,
          yearsOld: undefined,
          country: undefined,
        },
        allergies: [],
        allergiesDetails: true,
        allergyLevels: {
          'low': 'bajo',
          'high': 'alto',
          'unable-to-assess': 'incapaz de evaluar',
        },
        conditions: [],
        conditionsDetails: true,
        inactiveConditions: [],
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
        medicationsDetails: true,
      }
    },
    mounted() {
      console.log(this.sampleJson);
      this.getPatient();
      this.getAllergies();
      this.getConditions();
      this.getMedications();
    },
    methods: {
      getPatient(){
        let resource = this.sampleJson.entry[1].resource;
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
        for( let obj of this.sampleJson.entry){
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
        for( let obj of this.sampleJson.entry){
          if (obj.resource.resourceType == 'Condition'){
            let resource = obj.resource;
            let name = resource.code.coding[0].display;
            let code = resource.code.coding[0].code;
            let status = resource.clinicalStatus.coding[0].code; //active, remission, recurrence, relapse, inactive, resolved
            let category = resource.category[0].coding[0].display; //'Problem'
            let severity = resource.severity.coding[0].display; //severe, moderate, mild
            let year = resource.onsetDateTime;
            
            status = this.conditionsStatus[status];
            severity = this.conditionsSeverity[severity];
            let condition = {
              name: name,
              code: code,
              status: status,
              severity: severity,
              year: year,
            }
            if(status == 'activo'){
              this.conditions.push(condition);
            }
            else{
              this.inactiveConditions.push(condition);
            }
          }
        }
      },
      getMedications(){
        for( let obj of this.sampleJson.entry){
          if (obj.resource.resourceType == 'Medication'){
            let resource = obj.resource;
            console.log(resource.code.coding)
            for( let med of resource.code.coding){
              let name = med.display;
              let code = med.code;
              let medication = {
                name: name,
                code: code,
              }
              this.medications.push(medication);
            }
          }
        }
      }
    },
    computed: {
      user: getStore("user")
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
