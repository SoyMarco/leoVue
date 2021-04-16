import gql from "graphql-tag";

export const GET_PRODUCTOS_FOLIO = gql`
query getProductosFolio($folio: Float) {
	getProductosFolio(folio: $folio) {
		id
		vendedor
		cliente
		folio
		total
		referencia
		notas
		createAt
		vence
		productos{
			vendedor
			nombre
			precio
			cantidad
			totalArticulo
			idArray
			_id
			createAt
			entregado{
				status
				fecha
				vendedor
			}
			sacado{
				status
				fecha
				vendedor
			}
			cancelado{
				status
				fecha
				vendedor
			}
		}
		abonos{
			_id
			abono
			vendedor
			createAt
			cancelado{
				status
				fecha
				vendedor
			}
		}
		entregado{
			status
			fecha
			vendedor
		}
		sacado{
			status
			fecha
			vendedor
		}
		cancelado{
			status
			fecha
			vendedor
		}
	}
}
`;

export const ADD_ABONO = gql`
mutation addAbono($input: AbonoApartadoInput){
  addAbono(input: $input){
    abonos{
			_id
			abono
			vendedor
			createAt
			cancelado{
				status
				fecha
				vendedor
			}
		}
  }
}
`;
export const ADD_PRODUCTO = gql`
mutation addProducto($input: ProductoApartadoInput){
  addProducto(input: $input){
		id
		vendedor
		cliente
		folio
		total
		referencia
		notas
		createAt
		vence
		productos{
			vendedor
			nombre
			precio
			cantidad
			totalArticulo
			idArray
			_id
			createAt
			entregado{
				status
				fecha
				vendedor
			}
			sacado{
				status
				fecha
				vendedor
			}
			cancelado{
				status
				fecha
				vendedor
			}
		}
		abonos{
			_id
			abono
			vendedor
			createAt
			cancelado{
				status
				fecha
				vendedor
			}
		}
		entregado{
			status
			fecha
			vendedor
		}
		sacado{
			status
			fecha
			vendedor
		}
		cancelado{
			status
			fecha
			vendedor
		}
	}
}
`;

/* export const REGISTER_APARTADO = gql`
	mutation registerApartado($input: ApartadoInput) {
		registerApartado(input: $input) {
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			abonos{
				id
				abono
			}
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				idUnico
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`; */

/* export const APARTADOS = gql`
query getApartados {
  getApartados {
	id
	cliente
	folio
	vence
	vendedor
	entregado{
	  status
	}
	 cancelado{
	  status
	}
  }
}
`; */
