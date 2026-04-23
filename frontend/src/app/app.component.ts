import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CartService } from './core/services/cart.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserRole } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Microservice New - Order Management System';
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  cartItemCount$: Observable<number>;
  isAdmin$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
    this.cartItemCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
    this.isAdmin$ = this.currentUser$.pipe(
      map(user => user?.role === UserRole.ADMIN)
    );
  }

  logout(): void {
    this.authService.logout();
  }
}

