import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  totalItems = 0;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  loadCart(): void {
    this.cartService.verifyCartAvailability();
  }

  calculateTotals(): void {
    this.totalAmount = this.cartService.getTotalAmount();
    this.totalItems = this.cartService.getTotalItems();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.toastService.info('Cart cleared');
    }
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.toastService.warning('Your cart is empty');
      return;
    }
    // Navigation will be handled by router link in template
  }
}

