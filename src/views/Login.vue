<template coloe>
  <v-layout align-center justify-center class="bg_animate">
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card color="#fffffff7" elevation="24" shaped>
        <v-toolbar dark color="#000058">
          <v-toolbar-title class="flex text-center">
            <v-icon large>admin_panel_settings</v-icon>
            Ingresa a tu cuenta</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text color="#000058" style="padding-bottom: 0px">
          <v-text-field
            v-model="id"
            autofocus
            prepend-inner-icon="mail_outline"
            color="primary"
            label="Corrreo electrónico"
            required
            outlined
            rounded
          >
          </v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            prepend-inner-icon="lock"
            color="primary"
            label="Contraseña"
            required
            outlined
            rounded
            @keyup.enter="ingresar()"
          >
          </v-text-field>
          <v-flex class="red--text" v-if="errorM">
            {{ errorM }}
          </v-flex>
        </v-card-text>
        <v-card-text class="px-4 pb-4" style="padding-top: 0px">
          <v-btn
            :loading="btnDisabled"
            large
            dark
            class="my-2"
            @click="ingresar()"
            color="#1877f2"
            block
            >Iniciar sesión</v-btn
          >

          <v-btn
            :disabled="btnDisabled"
            small
            class="my-2"
            @click="ingresar()"
            block
            plain
            color="#1877f2"
            >¿Olvidaste tu contraseña?</v-btn
          >

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex text-xs-right>
              <v-btn
                :disabled="btnDisabled"
                large
                dark
                class="my-2"
                @click="ingresar()"
                color="#42b72a"
                >Crear cuenta nueva</v-btn
              >
            </v-flex>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
/* COMIENZA CODIGO */
import axios from "axios";
export default {
  data() {
    return {
      id: "",
      password: "",
      errorM: null,
      btnDisabled: false,
    };
  },
  methods: {
    /* LOGIN */
    ingresar() {
      this.desactivarBtn();
      axios
        .post("/usuario/login", { id: this.id, password: this.password })
        .then((res) => {
          return res.data;
        })
        /* Si credenciales son correctas redirige a HOME */
        .then((data) => {
          this.$store.dispatch("guardarToken", data.tokenReturn);
          this.$router.push({ name: "home" });
        })
        .catch((error) => {
          this.activarBtn();
          console.log(error);
          this.errorM = null;
          if (error.response.status == 404) {
            this.errorM =
              "No existe el usuario o las credenciales son incorrectas.";
          } else {
            this.errorM = "Ocurrió un error con el servidor.";
          }
        });
    },

    desactivarBtn() {
      this.btnDisabled = true;
    },
    activarBtn() {
      this.btnDisabled = false;
    },
  },
};
</script>
