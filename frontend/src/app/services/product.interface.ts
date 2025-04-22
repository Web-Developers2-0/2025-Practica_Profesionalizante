export interface Product {
  id_product: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  image?: string;
  pages?: number;
  format?: string;
  weight?: string;
  isbn?: string;
  calification?: number;
  category: number;
  quantity: number;
}

export interface Compras {
  product: Product;
  quantity: number;
}
