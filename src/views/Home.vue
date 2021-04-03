<template>
  <v-layout align-start>
    <v-flex>
      <v-col sm="12" md="12" align="right">
        <h1>$ {{ (total = calcularTotal) }}</h1>
      </v-col>
      <v-col sm="12" md="12">
        <v-card elevation="24">
          <v-card-text color="#000058" style="padding-bottom: 0px">
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
              @keyup.enter="agregarProducto()"
            >
            </v-text-field>

            <v-data-table
              :headers="headers"
              :items="productos"
              :hide-default-footer="true"
              class="elevation-24"
            >
              <template v-slot:[`item.protein`]="{ item }">
                <v-text-field
                  autocomplete="off"
                  v-model="item.protein"
                  type="number"
                  class="cantidad"
                >
                </v-text-field>
              </template>

              <template v-slot:[`item.borrar`]="{ item }" class="iconBorrar">
                <v-icon
                  size="30"
                  color="red darken-1"
                  class="mr-2"
                  @click="eliminarDetalle(detalles, item)"
                >
                  delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    total: "$0.00",
    precio: "",
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "calories",
      },
      { text: "TICKET", value: "calories", sortable: false },
      { text: "PRODUCTO", value: "name", sortable: false },
      { text: "PRECIO", value: "carbs", sortable: false },
      { text: "CANTIDAD", value: "protein", sortable: false },
      { text: "APARTADO", value: "calories", sortable: false },
      { text: "REFERENCIA", value: "carbs", sortable: false },
      { text: "IMPORTE", value: "calories", sortable: false },
      { text: "BORRAR", value: "borrar", sortable: false },
    ],
    productos: [
      {
        name: "Frozen Yogurt",
        calories: 3,
        fat: 6.0,
        carbs: 2,
        protein: 4.0,
        iron: "1%",
      },
      {
        name: "Ice cream sandwich",
        calories: 5,
        fat: 9.0,
        carbs: 4,
        protein: 4.3,
        iron: "1%",
      },
    ],
  }),
  computed: {
    calcularTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.productos.length; i++) {
        resultado =
          resultado + this.productos[i].carbs * this.productos[i].calories;
      }
      return resultado;
    },
  },

  methods: {
    agregarProducto() {
      this.productos.push({
        name: "Frozen Yogurt",
        calories: this.precio,
        fat: this.precio,
        carbs: this.precio,
        protein: this.precio,
        iron: this.precio,
      });
      this.precio = "";
      this.dialog = 0;
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
</style>
