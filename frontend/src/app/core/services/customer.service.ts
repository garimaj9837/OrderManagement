import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, CustomerRequest } from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = '/customers';

  constructor(private apiService: ApiService) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}`
    );
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.apiService.get<Customer>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}/${customerId}`
    );
  }

  createCustomer(customer: CustomerRequest): Observable<Customer> {
    return this.apiService.post<Customer>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}`,
      customer
    );
  }

  updateCustomer(customerId: number, customer: Partial<CustomerRequest>): Observable<Customer> {
    return this.apiService.put<Customer>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}/${customerId}`,
      customer
    );
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.apiService.delete<void>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}/${customerId}`
    );
  }

  getCustomerByEmail(email: string): Observable<Customer> {
    return this.apiService.get<Customer>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}/email/${email}`
    );
  }
}

