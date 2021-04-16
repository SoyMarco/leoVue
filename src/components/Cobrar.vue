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
							<br>
							<h2>Total ${{total}}</h2>
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
								@keyup.69="selectEfectivo"
								@keyup.84="selectTarjeta"
								@keyup.65="selectaCuenta"
								@keyup.27="cerrarCobrar()"
								@keyup.enter="SaveAndPrint"
								@keyup.112="SaveAndPrint"
								@keyup.113="OnlySave"
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
								@keyup.84="selectTarjeta"
								@keyup.65="selectaCuenta"
								@keyup.27="cerrarCobrar()"
								@keyup.13="SaveAndPrint"
								@keyup.112="SaveAndPrint"
								@keyup.113="OnlySave"
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
								@keyup.69="selectEfectivo"
								@keyup.84="selectTarjeta"
								@keyup.65="selectaCuenta"
								@keyup.27="cerrarCobrar()"
								@keyup.13="SaveAndPrint"
								@keyup.112="SaveAndPrint"
								@keyup.113="OnlySave"
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
							color="#D32F2F"
							style="background: linear-gradient(#F53636,#D32F2F);"
							dark
							rounded
							@click="cerrarCobrar"
							class="cerrar"
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
							@click="SaveAndPrint"
						>
							<v-icon>save</v-icon>
							guardar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- IMPRIMIR Modal -->
			<v-dialog v-model="Imprimir" persistent transition="none">
				<Imprimir
					componente="Imprimir"
					:dataProductos="productos"
					:dataTotal="total"
					:dataCambio="cambio"
					:dataEfectivo="efectivo"
					:dataTarjeta="tarjeta"
					:dataaCuenta="aCuenta"
					:dataFolio="folio"
					:dataAbonos="abonos"
				/>
			</v-dialog>
			<!--Termina IMPRIMIR MODAL -->
		</v-flex>
	</v-layout>
</template>

<script>
	import { REGISTER_VENTA } from "../graphql/venta";
	import { REGISTER_APARTADO, ADD_ABONO } from "../graphql/apartado";
	import Imprimir from "../components/Imprimir";
	import gql from "graphql-tag";
	import router from "../router/index";

	export default {
		props: ["dataTotal", "dataProductos", "propsComponenteApartado"],
		components: { Imprimir },
		data: () => ({
			componenteApartado: [],
			abonos: [],
			productos: [],
			dataVenta: "",
			dataApartado: "",
			cliente: "",
			nuevoApartado: 0,
			nuevaVenta: 0,
			nuevoAbonoApartado: 0,
			noAbrir: false,
			soloGuardar: 0,
			errorMsg: "",
			btnLoading: false,
			cambio: 0,
			total: 0,
			efectivo: 0,
			tarjeta: 0,
			aCuenta: 0,
			folio: 0,
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
			this.$root.$on("dataProdDio", (data) => {
				this.dataProdDio(data);
			});
			this.$root.$on("dataComponenteApartado", (data) => {
				this.dataComponenteApartado(data);
			});
		},
		methods: {
			/* Verifica quien que se va imprimir */
			async SaveAndPrint() {
				if(this.nuevoAbonoApartado === 1){
					this.savePrintNewAA();
				} else if (this.nuevoApartado === 1) {
					this.savePrintNewA();
				}else if (this.nuevoApartado === 0) {
					this.savePrintNewV();
				}
			},
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
				this.componenteApartado= this.$props.dataComponenteApartado
			},
			async OnlySave() {
				this.soloGuardar = 1;
				this.SaveAndPrint();
			},
			/* NUEVO ABONO APARTADO */
			async savePrintNewAA(){
				console.log("savePrintNewAA")
				console.log(this.componenteApartado.id)
				let total = parseFloat(this.total);
				console.log(total)
				
				if (this.cambio >= 0) {
						 await this.guardarVenta();	
					this.btnLoading = true;
					const { data, loading, error } = await this.$apollo
						.mutate({
							// Query Mutation
							mutation: ADD_ABONO,
							// Parameters
							variables: {
								input: {
									id: this.componenteApartado.id,
									abono: total,
								},
							},
						})/* .catch((error) => {
							console.log(error.graphQLErrors[0].message);
							this.errorMsg = error.graphQLErrors[0].message;
						});*/
						console.log(data.addAbono.abonos)
					if (this.soloGuardar === 0) {
						if (data) {
							this.abonos = await data.addAbono.abonos;
							this.productos = await this.componenteApartado.productos
							 await this.abrirImprimir();
							this.btnLoading = false; 
						}
					} else if (this.soloGuardar === 1) {
						await this.cerrarLimpiarApp();
						await router.push({ name: "home" });
						location.reload()
					}  
				} 
			},
			/* NUEVO APARTADO GraphQL */
			async savePrintNewA() {
				console.log("guardar Nuevo Apartado");
				console.log(this.productos);
				console.log(this.$store.state.usuario.name);
				console.log(this.cliente);
				console.log(this.abonos);
				let total = parseFloat(this.total);
				if (this.cambio >= 0) {
						await this.guardarVenta();
					this.btnLoading = true;
					const { data, loading, error } = await this.$apollo
						.mutate({
							// Query Mutation
							mutation: REGISTER_APARTADO,
							// Parameters
							variables: {
								input: {
									productos: this.productos,
									vendedor: this.$store.state.usuario.name,
									cliente: this.cliente,
									abonos: this.abonos,
									folio: 1,
									total: total,
									referencia: "",
									notas: "",
								},
							},
						})
						.catch((error) => {
							console.log(error.graphQLErrors[0].message);
							this.errorMsg = error.graphQLErrors[0].message;
						});
					if (this.soloGuardar === 0) {
						if (data) {
							this.folio = await data.registerApartado.folio;
							await this.abrirImprimir();
							this.btnLoading = false;
						}
					} else if (this.soloGuardar === 1) {
						this.cerrarLimpiarApp();
					}
				}
			},
			async guardarVenta() {
				console.log("VENTA");
				let efectivo = parseFloat(this.efectivo);
				let tarjeta = parseFloat(this.tarjeta);
				let aCuenta = parseFloat(this.aCuenta);
				let total = parseFloat(this.total);
				console.log(efectivo);
				console.log(tarjeta);
				console.log(aCuenta);
				console.log(total);
				console.log(this.productos);
				if (this.cambio >= 0) {
					this.btnLoading = true;
					const { data, loading, error } = await this.$apollo
						.mutate({
							// Query Mutation
							mutation: gql`
								mutation registerVenta($input: VentaInput) {
									registerVenta(input: $input) {
										id
										folio
									}
								}
							`,
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
					this.dataVenta =data;
				}
			},
			//Guardar y/o Imprimir VENTA CON GraphQL
			async savePrintNewV() {
				await this.guardarVenta();
				 if (this.soloGuardar === 0) {
					if (this.dataVenta) {
						this.folio = await this.dataVenta.registerVenta.folio;
						await this.abrirImprimir();
						this.btnLoading = false;
					}
				} else if (this.soloGuardar === 1) {
					location.reload()
				} 
			},
			cerrarLimpiarApp() {
				this.$store.state.componentes.Imprimir = false;
				this.$store.state.componentes.Cobrar = false;
				this.$store.state.limpiarData.Cobrar = true;
				this.$store.state.limpiarData.Home = true;
				this.btnLoading = false;
				this.soloGuardar = 0;
			},
			cerrarCobrar() {
				this.$store.state.componentes.Cobrar = false;
				this.$store.state.limpiarData.Cobrar = true;
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
				this.folio = 1;
				this.total = 0;
				this.efectivo = 0;
				this.tarjeta = 0;
				this.aCuenta = 0;
				this.nuevoApartado = 0;
				this.$store.state.limpiarData.Cobrar = false;
				this.componenteApartado= [];
			this.dataVenta= "";
			this.dataApartado= "";
			this.abonos= [];
			this.cliente= "";
			this.nuevaVenta= 0;
			this.nuevoAbonoApartado= 0;
			this.noAbrir= false;
			this.soloGuardar= 0;
			this.errorMsg= "";
			this.btnLoading= false;
			this.cambio= 0;
			
			},
			cerrarImprimir() {
				this.$store.state.componentes.Imprimir = false;
			},
			abrirImprimir() {
				this.$store.state.componentes.Imprimir = true;
			},
			dataProdDio(datos) {
				this.productos = datos.ProductosApartado;
				this.efectivo = datos.abonos;
				this.total = datos.abonos;
				this.abonos = [
					{
						abono: parseFloat(datos.abonos),
						vendedor: this.$store.state.usuario.name,
					},
				];
				this.cliente = datos.cliente;
				this.nuevoApartado = 1;
			},
			dataComponenteApartado(data){
				this.componenteApartado = data
				console.log("data")
				console.log(data)
				this.nuevoAbonoApartado = 1;
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
