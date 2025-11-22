export interface Order {
  orderId: number;
  customerId: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  orderitems: OrderItem[];
}

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerId: number;
  orderitemRequest: OrderItemRequest[];
}

export interface OrderItemResponse {
  productId: number;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
  available: boolean;
  message: string;
}

export enum OrderStatus {
  PLACED = 'PLACED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING'
}

