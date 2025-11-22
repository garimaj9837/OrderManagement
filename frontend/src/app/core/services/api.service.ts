import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8082'; // Order Service
  private readonly productServiceUrl = 'http://localhost:8081'; // Product Service
  private readonly customerServiceUrl = 'http://localhost:8083'; // Customer Service
  private readonly paymentServiceUrl = 'http://localhost:8084'; // Payment Service

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Order Service endpoints
  getOrderServiceUrl(): string {
    return this.baseUrl;
  }

  // Product Service endpoints
  getProductServiceUrl(): string {
    return this.productServiceUrl;
  }

  // Customer Service endpoints
  getCustomerServiceUrl(): string {
    return this.customerServiceUrl;
  }

  // Payment Service endpoints
  getPaymentServiceUrl(): string {
    return this.paymentServiceUrl;
  }

  // Generic HTTP methods
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(url, body, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}

