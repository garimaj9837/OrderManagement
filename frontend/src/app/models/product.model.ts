export interface Product {
  productId: number;
  productName: string;
  productCategory: string;
  productquantity: number;
  productPrice: number;
  productDiscount: number;
}

export interface ProductRequest {
  productName: string;
  productCategory: string;
  productquantity: number;
  productPrice: number;
  productDiscount: number;
}

