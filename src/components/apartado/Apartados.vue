<template>
	<v-layout align-start>
		<v-flex>
			<h3>
				<v-icon x-large color="black">checkroom</v-icon>
				Apartados
			</h3>
			<!-- tabla PCIENTES -->
			<v-col>
				<v-card>
					<v-toolbar style="background: linear-gradient(#0000A6,#000066);" dark>
						<v-toolbar-title class="font-weight flex">
							<v-row>
								<v-col xs="10" sm="10" md="10">
									<v-text-field
										v-model="search"
										hide-details
										autofocus
										solo-inverted
										rounded
										class="searchApartado"
										color="blue darken-3"
										prepend-inner-icon="search"
										label="Buscar Apartado"
										id="busqueda"
										autocomplete="off"
										@keyup.up="rowArriba"
										@keyup.down="rowAbajo"
									></v-text-field>
								</v-col>
								<v-col xs="2" sm="2" md="2" style="padding-top: 15px">
									<v-btn class="btnAgregar" rounded style="background: linear-gradient(#2196F3,#0000E6);"
										><v-icon>checkroom</v-icon>Nuevo</v-btn
									>
								</v-col>
							</v-row>
						</v-toolbar-title>
					</v-toolbar>
					<!-- escribir nombre apartado -->
					<v-card-text>
						<v-row>
							<!-- TABLA DE APARTADOS -->
							<v-col xs="12" sm="8" md="8">
								<v-data-table
									v-model="selected"
									:headers="headersClientes"
									:items="clientesList"
									:search="search"
									:hide-default-footer="true"
									:sort-by="['folio']"
									:sort-desc="true"
									@click:row="rowClick"
									@current-items="currentItems"
									fixed-header
									disable-pagination
									single-select
									class="elevation-24"
									item-key="folio"
									id="dataTable"
								>
									<template v-slot:[`item.folio`]="{ item }">
										<router-link
											:to="{ name: 'apartado', params: { id: item.folio } }"
										>
											<v-btn color="blue darken-4" dark rounded small>
												<strong style="font-size: 1.5em;"
													>{{ item.folio }}
												</strong>
											</v-btn>
										</router-link>
									</template>

									<!-- Nombre -->
									<template v-slot:[`item.cliente`]="{ item }">
										<router-link
											:to="{ name: 'apartado', params: { id: item.folio } }"
										>
											<strong color="primary" style="font-size: 1.5em;"
												>{{ item.cliente }}
											</strong>
										</router-link>
									</template>

									<!-- Vence -->
									<template v-slot:[`item.vence`]="{ item }">
										<strong style="font-size: 1.5em;"
										:to="{ name: 'apartado', params: { id: item.folio } }"
										>
											{{ pasarAFecha(item) }}
										</strong>
									</template>

									<!-- Vendedor -->
									<template v-slot:[`item.vendedor`]="{ item }">
										<strong style="font-size: 1.5em;">
											{{ item.vendedor }}
										</strong>
									</template>

									<!-- Si no encuentra clientes -->
									<template v-slot:no-data>
										<v-data-table
											:hide-default-header="true"
											:hide-default-footer="true"
											loading
											loading-text="No se han encontrado Clientes..."
											
										></v-data-table>
										<v-btn color="primary" @click="listarClientes()">
											Recargar
										</v-btn>
									</template>
								</v-data-table>
							</v-col>
							<!-- SEGUNDA TABLA PRODUCTOS DE APARTADO -->
							<v-col xs="12" sm="4" md="4" style="padding-left: 0px">
								<ProductosDeApartado
									componente="ProductosDeApartado"
									:dataFolio="selected[0] ? selected[0].folio : 0"
								/>
							</v-col>
						</v-row>
					</v-card-text>
					
				</v-card>
			</v-col>
			<!-- Termina tabla PACIENTES -->
		</v-flex>
	</v-layout>
</template>

<script>
	import { REGISTER_APARTADO } from "../../graphql/apartado";
	import gql from "graphql-tag";
	import moment from "moment";
	import ProductosDeApartado from "./ProductosDeApartado";

	export default {
		components: { ProductosDeApartado },
		data: () => ({
			arrayTable: [],
			selected: [],
			selectedId: -1,
			search: "",
			apartado: "",
			itemPropsCita: [],
			itemPropsPaciente: [],
			clientesList: [],
			headersClientes: [
				{ text: "Id", value: "folio", sortable: true, align: "finish" },
				{ text: "Cliente", value: "cliente", sortable: true },
				{ text: "Vence", value: "vence" },
				{ text: "Vendedor", value: "vendedor", sortable: false },
				/* { text: "Opciones", value: "opciones", sortable: false }, */
			],
		}),

		computed: {},

		watch: {},

		created() {
			this.listarClientes();
		},

		methods: {
			async listarClientes() {
				var { data } = await this.$apollo.query({
					query: gql`
						query getApartados {
							getApartados {
								id
								cliente
								folio
								vence
								vendedor
								entregado {
									status
								}
								cancelado {
									status
								}
							}
						}
					`,
				});
				if (data) {
					this.clientesList = await data.getApartados;
					this.selectLastRow();
				}
			},
			pasarAFecha(item) {
				var fecha = moment.unix(item.vence / 1000).format("LL");
				return fecha;
			},
			rowClick(item, row) {
				console.log(row);
				row.select();
				this.focusPrecio();
			},
			focusPrecio() {
				document.getElementById("busqueda").focus();
				let element = document.getElementById("busqueda");
				element.select();
			},
			currentItems(e) {
				this.arrayTable = e;
			},
			selectLastRow() {
				const ultimo = this.arrayTable[0];
				this.selected = [ultimo];
			},
			rowAbajo() {
				
					try {
						const ultimo = this.clientesList[0].folio;
					if (this.selected[0].folio != ultimo) {
						const pos = this.selected[0].folio;
						for (var i = 0; i < this.arrayTable.length; i++) {
							if (this.arrayTable[i].folio == pos) {
								i++;
								this.selected = [this.arrayTable[i]];
							}
						}
					}
					} catch (error) {
						this.selectLastRow();
					}
				
				
				this.precio = [];
			},
			rowArriba() {
				if (this.selected[0]) {
					const ultimo = this.clientesList[this.clientesList.length - 1].folio;
					if (this.selected[0].folio != ultimo) {
						const pos = this.selected[0].folio;
						for (var i = 0; i < this.arrayTable.length; i++) {
							if (this.arrayTable[i].folio == pos) {
								let a = i - 1;
								this.selected = [this.arrayTable[a]];
							}
						}
					}
				} else {
					this.selectLastRow();
				}
				this.precio = [];
			},
		},
	};
</script>

<style>
	.bordes {
		border-radius: 50px 0px 25px 0px;
	}
	.searchApartado input {
		font-size: 1.8em;
		text-align: center;
		font-weight: 700;
	}
	.searchApartado .v-icon {
		padding-top: 5px;
		font-size: 35px;
	}
</style>
