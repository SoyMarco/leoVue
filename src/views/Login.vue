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
						v-model="nombre"
						autofocus
						prepend-inner-icon="account_circle"
						color="primary"
						label="Nombre"
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
						@keyup.enter="iniciarSesion()"
					>
					</v-text-field>

					<h1>{{ result ? result : "" }}</h1>

					<v-flex class="red--text" v-if="errorM">
						<h2>{{ errorM }}**</h2>
					</v-flex>
				</v-card-text>
				<v-card-text class="px-4 pb-4" style="padding-top: 0px">
					<v-btn
						:loading="btnLoading"
						large
						dark
						class="my-2"
						@click="iniciarSesion()"
						color="#1877f2"
						block
						>Iniciar sesión</v-btn
					>

					<!-- <v-btn
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
                @click="iniciarSesion()"
                color="#42b72a"
                >Token</v-btn
              > 
            </v-flex>
          </v-card-actions>-->
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
	import { LOGIN } from "../graphql/user";

	export default {
		data() {
			return {
				nombre: "",
				password: "",
				errorM: null,
				btnDisabled: false,
				btnLoading: false,
				result: "",
			};
		},
		methods: {
			async iniciarSesion() {
				this.btnLoading = true;
				// Call to the graphql mutation
				const dataLogin = await this.$apollo
					.mutate({
						// Query
						mutation: LOGIN,
						// Parameters
						variables: {
							input: {
								name: this.nombre,
								password: this.password,
							},
						},
					})
					.catch((error) => {
						this.errorM = error.graphQLErrors[0].message;
						this.btnLoading = false;
					});

				if (dataLogin) {
					const { token } = dataLogin.data.login;
 this.$store.dispatch("guardarToken", token);
          this.$router.push({ name: "home" });


					this.btnLoading = false;
				}
			},

			/* LOGIN */
			/*  ingresar() {
      this.desactivarBtn();
      axios
        .post("/usuario/login", { id: this.id, password: this.password })
        .then((res) => {
          return res.data;
        })
        /* Si credenciales son correctas redirige a HOME */
			/* .then((data) => {
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
    }, */

			desactivarBtn() {
				this.btnDisabled = true;
			},
			activarBtn() {
				this.btnDisabled = false;
			},
		},
	};
</script>
