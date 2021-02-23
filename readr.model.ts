export interface FileUploadedResult {
  items_cant?: number;
  fileURL?: string;
  file_name?: string;
  doc_id?: string;
  columns?: string[];
  file_ref?: string;
}

export interface ColumnsRequest {
  fieldid: string;
  columns: DefaultColumns;
}

export interface DefaultColumns {
  categorias?: string | string[];
  subcategorias?: string | string[];
  descripcion?: string;
  onStock?: string | boolean;
  referencia?: string;
  stockCant?: string | number;
  imagenUrl?: string;
  id?: string;
  precio?: string | number;
}

export interface ProductsResult {
  columns: string[];
  cols_details: string[];
  items: Object[];
  items_details: Object[];
  firebase_status: string;
}

export const DefaultColumnsList = [
  'id',
  'precio',
  'referencia',
  'descripcion',
  'categorias',
  'subcategorias',
  'onStock',
  'stockCant',
  'imagenUrl',
];

export interface ColumnsDefinedResult {
  items: DefaultColumns[];
  items_details: Object[];
  firebase_status: string;
}

export type DefaultCol =
  | 'categorias'
  | 'subcategorias'
  | 'descripcion'
  | 'onStock'
  | 'referencia'
  | 'stockCant'
  | 'imagenUrl'
  | 'id'
  | 'precio';
