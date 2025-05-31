//INTERFAZ PARA LA DEFINICION DE LOS DATOS QUE LLEVA UNA COLUMNA
export interface TableColumn {
  label: string; //TEXTO
  def: string; //DEFINICION
  dataKey: string; //KEY
  formatt?: string; //FORMATO DE TEXTO
  dataType?: 'date' | 'object' | 'status' | 'order-status' | 'line-status'; //TIPO DE DATO
}
