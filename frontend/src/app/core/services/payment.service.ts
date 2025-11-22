import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Payment, PaymentRequest } from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly baseUrl = '/payments';

  constructor(private apiService: ApiService) {}

  getAllPayments(): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}`
    );
  }

  getPaymentById(paymentId: number): Observable<Payment> {
    return this.apiService.get<Payment>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}/${paymentId}`
    );
  }

  createPayment(payment: PaymentRequest): Observable<Payment> {
    return this.apiService.post<Payment>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}`,
      payment
    );
  }

  updatePayment(paymentId: number, payment: Partial<PaymentRequest>): Observable<Payment> {
    return this.apiService.put<Payment>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}/${paymentId}`,
      payment
    );
  }

  deletePayment(paymentId: number): Observable<void> {
    return this.apiService.delete<void>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}/${paymentId}`
    );
  }

  getPaymentsByOrderId(orderId: number): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}/order/${orderId}`
    );
  }

  getPaymentsByCustomerId(customerId: number): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}/customer/${customerId}`
    );
  }

  updatePaymentStatus(paymentId: number, status: string): Observable<Payment> {
    return this.apiService.patch<Payment>(
      `${this.apiService.getPaymentServiceUrl()}${this.baseUrl}/${paymentId}/status`,
      { status }
    );
  }
}

