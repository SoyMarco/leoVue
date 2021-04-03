<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template>
          <v-list-item :to="{ name: 'home' }">
            <v-list-item-action>
              <v-icon>checkroom
</v-icon>
            </v-list-item-action>
            <v-list-item-title> Apartados </v-list-item-title>
          </v-list-item>
        </template>

        <template>
          <v-list-item :to="{ name: 'home' }">
            <v-list-item-action>
              <v-icon>
sentiment_very_satisfied</v-icon>
            </v-list-item-action>
            <v-list-item-title> Clientes </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <v-row>
        <v-col xs="3" sm="3" md="3">
          <v-toolbar-title  class="ml-0 pl-3">
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
              v-if="logueado"
            ></v-app-bar-nav-icon>

            <v-avatar
              color="primary"
              size="40"
              @click="goHome"
              style="cursor: pointer"
            >
              <v-img :src="require('@/assets/png/logo.png')"></v-img>
            </v-avatar>

            <span class="hidden-sm-and-down">Bazar Leo</span>
          </v-toolbar-title>
        </v-col>

        <v-col xs="6" sm="6" md="6">
        <!--  <Busqueda/> -->
        </v-col>
        <v-col xs="2" sm="2" md="2" align="right" class="alineados">
          
          <span class="hidden-sm-and-down">Vendedor:</span>
           <h2>Marco</h2>
        </v-col>
        <v-col xs="1" sm="1" md="1" align="right">
          
         
          <v-btn @click="salir()" icon v-if="logueado">
            <v-icon>logout</v-icon>Salir
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>

    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              Marco ASR &copy;2021
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: false,
  }),
  computed: {
    logueado() {
      return this.$store.state.usuario;
    },
     CrudCitasVue() {
      return true;
    },
  },

  methods: {
    salir() {
      this.$store.dispatch("salir");
    },
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
.busqueda {
  padding-top: 35px;
  height: 50px !important;
}
.v-text-field fieldset {
  color: inherit;
  padding-top: 35px;
  height: 50px;
}
.alineados{
  display: flex;
  align-items: center;
  place-content: flex-end;
}
.alineados span{
  padding-top: 5px;
  padding-right: 5px;
}
</style>
