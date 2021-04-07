<template>
	<v-layout>
		<v-flex>
			<v-dialog
				v-model="Cobrar"
				max-width="500px"
				class="modalCitaModal"
				persistent
			>
				<v-card shaped>
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
								@keyup.13="abrirImprimir"
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
					<h2 v-if="errorMsg" style="color: red">{{ errorMsg }}</h2>
					<v-card-actions style="padding-bottom: 25px; padding-top: 20px">
						<v-spacer></v-spacer>

						<v-btn
							:disabled="btnDisabled"
							:loading="btnLoading"
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
							:disabled="btnDisabled"
							:loading="btnLoading"
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
			<!-- IMPRIMIR Modal -->
			<v-dialog
				v-model="Imprimir"
				persistent
				transition="none"
			>
				<Imprimir
					componente="Inprimir"
					:dataProductos="productos"
					:dataTotal="total"
					:dataCambio="cambio"
					:dataEfectivo="efectivo"
					:dataTarjeta="tarjeta"
					:dataaCuenta="aCuenta"
					:dataFolio="folio"
				/>
			</v-dialog>
			<!--Termina IMPRIMIR MODAL -->
		</v-flex>
	</v-layout>
</template>

<script>
	import { REGISTER_VENTA } from "../graphql/venta";
	import Imprimir from "../components/Imprimir";
	export default {
		props: ["dataTotal", "dataProductos"],
		components: { Imprimir },
		data: () => ({
			errorMsg: "",
			btnLoading: false,
			productos: [],
			cambio: 0,
			total: 0,
			efectivo: 0,
			tarjeta: 0,
			aCuenta: 0,
			folio:0,
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
			btnDisabled() {
				if (this.cambio >= 0) {
					return false;
				} else {
					return true;
				}
			},
			//COMPONENTES
			Imprimir() {
				return this.$store.state.componentes.Imprimir;
			},
			limpiarDataCobrar() {
				return this.$store.state.limpiarData.Cobrar;
			},
		},
		watch: {
			Cobrar() {
				if (this.$store.state.componentes.Cobrar === true) {
					this.propsCobrar();
				}
			},
				limpiarDataCobrar() {
				this.limpiarData();
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
			//GUARDAR CON GraphQL
			async guardarVenta() {
				this.btnLoading = true;
				let efectivo = parseFloat(this.efectivo);
				let tarjeta = parseFloat(this.tarjeta);
				let aCuenta = parseFloat(this.aCuenta);
				let total = parseFloat(this.total);
				if (this.cambio >= 0) {
					const { data, loading, error } = await this.$apollo
						.mutate({
							// Query Mutation
							mutation: REGISTER_VENTA,
							// Parameters
							variables: {
								input: {
									productos: this.productos,
									vendedor: this.$store.state.usuario.name,
									folio: 1,
									total: total,
									efectivo: efectivo,
									tarjeta: tarjeta,
									aCuenta: aCuenta,
									pagoCon: 0,
									referencia: "",
									notas: "",
								},
							},
						})
						.catch((error) => {
							console.log(error.graphQLErrors[0].message);
							this.errorMsg = error.graphQLErrors[0].message;
						});

					if (data) {
						this.folio = await data.registerVenta.folio
						await this.abrirImprimir()
						this.btnLoading = false;
					}
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
			limpiarData() {
				this.productos = [];
				this.vendedor = "";
				this.folio = 1;
				this.total = 0;
				this.efectivo = 0;
				this.tarjeta = 0;
				this.aCuenta = 0;
				this.pagoCon = 0;
				this.$store.state.limpiarData.Cobrar = false;
			},
			cerrarImprimir() {
				this.$store.state.componentes.Imprimir = false;
			},
			abrirImprimir() {
				this.$store.state.componentes.Imprimir = true;
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
