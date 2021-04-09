<template>
	<v-layout align-start>
		<v-flex>
			<v-col sm="12" md="12" style="padding-top: 0px; padding-bottom: 0px">
				<v-card elevation="5" shaped outlined>
					<v-card-text color="#000058">
						<v-row>
							<v-col cols="12" xs="12" sm="6" md="6">
								<v-text-field
									v-model="prenda"
									prepend-inner-icon="checkroom"
									rounded
									outlined
									dense
									color="blue daken-1"
									autofocus
									autocomplete="off"
									class="precio"
									id="nombrePrenda"
									@keyup.enter="agregarProducto()"
                                    @keyup.esc="step(1)"
									@keyup.up="rowArriba"
									@keyup.down="rowAbajo"
									@keyup.187="addArticuloKey"
									@keyup.109="removeArticuloKey"
									@keyup.123="agregarProducto"
                                    @keyup.96="isNumber"
                                    @keyup.97="isNumber"
                                    @keyup.98="isNumber"
                                    @keyup.99="isNumber"
                                    @keyup.100="isNumber"
                                    @keyup.101="isNumber"
                                    @keyup.102="isNumber"
                                    @keyup.103="isNumber"
                                    @keyup.104="isNumber"
                                    @keyup.105="isNumber"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" xs="12" sm="6" md="6">
								<v-text-field
									v-model="precio"
									prepend-inner-icon="monetization_on"
									rounded
									outlined
									dense
									color="green"
									type="number"
									
									autocomplete="off"
									class="precio"
									id="precioPrenda"
									@keyup.enter="agregarProducto()"
                                    @keyup.esc="step(1)"
									@keyup.up="rowArriba"
									@keyup.down="rowAbajo"
									@keyup.187="addArticuloKey"
									@keyup.109="removeArticuloKey"
									@keyup.123="agregarProducto"
                                   @keyup.69="isNumber()"
								>
								</v-text-field>
							</v-col>
						</v-row>
						<!-- Comienza Tabla -->
						<v-data-table
							v-model="selected"
							:headers="headers"
							:items="productos"
							:hide-default-footer="true"
							class="elevation-24"
							fixed-header
							height="40vh"
							disable-pagination
							@click:row="rowClick"
							item-key="idArray"
							single-select
							id="dataTable"
							@current-items="currentItems"
							:sort-by="['idArray']"
							:sort-desc="true"
						>
                        <!-- Nombre ARTICULO -->
							<template v-slot:[`item.nombre`]="{ item }" class="iconBorrar">
								<h2>{{ item.nombre }}</h2>
							</template>
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
									style="padding-top: 0px; padding-bottom: 0px"
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
                    <v-card-actions>
									<v-spacer></v-spacer
									><v-btn
										style="background: linear-gradient(#3232A6,#000058);"
										dark
										rounded
										class="cerrar"
										@click="step(1)"
                                        @keyup.esc="step(1)"
									
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
										@click="cantidadAtirulos > 0 ? step(3) : ''"
									>
										Siguiente
										<v-icon> skip_next</v-icon>
									</v-btn>
								</v-card-actions>
				</v-card>
			</v-col>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		data: () => ({
			prenda: "",
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
			limpiarData() {
				return this.$store.state.limpiarData.Home;
			},
			limpiarDataCobrar() {
				return this.$store.state.limpiarData.Cobrar;
			},
		},
		watch: {
			limpiarData() {
				this.limpiarDataPA();
			},
			limpiarDataCobrar() {
				this.focusPrecio();
			},
		},

		methods: {
			Pruebas() {
				console.log(this.limpiarData);
			},
			isNumber() {
                var numero =  parseInt(this.prenda);
                if (numero){
                document.getElementById("precioPrenda").focus();
				let element = document.getElementById("precioPrenda");
				element.select();
                this.precio = numero
                this.prenda = ""
                }
			},
			async agregarProducto() {
                
				if (this.precio > 0 && this.prenda) {
					await this.productos.push({
						idArray: this.idArticulo + 1,
						nombre: this.prenda,
						precio: Math.round(this.precio * 100) / 100,
						cantidad: 1,
						totalArticulo: 0,
					});
					this.precio = "";
                    this.prenda= "";
					this.dialog = 0;
					this.selectLastRow();
					this.idArticulo = this.idArticulo + 1;
					this.focusPrenda()
				} else if (this.precio <1 && this.total > 0 && !this.prenda) {
                    this.dataPA();
					this.step(3);
				} else if(!this.prenda && this.precio > 0 ){
                    this.focusPrenda()
                    }else if(this.prenda && !this.precio){
                        this.focusPrecio()
                        }else{
					
				}
                
			},
			async eliminarProducto(arr, item) {
				let i = arr.indexOf(item);
				if (i != -1) {
					await arr.splice(i, 1);
				}
                this.prenda= "";
				this.focusPrenda();
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
				this.prenda= "";
				this.focusPrenda();
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
				this.prenda= "";
				this.focusPrenda();
			},
			addArticuloKey() {
				this.selected[0].cantidad = this.selected[0].cantidad + 1;

				this.precio = 0;
                this.focusPrenda()
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
                this.focusPrenda()
			},
			focusPrecio() {
				document.getElementById("precioPrenda").focus();
				let element = document.getElementById("precioPrenda");
				element.select();
			},
            focusPrenda() {
				document.getElementById("nombrePrenda").focus();
				let element = document.getElementById("nombrePrenda");
				element.select();
                this.prenda = "";
			},
			rowClick(item, row) {
				console.log(row);
				row.select();
				this.prenda= "";
				this.focusPrenda();
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
			currentItems(e) {
				this.arrayTable = e;
			},
			cerrarCobrar() {
				this.$store.state.componentes.Cobrar = false;
			},
			step(paso) {
                this.$emit('e1PA', paso);
			},
            dataPA(){
                var data= {
                    cantidadAtirulos: this.cantidadAtirulos,
                }
            this.$emit('dataPA', data);
            },
			async limpiarDataPA() {
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
			},
		},
	};
</script>
