import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = 'http://localhost:8085/auth'; // Auth Service URL
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Use responseType: 'text' to handle plain string response from backend
    return this.http.post(`${this.authUrl}/login`, credentials, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      tap(token => {
        if (token) {
          // Handle case where token might be wrapped in quotes or extra whitespace
          const cleanToken = token.trim().replace(/^"|"$/g, '');
          this.setToken(cleanToken);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        // Extract error message from error response
        let errorMessage = 'Login failed. Please check your credentials.';
        if (error.error) {
          if (typeof error.error === 'string') {
            try {
              const errorObj = JSON.parse(error.error);
              errorMessage = errorObj.message || errorObj.error || errorMessage;
            } catch {
              errorMessage = error.error;
            }
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        return throwError(() => ({ message: errorMessage, error: error.error, status: error.status }));
      })
    );
  }

  register(userData: RegisterRequest): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.authUrl}/register`, userData, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      tap(() => {
        // After registration, optionally auto-login
      }),
      catchError(error => {
        let errorMessage = 'Registration failed. Please try again.';
        if (error.error) {
          if (typeof error.error === 'string') {
            try {
              const errorObj = JSON.parse(error.error);
              errorMessage = errorObj.message || errorObj.error || errorMessage;
            } catch {
              errorMessage = error.error;
            }
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        return throwError(() => ({ message: errorMessage, error: error.error, status: error.status }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}

