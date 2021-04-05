<template>
  <v-layout align-start>
    <v-flex>
      <div>{{ selectedId.index }}</div>
      <v-col sm="12" md="12" style="padding-top: 0px; padding-bottom: 0px">
        <v-card elevation="24">
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
              @keyup.up="rowArriba"
              @keyup.down="rowAbajo"
              @keyup.187="addArticuloKey"
              @keyup.109="removeArticuloKey"
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
              item-key="id"
              single-select
              id="dataTable"
              @current-items="currentItems"
            >
              <!-- Cantidad Articulos -->
              <template v-slot:[`item.cantidad`]="{ item }">
                <v-text-field
                  autocomplete="off"
                  v-model="item.cantidad"
                  type="number"
                  class="cantidad"
                  prepend-icon="remove_circle"
                  append-outer-icon="add_circle"
                  readonly
                  value="1"
                  min="1"
                  max="30"
                  style="padding-top: 0px; border-bottom: 0px"
                  @click:append-outer="addArticulo(item)"
                  @click:prepend="removeArticulo(item)"
                >
                  {{ item.cantidad }}
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
            <!-- Total Total -->
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
    </v-flex>
  </v-layout>
</template>

<script>
import { REGISTER_VENTA } from "../graphql/venta";
export default {
  data: () => ({
    arrayTable: [],
    select: "",
    selected: [],
    selectedId: -1,
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
        name: "Articulot",
        precio: 5,
        cantidad: 4,
        apartado: 5,
        referencia: "5",
        totalArticulo: "",
      },
      {
        id: 2,
        ticket: 5,
        name: "Articulot",
        precio: 5,
        cantidad: 5,
        apartado: 5,
        referencia: "5",
        totalArticulo: "",
      },
    ],
  }),
  computed: {
    calcularTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.productos.length; i++) {
        resultado = resultado + this.productos[i].totalArticulo;
      }
      return resultado;
    },
    calcularArticulos: function () {
      let res = 0.0;
      for (var i = 0; i < this.productos.length; i++) {
        res = res + parseInt(this.productos[i].cantidad);
      }
      return res;
    },
  },
  watch: {
    rowSelect() {},
  },

  methods: {
	  Pruebas(){
console.log(this.total)
	  },
    async addProducto() {
      const addProd = await this.$apollo
        .mutate({
          // Query Mutation
          mutation: REGISTER_VENTA,
          // Parameters
          variables: {
            input: {
              vendedor: this.$store.state.usuario.name,
              total: this.total,
              efectivo: 6,
              tarjeta: 6,
              aCuenta: 6,
              pagoCon: 6,
              referencia: "String",
              notas: "String",
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
          id: this.productos.length + 1,
          ticket: 5,
          name: "Frozen Yogurt",
          precio: Math.round(this.precio * 100) / 100,
          cantidad: 1,
          apartado: 5,
          referencia: "5",
          totalArticulo: "",
        });
        this.precio = "";
        this.dialog = 0;
        this.selectLastRow();
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
    addArticulo(item) {
      const { id } = item;
      for (var i = 0; i < this.productos.length; i++) {
        if (this.productos[i].id == id) {
          this.productos[i].cantidad = this.productos[i].cantidad + 1;
        }
      }
      this.focusPrecio();
    },

    removeArticulo(item) {
      const { id } = item;
      for (var i = 0; i < this.productos.length; i++) {
        if (this.productos[i].id == id) {
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
      document.getElementById("precio").focus();
    },
    rowClick(item, row) {
      row.select();
      this.focusPrecio();
    },
    selectLastRow() {
      const ultimo = this.arrayTable[this.arrayTable.length - 1];
      this.selected = [ultimo];
    },
    rowAbajo() {
      if (this.selected[0]) {
        const ultimo = this.productos[this.productos.length - 1].id;
        if (this.selected[0].id != ultimo) {
          const pos = this.selected[0].id;
          for (var i = 0; i < this.arrayTable.length; i++) {
            if (this.arrayTable[i].id == pos) {
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
        const ultimo = this.productos[0].id;
        console.log(ultimo);
        if (this.selected[0].id != ultimo) {
          const pos = this.selected[0].id;
          for (var i = 0; i < this.arrayTable.length; i++) {
            if (this.arrayTable[i].id == pos) {
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
  margin-top: calc(1 * (0.5vw + 0.5vh));
  margin-bottom: calc(2 * (0.5vw + 0.5vh));
  font-size: calc(8 * (0.5vw + 0.5vh));
  color: green;
}
.cantidad {
  font-size: calc(4 * (0.5vw + 0.5vh));
  color: #000058;
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
