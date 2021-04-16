<template>
	<v-layout align-start>
		<v-flex>
			<v-row >
				<v-col xs="12" sm="8" md="8">
					<h3 style="max-height: 42px; text-align-last: left;">
						Cliente: {{apartado.cliente}}
					</h3>
				</v-col>
				<v-col xs="12" sm="4" md="4" align="right" >
					<v-btn
						style="background: linear-gradient(#0000E6,#0000A6 ); margin-right: 10px"
						dark
						rounded
						large
					>
						<v-icon>print</v-icon>
						Imprimir
					</v-btn>

					<v-btn
						large
						style="background: linear-gradient(#D43F3F,#880000);"
						dark
						rounded
					>
						<v-icon>cancel</v-icon>
						Cancelar</v-btn
					>
				</v-col>
			</v-row>
			<v-card style="padding-top: 3px" elevation="24">
				<v-toolbar style="background: linear-gradient(#0000A6,#000066);" dark>
					<v-toolbar-title class="font-weight flex">
						<v-row>
							<v-col xs="2" sm="2" md="2">
								<h2 style="max-height: 27px; text-align-last: left;">
									Folio:{{ $route.params.id }}
								</h2></v-col
							>
							<v-col xs="8" sm="8" md="8">
								<v-text-field
									:rules="[rules]"
									v-model="abono"
									hide-details
									autofocus
									solo-inverted
									rounded
									type="number"
									class="searchApartado"
									color="green darken-2"
									prepend-inner-icon="payments"
									label=".  Ingresa ABONO"
									id="abono"
									autocomplete="off"
									@keyup.enter="guardarAbono"
								></v-text-field>
							</v-col>
							<!-- <v-col xs="2" sm="2" md="2" style="padding-top: 15px">
								<v-btn class="btnAgregar" rounded color="green darken-4" large
								@click="guardarAbono"
									><v-icon>payments</v-icon>Abonar</v-btn
								> 
							</v-col> -->
						</v-row>
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-row v-if="$apollo.loading"> </v-row>
					<v-row>
						<!-- PRIMERA TABLA -->
						<v-col
							xs="12"
							sm="6"
							md="6"
							style="padding-left: 5px; padding-top: 0px"
						
						>
							<ProductosDeApartado
								componente="ProductosDeApartado"
								:dataProductos="apartado.productos"
								v-on:dataPDA="totalPDA"
									class="elevation-24"
							/>
						</v-col>
						<!-- SEGUNDA TABLA -->
						<v-col
							xs="12"
							sm="6"
							md="6"
							style="padding-left: 0px; padding-top: 0px"
						>
							<AbonosDeApartado
								componente="AbonosDeApartado"
								:dataAbono="apartado.abonos"
								v-on:dataADA="totalADA"
									class="elevation-24"
							/>
						</v-col>
					</v-row>
				</v-card-text>
				<!-- TOTAL -->
				<v-row>
					<v-col xs="12" sm="6" md="6">
						<v-row style="padding-left: 15px">
							<h4>Vence: {{ pasarAFecha() }}</h4>
							<v-btn
									style="background: linear-gradient(#0000E6,#0000A6 ); margin-left: 15px"
								dark
								rounded
							>
								<v-icon>date_range</v-icon>
								cambiar fecha</v-btn
							>
						</v-row>
						<h3 class="advertencia" v-if="apartado.cancelado > []">
							Entregado por Pao el lunes 24 de marzo del 2021 a las 03:41pm
						</h3>
						<h3 class="advertencia" v-if="apartado.sacado > []">
							Sacado: FECHA_____
						</h3>
						<h3 class="advertencia" v-if="apartado.cancelado > []">
							Cancelado: FECHA_____
						</h3> 
					</v-col>
					<v-col xs="12" sm="6" md="6" align="right" style="padding-top: 0px">
						<h3 class="totalApartado">Resta ${{ (total = calcularResta) }}</h3>
						<v-progress-linear
						
							:buffer-value="100 - (restaria * 100) / totalProductos"
							:value="100 - (total * 100) / totalProductos"
							:stream="restaria === total ? false : restaria < 0 ? true : true"
							:background-color="
								restaria === 0
									? 'color: green'
									: restaria < 0
									? 'color: red'
									: restaria > total
									? 'color: red'
									: 'color: blue darken-4'
							"
							:color="
								restaria === total
									? 'color: green'
									: restaria < 0
									? 'color: red'
									: 'color: green'
							"
						></v-progress-linear>
						<h3
							class="totalApartado"
							:style="
								restaria === total
									? 'color: white'
									: restaria < 0
									? 'color: red'
									: restaria > total
									? 'color: red'
									: 'color: blue'
							"
						>
							{{ `Restaria $${(restaria = calcularRestaria)}` }}
						</h3>
					</v-col>
				</v-row>
			</v-card>
			<!-- COBRAR Modal -->
			<v-dialog v-model="Cobrar" persistent>
				<Cobrar
					componente="Cobrar"
					:dataTotal="abono"
					:propsComponenteApartado="apartado"
				/>
			</v-dialog>
			<!--Termina COBRAR MODAL -->

			<!-- AGREGAR PRODUCTO Modal -->
			<v-dialog v-model="AddProdApartado" persistent>
				<AddProdApartado
					componente="AddProdApartado"
					:dataFolio="apartado.id"
					v-on:emitAPA="emitAddProdApartado"
				/>
			</v-dialog>
			<!--Termina AGREGAR PRODUCTO MODAL -->

		</v-flex>
	</v-layout>
</template>
<script>
	import ProductosDeApartado from "./ProductosDeApartado";
	import AbonosDeApartado from "./AbonosDeApartado";
	import Cobrar from "../Cobrar";
	import AddProdApartado from "./AddProdApartado";
	import { GET_PRODUCTOS_FOLIO } from "../../graphql/apartado";
	import moment from "moment";
	export default {
		components: { ProductosDeApartado, AbonosDeApartado, Cobrar, AddProdApartado,},
		data: () => ({
			abono: "",
			apartado: [],
			total: 0,
			restaria: 0,
			totalProductos: 0,
			totalAbonos: 0,
		}),
		computed: {
			calcularResta: function() {
				let productos = parseFloat(this.totalProductos);
				let abonos = parseFloat(this.totalAbonos);
				var resultado = productos - abonos;
				return resultado;
			},
			calcularRestaria: function() {
				let abono = parseFloat(this.abono);
				if (!abono) {
					abono = 0;
				}
				let total = parseFloat(this.total);

				var resultado = total - abono;
				return resultado;
			},
			Cobrar() {
				return this.$store.state.componentes.Cobrar;
			},
			AddProdApartado() {
				return this.$store.state.componentes.AddProdApartado;
			},
		},
		created() {
			this.buscarFolio();
		},
		methods: {
			async buscarFolio() {
				var folio = parseFloat(this.$route.params.id);
				if (folio > 0) {
					var { data } = await this.$apollo.query({
						query: GET_PRODUCTOS_FOLIO,
						variables: {
							folio: folio,
						},
					});
					if (data) {
						var apartado = data.getProductosFolio[0];
						this.apartado = await apartado;
						console.log(apartado)
					}
				}
			},
			pasarAFecha() {
				var fecha = moment.unix(this.apartado.vence / 1000).format("LL");
				return fecha;
			},
			totalPDA(datos) {
				this.totalProductos = datos;
			},
			totalADA(datos) {
				this.totalAbonos = datos;
			},
			guardarAbono() {
				if (this.restaria >= 0 && this.abono > 0) {
					this.abrirCobrar();
				}
			},
			async abrirCobrar() {
				this.$store.state.componentes.Cobrar = true;
				var apartado = await this.apartado;
				this.$root.$emit("dataComponenteApartado", apartado);
			},
			async abrirAddProdApartado() {
				this.$store.state.componentes.AddProdApartado = true;
				var apartado = await this.apartado;
				this.$root.$emit("dataComponenteApartado", apartado);
			},
			rules(value) {
				if (value < 0) {
					return "El abono debe ser menor";
				} else {
					return true;
				}
			},
			async emitAddProdApartado(data){
						if (data) {
						var apartado = data.addProducto;
						this.apartado = await apartado;
						console.log(apartado)
					}
			},
		},
	};
</script>
<style>
	.advertencia {
		background: linear-gradient(#d43f3f, #880000);
		color: white;
		margin-top: 5px;
	}
		.totalApartado {
		margin-top: 0px;
		margin-bottom: 0px;
		font-size: calc(5 * (0.5vw + 0.5vh));
		color: green;
		
	}
	
	

</style>
