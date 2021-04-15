<template>
	<v-layout>
		<v-flex>
			<v-dialog
				v-model="AddProdApartado"
				max-width="1000px"
				class="modalCitaModal"
				persistent
			>
				<v-card shaped>
					<v-toolbar color="primary" dark style="font-weight: bold">
						<v-toolbar-title class="font-weight flex">
							<v-icon>checkroom</v-icon>
							Agregar producto</v-toolbar-title
						><v-btn
							color="#D32F2F"
							style="background: linear-gradient(#F53636,#D32F2F);"
							dark
							rounded
							small
							@click="cerrarAddProdApartado"
							class="cerrar"
						>
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card-text class="contenidocitaModal">
						<v-container>
							<v-row style="padding-top: 20px">
								<v-col cols="12" xs="12" sm="6" md="6">
									<v-text-field
										v-model="prenda"
										label="Prenda"
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
										@keyup.esc="cerrarAddProdApartado"
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
										label="Precio"
										color="green"
										type="number"
										autocomplete="off"
										class="precio"
										id="precioPrenda"
										@keyup.enter="agregarProducto()"
										@keyup.esc="cerrarAddProdApartado"
										@keyup.123="agregarProducto"
										@keyup.69="isNumber()"
									>
									</v-text-field>
								</v-col>
							</v-row>
							<v-card-actions>
								<v-btn
									style="background: linear-gradient(#32A632,#005800); 
                            inline-size: -webkit-fill-available;
                            margin-left: 70px;
                            margin-right: 70px"
									dark
									@click="agregarProducto()"
								>
									<v-icon>
										save
									</v-icon>
									Agregar Producto
								</v-btn>
							</v-card-actions>
						</v-container>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-flex>
	</v-layout>
</template>

<script>
import {ADD_PRODUCTO} from '../../graphql/apartado'
	export default {
		props: ["dataFolio"],
		data: () => ({
			prenda: "",
			precio: 0,
			rules: {
				precio: [(val) => (val || "") > 0 || "Error en precio"],
			},
		}),
		computed: {
			AddProdApartado() {
				return this.$store.state.componentes.AddProdApartado;
			},
		},
		methods: {
			async guardadProdApartado() {
				this.btnLoading = true;
					const { data, loading, error } = await this.$apollo
						.mutate({
							// Query Mutation
							mutation: ADD_PRODUCTO,
							// Parameters
							variables: {
								input: {
									id: this.$props.dataFolio,
									nombre: this.prenda,
                                    precio: parseFloat(this.precio),
								},
							},
						})
                        console.log(data)
			},
			cerrarAddProdApartado() {
				this.$store.state.componentes.AddProdApartado = false;
				this.$store.state.limpiarData.AddProdApartado = true;
			},
			isNumber() {
				var numero = parseInt(this.prenda);
				if (numero) {
					document.getElementById("precioPrenda").focus();
					let element = document.getElementById("precioPrenda");
					element.select();
					this.precio = numero;
					this.prenda = "";
				}
			},
			async agregarProducto() {
				if (this.precio > 0 && this.prenda) {
					this.guardadProdApartado();
				} else if (!this.prenda && this.precio > 0) {
					this.focusPrenda();
				} else if (this.prenda && !this.precio) {
					this.focusPrecio();
				} else {
				}
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
		},
	};
</script>

<style>
	.precio {
		font-weight: 700;
	}

	.cerrar {
		float: right;
	}
</style>
