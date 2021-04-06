import gql from "graphql-tag";

export const REGISTER_VENTA = gql`
	mutation registerVenta($input: VentaInput){
  registerVenta(input: $input){
    id
    folio
    cancelado
    productos{
      nombre
      precio
      cancelado
    }
  }
}
`;
