<template>
	<v-layout>
		<v-flex>
			<v-dialog v-model="NuevoApartado" class="modalCitaModal" persistent>
				<v-stepper v-model="e1">
					<v-stepper-header>
						<v-stepper-step :complete="e1 > 1" step="1">
							NOMBRE
						</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="e1 > 2" step="2">
							ARTICULOS
						</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step step="3">
							DIO
						</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<!-- NOMBRE DEL CLIENTE -->
						<v-stepper-content step="1">
							<v-card elevation="20">
								<v-card-title>Nombre del cliente</v-card-title>
								<v-card-text color="#000058">
									<v-text-field
										v-model="cliente"
										prepend-inner-icon="sentiment_very_satisfied"
										rounded
										outlined
										autocomplete="off"
										dense
										color="blue darken-1"
										autofocus
										class="precio"
										@keyup.enter="cliente ? (e1 = 2) : ''"
										@keyup.esc="cerrarNuevoApartado"
									>
									</v-text-field>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer
									><v-btn
										style="background: linear-gradient(#D43F3F,#880000);"
										dark
										rounded
										class="cerrar"
										@keyup.esc="cerrarNuevoApartado"
										@click="cerrarNuevoApartado"
									>
										<v-icon>close</v-icon>
										Cancelar
									</v-btn>
									<v-btn
										:disabled="btnDisabled"
										:loading="btnLoading"
										style="background: linear-gradient(#32A632,#005800);"
										dark
										rounded
										class="font-weight-bold"
										@click="cliente ? (e1 = 2) : ''"
									>
										<v-icon> skip_next</v-icon>
										Sigueinte
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-stepper-content>

						<v-stepper-content step="2" class="sinTop">
							<v-card>
								<v-card-title class="sinTop">
									<h2>{{ cliente }}</h2>
								</v-card-title>
								<v-card-text>
									<ProductosApartado
										componente="ProductosApartado"
										v-on:e1PA="stepHijo"
										v-on:dataPA="dataProductos"
									/>
								</v-card-text>
							</v-card>
						</v-stepper-content>

						<v-stepper-content step="3">
							<v-card elevation="20">
								<v-card-title>
									
									<h2>A cuenta</h2> </v-card-title>

								<v-card-subtitle>Ingresa el primer abono</v-card-subtitle>
								<v-card-text color="#000058">
									<v-text-field
										v-model="abono"
										type="number"
										prepend-inner-icon="monetization_on"
										rounded
										autocomplete="off"
										outlined
										dense
										color="green"
										autofocus
										class="precio"
										@keyup.esc="e1 = 2"
									>
									</v-text-field>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										style="background: linear-gradient(#3232A6,#000058);"
										dark
										rounded
										class="cerrar"
										@click="e1 = 2"
										@keyup.esc="e1 = 2"
									>
										<v-icon>skip_previous</v-icon>
										Anterior
									</v-btn>
									<v-btn
										:disabled="btnDisabled"
										:loading="btnLoading"
										style="background: linear-gradient(#32A632,#005800);"
										dark
										rounded
										class="font-weight-bold"
										
									>
										Siguiente
										<v-icon> skip_next</v-icon>
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-dialog>
		</v-flex>
	</v-layout>
</template>
<script>
	import ProductosApartado from "./ProductosApartado";
	export default {
		components: { ProductosApartado },
		data: () => ({
			cantidadAtirulos: 0,
			abono: "",
			cliente: "",
			ProductosApartado: true,
			e1: 1,
			errorMsg: "",
			btnDisabled: false,
			btnLoading: false,
		}),
		computed: {
			NuevoApartado() {
				return this.$store.state.componentes.NuevoApartado;
			},
		},
		watch: {},
		methods: {
			prueba() {},
			cerrarNuevoApartado() {
				this.$store.state.componentes.NuevoApartado = false;
			},
			stepHijo(datos) {
				this.e1 = datos;
			},
			dataProductos(datos) {
				this.cantidadAtirulos = datos.cantidadAtirulos;
				console.log(this.cantidadAtirulos);
			},
		},
	};
</script>
<style>
	.sinTop {
		padding-top: 5px !important;
	}
	.theme--light.v-stepper .v-stepper__step__step {
    color: white;
    height: 40px;
    width: 40px;
    font-size: x-large;
}
.v-icon__svg {
    height: 45px;
    width: 45px;
    fill: currentColor;
}
</style>
