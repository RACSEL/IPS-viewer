<template>
  <v-card elevation="0" class="ma-0 pa-4 remove-error" color="secondary">
    <v-card-text class="ma-0 pa-0">
      <v-row class="pa-5" justify="center">
        <v-col cols="5" class="pa-5 pb-0">
          <v-responsive class="mx-auto">
            <v-textarea
                outlined
                v-model="ips"
                label="Pega el IPS aquí"
                :error-messages="warnings"
            ></v-textarea>
          </v-responsive>  
        </v-col>
        <v-col cols='2' class="pa-5">
          <v-responsive class="mx-auto">
            <v-card-text class="pa-0 py-3 pb-4" >
                <v-btn width="140px" color="primary" 
                v-bind="attrs" 
                v-on="on" @click="validateIPS()">Ver IPS</v-btn>
            </v-card-text>
          </v-responsive>
          <v-responsive class="mx-auto">
            <v-card-text class="pa-0 pt-4 pb-3">
              <v-btn width="140px" color="error" @click="clearInput()">Borrar</v-btn>
            </v-card-text>
          </v-responsive>
        </v-col>
        <v-col cols="3" class="pa-3">
          <v-responsive class="mx-auto" max-width="auto">
            <v-text-field
              class="pt-2"
              v-model="bundleNumber"
              outlined
              clearable
              label="Ó ingresa ID del Bundle IPS"
            ></v-text-field>
          </v-responsive>        
          <v-card-text class="pa-0">
              <v-btn block color="primary" 
              v-bind="attrs" 
              v-on="on" @click="fetchFromHapiFhir(bundleNumber)">Buscar IPS</v-btn>
          </v-card-text>
        </v-col>
        <v-col cols='10' class="pa-5 pt-0" v-if="this.alertWarning">
          <v-alert
          class="pa-3 size-font-alert"
            closable
            density="compact"
            type="warning"
            text=""
          >
          Advertencia: El recurso de inmunizaciones no se encuentra en el IPS
          </v-alert>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-dialog
          v-model="dialogErrors"
          width="500"
        >
        <v-responsive class="mx-auto">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Problemas con IPS
            </v-card-title>
            <v-card-text>
              <v-card-subtitle class="pa-0 py-3" v-if="missingErrors.length > 0">
                Los siguientes campos faltantes son requeridos:
              </v-card-subtitle>
              <v-list-item v-for="error in missingErrors" :key="error">
                <v-list-item-content class="py-2">
                  <v-list-item-title>- {{ error }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-card-subtitle class="pa-0 py-3" v-if="cardErrors.length > 0">
								{{cardErrors}}
                Los siguientes campos no cumplen con la cardinalidad correcta:
              </v-card-subtitle>
              <v-list-item v-for="error in cardErrors" :key="error">
                <v-list-item-content class="py-2">
                  <v-list-item-title>- {{ error }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-card-subtitle class="pa-0 py-3" v-if="formatErrors.length > 0">
                Los siguientes campos no cumplen con el formato correcto:
              </v-card-subtitle>
              <v-list-item v-for="error in formatErrors" :key="error">
                <v-list-item-content class="py-2">
                  <v-list-item-title>- {{ error }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialogErrors = false">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
          </v-responsive>
        </v-dialog>
        <v-responsive class="mx-auto">
        <v-snackbar v-model="dialogValid" :timeout="2000" color="blue-gray" rounded="pill">
            IPS válido
        </v-snackbar>
        </v-responsive>
      </div>
    </v-card-text>
    <v-row class="px-11 full-height" v-if="this.validate">
      <v-col cols=5 class="pa-0 json-viewer-scroll" v-if="jsonData != undefined">
        <div class="ma-1 pa-3">
          <json-viewer :value="jsonData"  :expand-depth=5  preview-mode=true></json-viewer>
        </div>
      </v-col>
      <v-col cols=7 class="pa-0 json-viewer-scroll" >
        <viewer class="pa-0" ref="viewerValidate" />
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
  import {getStore, setStore} from "../../services/store.service";
  import Viewer from '../pages/Viewer.vue';
  import JsonViewer from 'vue-json-viewer';
  export default {
    name: "UploadIPS",
    components: { Viewer, JsonViewer },
    data(){
      return{
        jsonData: undefined,
        validate: false,
        ips: "",
        bundleNumber: "",
        missingErrors: [],
        cardErrors: [],
        formatErrors: [],
        modelErrors: false,
        dialogErrors: false,
        dialogValid: false,
        alertWarning: false,
    	};
  	},
  mounted() {
  },
  methods: {
    isArray(myArray) {
      return myArray.constructor === Array;
    },
    isObject(myObj) {
      return myObj.constructor === Object;
    },
    async validateIPS() {
      setStore("ips", null);
      this.validate = false;
      this.cardErrors = [];
      this.formatErrors = [];
      this.missingErrors = [];
      this.warnings = [];
			this.alertWarning = false;
      let ips;
      try {
        ips = JSON.parse(this.ips);
        if (!this.isObject(ips)) {
          this.formatErrors.push("IPS no cumple con formato JSON");
          this.dialogErrors = true;
          return;
        }
      } catch (e) {
				console.log("catch");
				this.formatErrors.push("IPS no cumple con formato JSON");
				this.dialogErrors = true;
				return;
      }
			let res = await this.$service("api/ips-validator").create({'ips': ips});
			console.log(res);
			if (res.validate == false){
				this.validate = false;
				this.cardErrors = res.cardinalErrors
				this.formatErrors = res.formatErrors;
				this.warnings = res.warnings;
				this.missingErrors = res.missingErrors;
				this.dialogErrors = true;
			}
			else{
				console.log("PERFECT");
                                this.jsonData = ips;
        this.dialogValid = true;
        setStore("ips", ips);
        this.validate = true;
			}
			if (res.warnings.length > 0){
				console.log('INMU')
				this.alertWarning = true;
			}
			
    },
    clearInput() {
      this.ips = "";
      setStore("ips", null);
      this.validate = false;
			this.alertWarning = false;
                        this.jsonData = undefined;
    },
    fetchFromHapiFhir(bundleNumber){
        // Simple GET request using fetch from Hapi Fhir server
        let ipsBundle;
        fetch(`http://lacpass.create.cl:8080/fhir/Bundle/${bundleNumber}?_format=json`)
        .then((response) => response.json())
        .then((result) => {
        console.log("Success:", result);
        ipsBundle = JSON.stringify(result);
        this.validateIPS(ipsBundle)
        })
        .catch((error) => {
        console.error("Error:", error);
        });
      },
  },
  computed: {
    user: getStore("user"),
  },
  watch: {
    
  },
};
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
.size-font-alert {
   font-size: 14px;
}
.json-viewer-scroll {
  overflow: auto;
  height: 100%;
}
.full-height {
  height: 58vh;
}
.remove-error {
  margin: 0px!important;
}
</style>
