<template>
	<v-flex>
		<v-card v-if="!$apollo.loading">
			<v-toolbar style="background: linear-gradient(#0000A6,#000066);" dark>
				<v-toolbar-title class="font-weight flex">
					<v-row>
						<v-col xs="4" sm="4" md="4" class="sinTopBottom">
							<h3>
								{{ `Productos: ${(cantidadAtirulos = calcularArticulos)}` }}
							</h3>
						</v-col>
						<v-col xs="8" sm="8" md="8" align="right" class="finalTabla">
							<v-btn
								v-if="btnVisible"
								style="background: linear-gradient(#2196F3,#0000E6); margin-right: 10px"
								class="btnAgregar"
								rounded
								color="blue"
								@click="abrirAddProdApartado"
								><v-icon>checkroom</v-icon>Agregar</v-btn
							>
						</v-col>
					</v-row>
				</v-toolbar-title>
			</v-toolbar>
			<v-data-table
				v-model="selected"
				:headers="headersProductos"
				:items="listaProductos"
				:search="search"
				:hide-default-footer="true"
				:sort-by="['createAt']"
				:sort-desc="false"
				@click:row="rowClick"
				@current-items="currentItems"
				single-select
				item-key="_id"
				fixed-header
				disable-pagination
				class="elevation-3"
				id="dataTable"
				height="36vh"
			>
				<!-- Nombre -->
				<template v-slot:[`item.nombre`]="{ item }">
					<strong color="primary" style="font-size: 1.5em;"
						>{{ item.nombre }}
					</strong>
				</template>

				<!-- Fecha -->
				<template v-slot:[`item.createAt`]="{ item }">
					{{ pasarAFecha(item) }}
				</template>

				<!-- Precio -->
				<template v-slot:[`item.precio`]="{ item }">
					<strong color="primary" style="font-size: 1.5em;"
						>${{ item.precio }}
					</strong>
				</template>

				<!-- Si no encuentra clientes -->
				<template v-slot:no-data>
					<h1>Sin datos</h1>
					<v-btn
						style="background: linear-gradient(#0000E6,#0000A6 );"
						dark
						@click="propsProductos()"
					>
						<v-icon>sync</v-icon> Recargar
					</v-btn>
				</template>
			</v-data-table>

			<v-card-text style="padding-left: 0px">
				<!-- TOTAL -->
				<v-row>
					<v-col
						xs="12"
						sm="5"
						md="5"
						style="padding-bottom: 0px; padding-top: 0px"
					>
					</v-col>
					<v-col
						xs="12"
						sm="7"
						md="7"
						align="right"
						class="finalTabla"
						style="padding-bottom: 0px; padding-top: 5px"
					>
						<h2 class="totalProductos" @click="addProducto()">
							$ {{ (total = calcularTotal) }}
						</h2>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<!-- PRODUCTO CRUD Modal -->
		<v-dialog v-model="ProductosCRUD" persistent>
			<ProductosCRUD
				componente="ProductosCRUD"
				:dataProducto="selected[0]"
			/><!-- v-on:emitAPA="emitProductosCRUD" -->
		</v-dialog>
		<!--Termina PRODUCTO CRUD MODAL -->
	</v-flex>
</template>
<script>
	import ProductosCRUD from "./productosCRUD/ProductosCRUD";
	import gql from "graphql-tag";
	import { GET_PRODUCTOS_FOLIO } from "../../graphql/apartado";
	import moment from "moment";
	export default {
		components: { ProductosCRUD },
		props: ["dataProductos", "dataFolio"],
		data: () => ({
			selected: [],
			selectedId: -1,
			total: 0,
			cantidadAtirulos: 0,
			search: "",
			idFolio: 0,
			listaProductos: [],
			btnVisible: false,
			headersProductos: [
				{ text: "Nombre", value: "nombre", sortable: true },
				{ text: "Fecha", value: "createAt", sortable: true },
				{ text: "Precio", value: "precio", sortable: true, align: "finish" },
			],
		}),
		computed: {
			FuncDataFolio() {
				return this.$props.dataFolio;
			},
			FuncDataProductos() {
				return this.$props.dataProductos;
			},
			calcularTotal: function() {
				let resultado = 0.0;
				if (this.listaProductos) {
					for (var i = 0; i < this.listaProductos.length; i++) {
						resultado = resultado + this.listaProductos[i].precio;
					}
				}
				this.$emit("dataPDA", resultado);
				return resultado;
			},
			calcularArticulos: function() {
				let res = 0.0;
				if (this.listaProductos) {
					res = this.listaProductos.length;
				}
				return res;
			},
			ProductosCRUD() {
				return this.$store.state.componentes.ProductosCRUD;
			},
		},
		watch: {
			FuncDataFolio() {
				this.propsProductos();
			},
			FuncDataProductos() {
				this.propsProductos();
			},
		},
		created() {
			this.propsProductos();
		},
		methods: {
			async propsProductos() {
				if (this.$props.dataFolio) {
					this.buscarFolio();
				} else if (this.$props.dataProductos) {
					this.btnVisible = true;
					this.listaProductos = await this.$props.dataProductos;
					console.log(this.$props.dataProductos);
				}
			},
			async buscarFolio() {
				var folio = parseFloat(this.$props.dataFolio);
				if (folio > 0) {
					var { data } = await this.$apollo.query({
						query: GET_PRODUCTOS_FOLIO,
						variables: {
							folio: folio,
						},
					});
					if (data) {
						this.listaProductos = await data.getProductosFolio[0].productos;
					}
				}
			},
			pasarAFecha(item) {
				var fecha = moment.unix(item.createAt / 1000).format("LL");
				return fecha;
			},
			async abrirAddProdApartado() {
				this.$store.state.componentes.AddProdApartado = true;
			},
			async rowClick(item, row) {
				await row.select();
				console.log(this.selected[0]);
				this.$store.state.componentes.ProductosCRUD = true
			},
			currentItems(e) {
				this.arrayTable = e;
			},
		},
	};
</script>
<style>
	.totalProductos {
		margin-top: calc(1 * (0.5vw + 0.5vh));
		margin-bottom: calc(2 * (0.5vw + 0.5vh));
		font-size: calc(5 * (0.5vw + 0.5vh));
		color: green;
	}
	.cantidadProd {
		font-size: calc(3 * (0.5vw + 0.5vh));
		color: #000058;
		padding-top: 10px;
	}
	.sinTopBottom {
		padding: 5px;
	}
	.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
	.v-data-table > .v-data-table__wrapper > table > thead > tr > td,
	.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
		font-size: 0.875rem;
		height: 31px;
	}
	.container {
		width: 100%;
		padding: 12px;
		margin-right: auto;
		margin-left: auto;
		padding-top: 0px;
	}
</style>
