<template>
	<v-layout
		><v-flex>
			<v-dialog v-model="Imprimir" max-width="219" transition="none">
				<v-card
					><div id="tickets">
						<v-card-title @click="crearPDF">
							<img
								src="data:image/png;base64,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"
							/>
						</v-card-title>

						<v-card-text>
							<!-- FECHA -->
							<span>{{ fecha }}</span>
							<br />
							<!-- VENDEDOR -->
							<span>{{ `Vendedor: ${this.$store.state.usuario.name}` }}</span>
							<br />
							<!-- TICKET -->
							<span>Ticket:{{ folio }}</span>
							<br />
							<!-- TOTAL -->
							<v-row style="padding-top: 5px;" v-if="total > 0">
								<v-col align="right" class="finalTicket">
									<h3>Total:</h3>
									<h2>${{ total }}</h2>
								</v-col>
							</v-row>
							<!-- EFECTIVO -->
							<v-row v-if="efectivo > 0">
								<v-col align="right" class="finalTicket">
									<h3>Efectivo:</h3>
									<h2>${{ efectivo }}</h2>
								</v-col>
							</v-row>
							<!-- TARJETA -->
							<v-row v-if="tarjeta > 0">
								<v-col align="right" class="finalTicket">
									<h3>Tarjeta:</h3>
									<h2>${{ tarjeta }}</h2>
								</v-col>
							</v-row>
							<!-- A CUENTA -->
							<v-row v-if="aCuenta > 0">
								<v-col align="right" class="finalTicket">
									<h3>A cueta:</h3>
									<h2>${{ aCuenta }}</h2>
								</v-col>
							</v-row>
							<!-- CAMBIO -->
							<v-row>
								<v-col align="right" class="finalTicket">
									<h3>Cambio:</h3>
									<h2>${{ cambio }}</h2>
								</v-col>
							</v-row>
							<br />
							<v-divider />
							<!-- TABLA DE PRODUCTOS -->
							<table v-for="item in productos" :key="item.id" class="productos">
								<tr>
									<td>{{ item.nombre }}</td>
									<td>
										<h3>${{ item.precio }}</h3>
									</td>
								</tr>
								<tr v-if="item.cantidad > 1">
									<td>X{{ item.cantidad }}</td>
									<td>
										<h3>${{ item.totalArticulo }}</h3>
									</td>
								</tr>
								<v-divider />
							</table>
						</v-card-text>
					</div>
				</v-card>
			</v-dialog>
		</v-flex>
	</v-layout>
</template>

<script>
	import jsPDF from "jspdf";
	import moment from "moment";
	import "moment/locale/es-us";
	import html2canvas from "html2canvas";

	export default {
		props: [
			"dataProductos",
			"dataTotal",
			"dataCambio",
			"dataEfectivo",
			"dataTarjeta",
			"dataaCuenta",
			"dataFolio",
		],
		data: () => ({
			fecha: moment().format("LLL"),
			productos: [],
			total: 0,
			cambio: 0,
			efectivo: 0,
			tarjeta: 0,
			aCuenta: 0,
			folio: 0,
		}),
		computed: {
			Imprimir() {
				return this.$store.state.componentes.Imprimir;
			},
		},
		watch: {
			Imprimir() {
				if (this.$store.state.componentes.Imprimir === true) {
					this.propsImprimir();
				}
			},
		},
	 	mounted() {
			this.propsImprimir();
		}, 
		methods: {
		async	propsImprimir() {
				this.productos = this.$props.dataProductos;
				this.efectivo = this.$props.dataEfectivo;
				this.total = this.$props.dataTotal;
				this.cambio = this.$props.dataCambio;
				this.tarjeta = this.$props.dataTarjeta;
				this.aCuenta = this.$props.dataaCuenta;
				this.folio = this.$props.dataFolio;
				await new Promise((resolve) => setTimeout(resolve, 10));
				this.crearPDF();
				
			},
			async crearPDF() {
				var element = await document.getElementById("tickets");
				console.log(element.body)
				if (await element) {
					html2canvas(element).then((canvas) => {
						  // if the canvas is rendered
 
						 var imgData = canvas.toDataURL("image/png");
						var imgWidth = 58;
						var pageHeight = 295;
						var imgHeight = (canvas.height * imgWidth) / canvas.width;
						const doc = new jsPDF({
							format: [58, imgHeight],
						});
						var position = 0;
						doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
					

						doc.autoPrint();
						doc.output("dataurlnewwindow", { filename: "comprobante.pdf" });
					 
					});
					 this.cerrarYlimpiar();
					
				}
			},

			cerrarYlimpiar() {
				this.$store.state.componentes.Imprimir = false;
				this.$store.state.componentes.Cobrar = false;
				this.$store.state.limpiarData.Cobrar = true;
				this.$store.state.limpiarData.Home = true;
			},
		},
	};
</script>
<style>
	.finalTicket {
		display: flex;
		align-items: center;
		place-content: flex-end;
		padding-bottom: 0px;
	}
	.productos {
		padding-bottom: 0px;
		text-indent: initial;
	}
	.productos td {
		padding: 0.2em 0.8em;
		text-align: left;
		padding-bottom: 0px;
		padding-top: 0px;
	}
	.theme--light.v-divider {
		color: black;
		border-color: black;
	}
</style>
