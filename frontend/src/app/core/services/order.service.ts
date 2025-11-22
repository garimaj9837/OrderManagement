import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, OrderRequest, OrderItemResponse, OrderItem } from '../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = '/orders';

  constructor(private apiService: ApiService) {}

  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}`
    );
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.apiService.get<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/${orderId}`
    );
  }

  createOrder(order: OrderRequest): Observable<Order> {
    return this.apiService.post<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}`,
      order
    );
  }

  updateOrder(orderId: number, order: Partial<Order>): Observable<Order> {
    return this.apiService.put<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/${orderId}`,
      order
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.apiService.patch<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/${orderId}/status`,
      { status }
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.apiService.delete<void>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/${orderId}`
    );
  }

  addToCart(orderRequest: OrderRequest): Observable<OrderItemResponse[]> {
    return this.apiService.post<OrderItemResponse[]>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/cart`,
      orderRequest
    );
  }

  addItemToOrder(orderId: number, item: OrderItem): Observable<Order> {
    return this.apiService.post<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/addItem/${orderId}/items`,
      item
    );
  }

  updateOrderItem(orderId: number, itemId: number, item: Partial<OrderItem>): Observable<Order> {
    return this.apiService.put<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/updateItem/${orderId}/item/${itemId}`,
      item
    );
  }

  deleteOrderItem(orderId: number, itemId: number): Observable<Order> {
    return this.apiService.delete<Order>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/deleteitem/${orderId}/items/${itemId}`
    );
  }

  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.apiService.get<Order[]>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}/customer/${customerId}`
    );
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(
      `${this.apiService.getOrderServiceUrl()}${this.baseUrl}?status=${status}`
    );
  }
}

