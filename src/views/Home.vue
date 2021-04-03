<template>
	<v-layout align-start>
		<v-flex>
			<v-col sm="12" md="12" style="padding-top: 0px; padding-bottom: 0px">
				<v-card elevation="24" >
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
              id="precio"
							@keyup.enter="agregarProducto()"
							@keyup.f12="agregarProducto()"
						>
						</v-text-field>

						<v-data-table
							:headers="headers"
							:items="productos"
							:hide-default-footer="true"
							class="elevation-24"
              fixed-header
    height="60vh"
						>
            <!-- Cantidad Articulos -->
							<template 
              v-slot:[`item.cantidad`]="{ item }">
								<v-text-field
									autocomplete="off"
									v-model="item.cantidad"
									type="number"
									class="cantidad"
                   prepend-icon="remove_circle"
                    append-outer-icon="add_circle"
                    readonly
                  value=1
                   min="1" 
                   max="30"
            @click:append-outer="addArticulo(item)"
            @click:prepend="removeArticulo(item)"
								>
                {{item.cantidad}}
								</v-text-field>
							</template>
							<!-- TOTAL ARTICULO -->
							<template
								v-slot:[`item.totalArticulo`]="{ item }"
								class="iconBorrar"
							>
								<h2>
									{{ (item.totalArticulo = item.precio * item.cantidad) }}
								</h2>
							</template>
							<!-- BORRAR -->
							<template v-slot:[`item.borrar`]="{ item }" class="iconBorrar">
								<v-icon
									size="30"
									color="red darken-1"
									class="mr-2"
									@click="eliminarProducto(productos, item)"
								>
									delete
								</v-icon>
							</template>
						</v-data-table>
					</v-card-text>

					<v-card-text style="padding-left: 0px;">
						<!-- Total Total -->
						<v-row >
							<v-col sm="12" md="12" align="right" class="finalTabla">
								<h1 class="cantidad">{{ (cantidadAtirulos = calcularArticulos)}}</h1>
                <h2 class="totalTotal">$ {{ (total = calcularTotal) }}</h2>
                </v-col>
							</v-row
						>
					</v-card-text>
				</v-card>
			</v-col>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		data: () => ({
			total: 0,
			cantidadAtirulos: 0,
			precio: "",
			headers: [
				{
					text: "ID",
					align: "start",
					sortable: false,
					value: "id",
				},
				{ text: "TICKET", value: "ticket", sortable: false },
				{ text: "PRODUCTO", value: "name", sortable: false },
				{ text: "PRECIO", value: "precio", sortable: false },
				{ text: "CANTIDAD", value: "cantidad", sortable: false },
				{ text: "APARTADO", value: "apartado", sortable: false },
				{ text: "REFERENCIA", value: "referencia", sortable: false },
				{ text: "TOTAL", value: "totalArticulo", sortable: false },
				{ text: "BORRAR", value: "borrar", sortable: false },
			],
			productos: [
				{
					id: 1,
					ticket: 5,
					name: "Frozen Yogurt",
					precio: 5,
					cantidad: 4,
					apartado: 5,
					referencia: "5",
					totalArticulo: "",
				},
				{
					id: 2,
					ticket: 5,
					name: "Frozen Yogurt",
					precio: 5,
					cantidad: 5,
					apartado: 5,
					referencia: "5",
					totalArticulo: "",
				},
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
					res = res + (parseInt(this.productos[i].cantidad));
				}
				return res;
			},
		},

		methods: {
			agregarProducto() {
				this.productos.push({
					id: (this.productos.length + 1),
					ticket: 5,
					name: "Frozen Yogurt",
					precio: this.precio,
					cantidad: 1,
					apartado: 5,
					referencia: "5",
					totalArticulo: "",
				});
				this.precio = "";
				this.dialog = 0;
			},
			eliminarProducto(arr, item) {
				let i = arr.indexOf(item);
				if (i != -1) {
					arr.splice(i, 1);
				}
         this.focusPrecio()
			},
      addArticulo(item){
        const {id} = item
      for (var i = 0; i < this.productos.length; i++) {
        if (this.productos[i].id == id) {
         this.productos[i].cantidad = (this.productos[i].cantidad + 1)
        }
      }
      this.focusPrecio()

      },
      removeArticulo(item){
  const {id} = item
      for (var i = 0; i < this.productos.length; i++) {
        if (this.productos[i].id == id) {
          if (this.productos[i].cantidad>1){
         this.productos[i].cantidad = (this.productos[i].cantidad - 1)
          }else {
            this.eliminarProducto(this.productos, item)
          }
        }
      }
      this.focusPrecio()
      },

      focusPrecio(){
        document.getElementById("precio").focus();
      }
		},
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
    margin-top: calc(1 * (.5vw + 0.5vh));
    margin-bottom: calc(2 * (.5vw + 0.5vh));
		font-size: calc(8 * (.5vw + 0.5vh));
		color: green;
	}
	.cantidad {
    font-size:  calc(4 * (.5vw + 0.5vh));
		color: #000058;
	}
  .finalTabla{
     display: flex;
  align-items: center;
  place-content: flex-end;
  padding-left: 0px;
  }
  .finalTabla h1{
     padding-right: 3vh;
  }
</style>
