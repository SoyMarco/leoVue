<template>
	<v-layout align-start>
		<v-flex>
			<div>{{ selectedId.index }}</div>
			<v-col sm="12" md="12" style="padding-top: 0px; padding-bottom: 0px">
				<v-card elevation="24" shaped>
					<v-card-text color="#000058">
						<v-text-field
							v-model="precio"
							prepend-inner-icon="monetization_on"
							rounded
							outlined
							dense
							color="primary"
							type="number"
							autofocus
							autocomplete="off"
							class="precio"
							id="precioId"
							@keyup.enter="agregarProducto()"
							@keyup.up="rowArriba"
							@keyup.down="rowAbajo"
							@keyup.187="addArticuloKey"
							@keyup.109="removeArticuloKey"
							@keyup.123="agregarProducto"
						>
						</v-text-field>
						<!-- Comienza Tabla -->
						<v-data-table
							v-model="selected"
							:headers="headers"
							:items="productos"
							:hide-default-footer="true"
							class="elevation-24"
							fixed-header
							height="60vh"
							disable-pagination
							@click:row="rowClick"
							item-key="idArray"
							single-select
							id="dataTable"
							@current-items="currentItems"
							:sort-by="['idArray']"
							:sort-desc="true"
						>
							<!-- Precio ARTICULO -->
							<template v-slot:[`item.precio`]="{ item }" class="iconBorrar">
								<h2>${{ item.precio }}</h2>
							</template>
							<!-- Cantidad Articulos -->
							<template v-slot:[`item.cantidad`]="{ item }">
								<v-text-field
									autocomplete="off"
									v-model="item.cantidad"
									type="number"
									class="cantidadTabla"
									prepend-icon="remove_circle"
									append-outer-icon="add_circle"
									readonly
									value="1"
									min="1"
									max="30"
									style="padding-top: 0px; border-bottom: 0px"
									@click:append-outer="addArticulo(item, row)"
									@click:prepend="removeArticulo(item)"
								>
								</v-text-field>
							</template>
							<!-- TOTAL ARTICULO -->
							<template
								v-slot:[`item.totalArticulo`]="{ item }"
								class="iconBorrar"
							>
								<h2 style="color: green">
									${{ (item.totalArticulo = item.precio * item.cantidad) }}
								</h2>
							</template>
							<!-- BORRAR -->
							<template v-slot:[`item.borrar`]="{ item }" class="iconBorrar">
								<v-icon
									size="30"
									color="#c5221f"
									class="mr-2"
									@click="eliminarProducto(productos, item)"
								>
									delete
								</v-icon>
							</template>
							<template v-slot:no-data>
								<v-data-table
									:hide-default-header="true"
									:hide-default-footer="true"
									loading-text="Agrega Productos a la venta"
								></v-data-table>
							</template>
						</v-data-table>
					</v-card-text>

					<v-card-text style="padding-left: 0px">
						<!-- TOTAL -->
						<v-row>
							<v-col sm="12" md="12" align="right" class="finalTabla">
								<h1 class="cantidad" @click="Pruebas()">
									{{ `Articulos: ${(cantidadAtirulos = calcularArticulos)}` }}
								</h1>
								<h2 class="totalTotal" @click="addProducto()">
									$ {{ (total = calcularTotal) }}
								</h2>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>

			<!-- COBRAR Modal -->
			<v-dialog v-model="Cobrar" persistent>
				<Cobrar
					componente="Cobrar"
					:dataTotal="total"
					:dataProductos="productos"
				/>
			</v-dialog>
			<!--Termina COBRAR MODAL -->
		</v-flex>
	</v-layout>
</template>

<script>
	import { REGISTER_VENTA } from "../graphql/venta";
	import Cobrar from "../components/Cobrar";
	export default {
		components: { Cobrar },
		data: () => ({
			idArticulo: 0,
			input: "",
			arrayTable: [],
			select: "",
			selected: [],
			selectedId: -1,
			total: 0,
			cantidadAtirulos: 0,
			precio: "",
			productos: [],
			headers: [
				{
					text: "ID",
					align: "start",
					sortable: true,
					value: "idArray",
				},
				{ text: "PRODUCTO", value: "nombre", sortable: false },
				{ text: "PRECIO", value: "precio", sortable: false },
				{ text: "CANTIDAD", value: "cantidad", sortable: false },
				{ text: "APARTADO", value: "apartado", sortable: false },
				{ text: "REFERENCIA", value: "refApartado", sortable: false },
				{ text: "TOTAL", value: "totalArticulo", sortable: false },
				{ text: "BORRAR", value: "borrar", sortable: false },
			],
		}),
		computed: {
			calcularTotal: function() {
				let resultado = 0.0;
				for (var i = 0; i < this.productos.length; i++) {
					resultado = resultado + this.productos[i].totalArticulo;
				}
				return resultado;
			},
			calcularArticulos: function() {
				let res = 0.0;
				for (var i = 0; i < this.productos.length; i++) {
					res = res + parseInt(this.productos[i].cantidad);
				}
				return res;
			},
			//COMPONENTES
			Cobrar() {
				return this.$store.state.componentes.Cobrar;
			},
			limpiarData() {
				return this.$store.state.limpiarData.Home;
			},
		},
		watch: {
			rowSelect() {},
			limpiarData() {
				this.limpiarDataHome();
			},
		},

		methods: {
			Pruebas() {
				console.log(this.limpiarData);
			},
			async addProducto() {
				const addProd = await this.$apollo
					.mutate({
						// Query Mutation
						mutation: REGISTER_VENTA,
						// Parameters
						variables: {
							input: {
								productos: this.productos,
								vendedor: "Marco!",
								folio: 5,
								total: 112,
								/* efectivo: 6,
              tarjeta: 6,
              aCuenta: 6,
              pagoCon: 6,
              refApartado: "String",
              notas: "String", */
							},
						},
					})
					.catch((error) => {
						this.errorM = error.graphQLErrors[0].message;
						this.btnLoading = false;
					});

				if (addProd) {
					console.log(addProd);
				}
			},
			async agregarProducto() {
				if (this.precio > 0) {
					await this.productos.push({
						idArray: this.idArticulo + 1,
						nombre: "Articulo",
						precio: Math.round(this.precio * 100) / 100,
						cantidad: 1,
						apartado: 0,
						refApartado: 0,
						totalArticulo: 0,
					});
					this.precio = "";
					this.dialog = 0;
					this.selectLastRow();
					this.idArticulo = this.idArticulo + 1;
					console.log(this.productos);
				} else if (!this.precio && this.cantidadAtirulos > 0) {
					this.abrirCobrar();
				} else {
					this.precio = "";
				}
			},
			async eliminarProducto(arr, item) {
				let i = arr.indexOf(item);
				if (i != -1) {
					await arr.splice(i, 1);
				}
				this.focusPrecio();
				this.selectLastRow();
			},
			addArticulo(item, row) {
				console.log(row);
				const { idArray } = item;
				console.log(item);
				for (var i = 0; i < this.productos.length; i++) {
					if (this.productos[i].idArray == idArray) {
						this.productos[i].cantidad = this.productos[i].cantidad + 1;
					}
				}
				this.focusPrecio();
			},

			removeArticulo(item) {
				const { idArray } = item;
				for (var i = 0; i < this.productos.length; i++) {
					if (this.productos[i].idArray == idArray) {
						if (this.productos[i].cantidad > 1) {
							this.productos[i].cantidad = this.productos[i].cantidad - 1;
						} else {
							this.eliminarProducto(this.productos, item);
						}
					}
				}
				this.focusPrecio();
			},
			addArticuloKey() {
				this.selected[0].cantidad = this.selected[0].cantidad + 1;

				this.precio = 0;
			},
			removeArticuloKey() {
				if (this.arrayTable[0]) {
					if (this.selected[0].cantidad > 1) {
						this.selected[0].cantidad = this.selected[0].cantidad - 1;
					} else if ((this.selected[0].cantidad = 1)) {
						this.eliminarProducto(this.productos, this.selected[0]);
					}
				}
				this.precio = 0;
			},
			focusPrecio() {
				document.getElementById("precioId").focus();
			},
			rowClick(item, row) {
				console.log(row);
				row.select();
				this.focusPrecio();
			},
			selectLastRow() {
				const ultimo = this.arrayTable[0];
				this.selected = [ultimo];
			},
			rowAbajo() {
				if (this.selected[0]) {
					const ultimo = this.productos[0].idArray;
					if (this.selected[0].idArray != ultimo) {
						const pos = this.selected[0].idArray;
						for (var i = 0; i < this.arrayTable.length; i++) {
							if (this.arrayTable[i].idArray == pos) {
								i++;
								this.selected = [this.arrayTable[i]];
							}
						}
					}
				}
				this.precio = [];
			},
			rowArriba() {
				if (this.selected[0]) {
					const ultimo = this.productos[this.productos.length - 1].idArray;
					console.log(ultimo);
					if (this.selected[0].idArray != ultimo) {
						const pos = this.selected[0].idArray;
						for (var i = 0; i < this.arrayTable.length; i++) {
							if (this.arrayTable[i].idArray == pos) {
								let a = i - 1;
								this.selected = [this.arrayTable[a]];
							}
						}
					}
				}
				this.precio = [];
			},
			yomero() {
				console.log(this.arrayTable);
			},
			currentItems(e) {
				this.arrayTable = e;
			},
			cerrarCobrar() {
				this.$store.state.componentes.Cobrar = false;
			},
			abrirCobrar() {
				this.$store.state.componentes.Cobrar = true;
			},
			limpiarDataHome() {
				this.idArticulo = 0;
				this.input = "";
				this.arrayTable = [];
				this.select = "";
				this.selected = [];
				this.selectedId = -1;
				this.total = 0;
				this.cantidadAtirulos = 0;
				this.precio = "";
				this.productos = [];
				this.$store.state.limpiarData.Home = false;
				this.focusPrecio();
			},
		},
	};
	document.onkeypress = function(event) {
		event = event || window.event;
		if (event.keyCode == 123) {
			return false;
		}
	};
	document.onmousedown = function(event) {
		event = event || window.event;
		if (event.keyCode == 123) {
			return false;
		}
	};
	document.onkeydown = function(event) {
		event = event || window.event;
		if (event.keyCode == 123) {
			return false;
		}
	};
</script>

<style>
	.precio input {
		font-size: 2.2em;
		text-align: center;
		font-weight: 700;
	}
	.precio .v-icon {
		font-size: 40px;
	}
	.cantidad input {
		font-size: 1.2em;
		text-align: center;
		font-weight: 500;
	}
	.totalTotal {
		margin-top: calc(1 * (0.5vw + 0.5vh));
		margin-bottom: calc(2 * (0.5vw + 0.5vh));
		font-size: calc(8 * (0.5vw + 0.5vh));
		color: green;
	}
	.cantidad {
		font-size: calc(4 * (0.5vw + 0.5vh));
		color: #000058;
	}
	.cantidadTabla {
		font-size: 1.5em;
		color: #000058;
		text-align: center !important;
	}
	.cantidadTabla input {
		text-align: center;
	}
	.cantidadTabla .v-icon {
		color: #0070c9;
	}
	.finalTabla {
		display: flex;
		align-items: center;
		place-content: flex-end;
		padding-left: 0px;
	}
	.finalTabla h1 {
		padding-right: 3vh;
	}

	tr.v-data-table__selected {
		background: #e8f0fe !important;
		color: #1a73e8;
	}
</style>
