<template>
	<v-layout>
		<v-flex>
			<v-dialog
				transition="dialog-top-transition"
				v-model="Cobrar"
				max-width="500px"
				class="modalCitaModal"
				persistent
			>
				<v-card>
					<v-toolbar color="primary" dark style="font-weight: bold">
						<v-toolbar-title class="font-weight flex">
							<v-icon>shopping_cart</v-icon>
							COBRAR </v-toolbar-title
						><v-btn
							color="#D32F2F"
							style="background: linear-gradient(#F53636,#D32F2F);"
							dark
							rounded
							small
							@click="cerrarCobrar"
							class="cerrar"
						>
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card-text class="contenidocitaModal">
						<v-container>
							<!-- EFECTIVO -->
							<v-text-field
								v-model="efectivo"
								label="EFECTIVO"
								prepend-inner-icon="payments"
								class="efectivo"
								outlined
								rounded
								required
								:rules="rules.efectivo"
								color="green"
								autofocus
								type="number"
								autocomplete="off"
								style="padding-top: 25px"
								id="efectivo"
								@click="selectEfectivo"
								@keyup.84="selectTarjeta"
								@keyup.65="selectaCuenta"
                                @keyup.73="imprimir"
                                @keyup.71="guardarVenta"
                                @keyup.13="imprimir"
							></v-text-field>
							<!-- TARJETA -->
							<v-text-field
								v-model="tarjeta"
								label="TARJETA"
								prepend-inner-icon="credit_card"
								class="efectivo"
								outlined
								rounded
								required
								color="green"
								type="number"
								autocomplete="off"
								id="tarjeta"
								@click="selectTarjeta"
								@keyup.69="selectEfectivo"
								@keyup.65="selectaCuenta"
                                @keyup.73="imprimir"
                                @keyup.71="guardarVenta"
                                @keyup.13="imprimir"
							></v-text-field>
							<!-- A CUENTA -->
							<v-text-field
								v-model="aCuenta"
								label="A CUENTA"
								prepend-inner-icon="store"
								class="efectivo"
								outlined
								rounded
								required
								color="green"
								type="number"
								autocomplete="off"
								id="aCuenta"
								@click="selectaCuenta"
								@keyup.84="selectTarjeta"
								@keyup.69="selectEfectivo"
                                @keyup.73="imprimir"
                                @keyup.71="guardarVenta"
                                @keyup.13="imprimir"
							></v-text-field>
							<h1
								:style="calcularCambio >= 0 ? 'color: #35B009 ' : 'color: red'"
							>
								{{ calcularCambio >= 0 ? "Cambio" : "Faltan" }} ${{
									(cambio = calcularCambio)
								}}
							</h1>
						</v-container>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions style="padding-bottom: 25px; padding-top: 20px">
						<v-spacer></v-spacer>

						<v-btn
							color="#3DC90A"
							rounded
							style="background: linear-gradient(#47EB0C,#3DC90A);"
							dark
							class="font-weight-bold"
							@click="prueba"
						>
							<v-icon>print</v-icon>
							imprimir
						</v-btn>
						<v-btn
							color="#0070c9"
							style="background: linear-gradient(#42a1ec,#0070c9);"
							dark
							rounded
							class="font-weight-bold"
							@click="guardarVenta"
						>
							<v-icon>save</v-icon>
							guardar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-flex>
	</v-layout>
</template>

<script>
	import { REGISTER_VENTA } from "../graphql/venta";
	export default {
		props: ["dataTotal", "dataProductos"],
		data: () => ({
			cambio: 0,
			productos: [],
			total: 0,
			efectivo: 0,
			tarjeta: 0,
			aCuenta: 0,
			rules: {
				efectivo: [(val) => (val || "") < 15000 || "Error en efectivo"],
			},
		}),
		computed: {
			calcularCambio: function() {
				if (!this.efectivo) {
					this.efectivo = 0;
				}
				if (!this.tarjeta) {
					this.tarjeta = 0;
				}
				if (!this.aCuenta) {
					this.aCuenta = 0;
				}
				if (!this.total) {
					this.total = 0;
				}

				let efectivo = parseFloat(this.efectivo);
				let tarjeta = parseFloat(this.tarjeta);
				let aCuenta = parseFloat(this.aCuenta);
				let total = parseFloat(this.total);
				var sumaTodo = efectivo + tarjeta + aCuenta;
				var resultado = sumaTodo - total;

				return resultado;
			},
			Cobrar() {
				return this.$store.state.componentes.Cobrar;
			},
		},
		watch: {
			Cobrar() {
				if (this.$store.state.componentes.Cobrar === true) {
					this.propsCobrar();
				}
			},
		},
		created() {
			this.propsCobrar();
		},
		mounted() {
			let element = document.getElementById("efectivo");
			element.select();
		},
		methods: {
			prueba() {
				let element = document.getElementById("efectivo");
				console.log("element");
				console.log(element);
				element.select();
			},
			propsCobrar() {
				this.productos = this.$props.dataProductos;
				this.efectivo = this.$props.dataTotal;
				this.total = this.$props.dataTotal;
			},
			//Enviar a GraphQL
			async guardarVenta() {
				console.log(this.productos);
				const addVenta = await this.$apollo
					.mutate({
						// Query Mutation
						mutation: REGISTER_VENTA,
						// Parameters
						variables: {
							input: {
								productos: this.productos,
								vendedor: this.$store.state.usuario.name,
								folio: 1,
								total: this.total,
								efectivo: this.efectivo,
								tarjeta: this.tarjeta,
								aCuenta: this.aCuenta,
								pagoCon: 0,
								referencia: "",
								notas: "",
							},
						},
					})
					.catch((error) => {
						this.errorM = error.graphQLErrors[0].message;
						this.btnLoading = false;
					});

				if (addVenta) {
					console.log(addVenta);
				}
			},
			cerrarCobrar() {
				this.$store.state.componentes.Cobrar = false;
			},
			selectEfectivo() {
				let element = document.getElementById("efectivo");
				element.select();
			},
			selectTarjeta() {
				let element = document.getElementById("tarjeta");
				element.select();
			},
			selectaCuenta() {
				let element = document.getElementById("aCuenta");
				element.select();
			},
		},
	};
</script>

<style>
	.efectivo {
		font-weight: 700;
	}
	.efectivo input {
		font-size: 2.2em;
		text-align: center;
		font-weight: 700;
		color: green;
	}

	.container {
		font-size: 1.8em;
		text-align: center;
	}
	.cerrar {
		float: right;
	}
</style>
