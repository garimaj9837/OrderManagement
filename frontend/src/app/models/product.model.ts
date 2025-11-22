export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  discount: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
}

