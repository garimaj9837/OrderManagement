import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, CustomerRequest } from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = '/customer';
  private readonly customerStorageKey = 'current_customer';
  private currentCustomerSubject: BehaviorSubject<Customer | null>;
  public currentCustomer$ : Observable<Customer | null>;

  constructor(private apiService: ApiService) {
    this.currentCustomerSubject = new BehaviorSubject<Customer | null>(this.getStoredCustomer());
    this.currentCustomer$ = this.currentCustomerSubject.asObservable();
  }

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

  getMyCustomer(): Observable<Customer> {
    return this.apiService.get<Customer>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}/me`
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

  updateMyCustomer(customer: Partial<CustomerRequest>): Observable<Customer> {
    return this.apiService.put<Customer>(
      `${this.apiService.getCustomerServiceUrl()}${this.baseUrl}/me`,
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

  setCurrentCustomer(customer: Customer | null): void {
    if (customer) {
      localStorage.setItem(this.customerStorageKey, JSON.stringify(customer));
    } else {
      localStorage.removeItem(this.customerStorageKey);
    }
    this.currentCustomerSubject.next(customer);
  }

  getCurrentCustomer(): Customer | null {
    return this.currentCustomerSubject.value;
  }

  clearCurrentCustomer(): void {
    this.setCurrentCustomer(null);
  }

  private getStoredCustomer(): Customer | null {
    const stored = localStorage.getItem(this.customerStorageKey);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse stored customer', error);
      localStorage.removeItem(this.customerStorageKey);
      return null;
    }
  }
}

