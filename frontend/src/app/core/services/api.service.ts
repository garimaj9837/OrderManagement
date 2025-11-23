import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8081'; // Order Service
  private readonly productServiceUrl = 'http://localhost:8083'; // Product Service
  private readonly customerServiceUrl = 'http://localhost:8080'; // Customer Service
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
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the service is running.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. You do not have permission.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.error) {
        // Try to extract message from different possible error formats
        errorMessage = error.error.message || 
                      error.error.error || 
                      (typeof error.error === 'string' ? error.error : error.message) || 
                      errorMessage;
      } else {
        errorMessage = error.message || errorMessage;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => ({ message: errorMessage, error: error.error, status: error.status }));
  };
}

