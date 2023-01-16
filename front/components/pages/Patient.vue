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
                        <v-icon large="true">mdi-account-alert</v-icon>
                      </v-card>
                    </v-col>
                    <v-col cols="3" class="pa-0 ma-0 text-center"></v-col>
                    <v-col cols="6" class="pa-0 ma-0 text-center">
                      <v-card  class="ma-1 pa-0" elevation="0">
                        <v-row class="pa-0 ma-0">
                          <v-card-title class="ma-0 pa-2 text-center">
                            {{patient.name}}, {{patient.lastName}}
                          </v-card-title>
                        </v-row>
                      </v-card>
                      <v-card  class="ma-1 pa-0" elevation="0">
                        <v-row class="ma-0 pa-0">
                          <v-card-text class="ma-0 pa-2">
                            {{patient.birthDate}}, {{patient.yearsOld}} Años de edad
                          </v-card-text>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row class="ma-1">
                    <v-col cols="12" class="ma-0">
                      <v-card elevation="0">
                        <v-card-title>
                          <v-icon>mdi-allergy</v-icon>
                          Alergias
                          <v-spacer></v-spacer>
                          <v-scale-transition>
                            <v-btn  @click="allergyDetails = true" v-if="!allergyDetails">
                            <v-icon>mdi-chevron-down</v-icon>
                            </v-btn>
                            <v-btn  @click="allergyDetails = false" v-else>
                            <v-icon>mdi-chevron-up</v-icon>
                            </v-btn>
                          </v-scale-transition>
                        </v-card-title>
                        <v-card-text v-if="allergyDetails">
                          <v-list subheader two-line>
                            <v-list-item v-for="allergy in allergies" :key="allergy.name">
                              <v-list-item-avatar>
                                <v-icon >mdi-circle-small</v-icon>
                              </v-list-item-avatar>

                              <v-list-item-content>
                                <v-list-item-title> {{allergy.name}} ({{allergy.code}}) </v-list-item-title>
                                <v-list-item-subtitle>{{allergy.type}} - criticidad: {{allergyLevels[allergy.criticality]}}</v-list-item-subtitle>
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
                           <v-icon>mdi-bacteria</v-icon>
                            Diagnósticos
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                              <v-btn class="lala" @click="seeDetails('allergy')" v-if="!allergyDetails">
                              <v-icon>mdi-chevron-down</v-icon>
                              </v-btn>
                              <v-btn class="lala" @click="hideDetails('allergy')" v-else>
                              <v-icon>mdi-chevron-up</v-icon>
                              </v-btn>
                            </v-scale-transition>
                          </v-card-title>
                        <v-card-text>dg 1</v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row class="ma-1">
                    <v-col cols="12">
                      <v-card elevation="0">
                        <v-card-title>Medicamentos</v-card-title>
                        <v-card-text>med 1</v-card-text>
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
        },
        allergies: [],
        allergyDetails: true,
        allergyLevels: {
          'low': 'bajo',
          'high': 'alto',
          'unable-to-assess': 'incapaz de evaluar',
        },

      }
    },
    mounted() {
      console.log(this.sampleJson);
      this.getPatient();
      console.log(this.patient);
      this.getAllergies();
    },
    methods: {
      getPatient(){
        let resource = this.sampleJson.entry[1].resource;
        let name = resource.name[0].given[0];
        let lastName = resource.name[0].family;
        let gender = resource.gender;
        let birthDate = resource.birthDate;
        let yearsOld = dayjs().diff(birthDate, 'year');
        console.log(dayjs());
        let patient = {
          name: name,
          lastName: lastName,
          gender: gender,
          birthDate: birthDate,
          yearsOld: yearsOld
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
            if(name == undefined){
              name = 'undefined'
            }
            let code = resource.code.coding[0].code;
            let allergy = {
              type: type,
              category: category,
              criticality: criticality,
              name: name,
              code: code
            }
            this.allergies.push(allergy);
            console.log(this.allergies)
          }
        }
      },
      seeDetails(section){
        allergyDetails = true;
        this.$forceUpdate();
      },
      hideDetails(section){
        item.details = false;
        this.$forceUpdate();
      },
    },
    computed: {
      user: getStore("user")
    }
  }
</script>

<style>

</style>
