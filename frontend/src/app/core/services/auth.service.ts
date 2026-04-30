import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.model';
import { CustomerService } from './customer.service';
import { environment } from '../../../environments/environment';

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
  private readonly authUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private customerService: CustomerService
  ) {}

  login(credentials: LoginRequest): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Use responseType: 'text' to handle plain string response from backend
    return this.http.post(`${this.authUrl}/login`, credentials, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      switchMap(token => {
        if (token) {
          // Handle case where token might be wrapped in quotes or extra whitespace
          const cleanToken = token.trim().replace(/^"|"$/g, '');
          this.setToken(cleanToken);
          this.isAuthenticatedSubject.next(true);
          
          // Fetch user info after successful login
          return this.getUserInfo(credentials.username);
        }
        return throwError(() => new Error('No token received'));
      }),
      tap(user => {
        this.setUser(user);
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
  
  getUserInfo(username: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    
    return this.http.get<User>(`${this.authUrl}/user/${username}`, { headers }).pipe(
      map(user => ({
        id: user.id,
        username: user.username,
        role: user.role as UserRole
      }))
    );
  }
  
  getAllUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    
    return this.http.get<User[]>(`${this.authUrl}/users`, { headers });
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
    localStorage.removeItem(this.userKey);
    this.customerService.clearCurrentCustomer();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }
  
  isUser(): boolean {
    return this.hasRole(UserRole.USER);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}

