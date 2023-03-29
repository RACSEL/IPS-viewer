<template>
  <v-app id="inspire">
    <v-app-bar clipped-left dense color="primary" app fixed dark>
      <v-toolbar-title class="ml-0">
        <v-img width="80" src="lacpass.png"></v-img>
      </v-toolbar-title>
      <v-spacer/>
      <v-icon color="white" v-if="!darkMode">mdi-white-balance-sunny</v-icon>
      <v-icon color="white" v-else>mdi-weather-night</v-icon>
      <v-switch class="ml-2" inset v-model="darkMode" color="white" @change="toggleDarkMode" hide-details />
    </v-app-bar>
    <v-main>
      <v-container fluid class="min-height-100 pa-0 secondary">
        <upload-i-p-s/>
      </v-container>
      <global-toast/>
    </v-main>
  </v-app>
</template>

<script>
  import GlobalToast from "./utils/GlobalToast";
  import UploadIPS from "./pages/UploadIPS";

  export default {
    components: {UploadIPS, GlobalToast},
    data() {
      return {
        /**
         *  Number that represents the current view selected.
         */
        selectedTab: 0,
        /**
         *  Used when loading the role of the user.
         */
        loading: false,
        /**
         * Knows when a user is already logged in.
         **/
        loggedIn: false,
        darkMode: false
      }
    },
    mounted() {

    },
    created() {
      this.$vuetify.theme.dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode = this.$vuetify.theme.dark;
    },
    methods: {
      toggleDarkMode(){
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      }
    },
    computed: {

    }
  }
</script>

<style scoped>

  .navigation-text {
    font-weight: bold;
    color: white;
    line-height: 26px;
  }

  .min-height-100{
    min-height: calc(100vh - 80px);
    background-color: #F5F6FA;
  }

  .footer-app {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10px;
  }

  .footer-text {
    font-size: xx-small;
    font-weight: 500;
  }

  .color-primary {
    color: var(--v-primary-base);
  }
  .message-content {
    width: 100%;
  }

  .img-white{
    filter: saturate(0) brightness(10);
  }
</style>
