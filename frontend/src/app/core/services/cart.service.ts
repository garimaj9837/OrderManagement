import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from './product.service';
import { ToastService } from '../../shared/services/toast.service';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart_items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getStoredCart());
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotalAmount(): number {
    return this.getCartItems().reduce((total, item) => total + item.subtotal, 0);
  }

  getTotalItems(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
  }

  async addToCart(product: Product, quantity: number = 1): Promise<boolean> {
    // Check stock availability
    if (product.productquantity < quantity) {
      this.toastService.error(`Only ${product.productquantity} items available in stock`);
      return false;
    }

    const cartItems = this.getCartItems();
    const existingItem = cartItems.find(item => item.product.productId === product.productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.productquantity < newQuantity) {
        this.toastService.error(`Cannot add more. Only ${product.productquantity} items available in stock`);
        return false;
      }
      existingItem.quantity = newQuantity;
      existingItem.subtotal = this.calculateSubtotal(existingItem.product, existingItem.quantity);
    } else {
      cartItems.push({
        product,
        quantity,
        subtotal: this.calculateSubtotal(product, quantity)
      });
    }

    this.updateCart(cartItems);
    this.toastService.success('Product added to cart');
    return true;
  }

  removeFromCart(productId: number): void {
    const cartItems = this.getCartItems().filter(item => item.product.productId !== productId);
    this.updateCart(cartItems);
    this.toastService.info('Product removed from cart');
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const cartItems = this.getCartItems();
    const item = cartItems.find(item => item.product.productId === productId);
    
    if (item) {
      if (item.product.productquantity < quantity) {
        this.toastService.error(`Only ${item.product.productquantity} items available in stock`);
        return;
      }
      item.quantity = quantity;
      item.subtotal = this.calculateSubtotal(item.product, quantity);
      this.updateCart(cartItems);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  async verifyCartAvailability(): Promise<void> {
    const cartItems = this.getCartItems();
    const unavailableItems: string[] = [];

    for (const item of cartItems) {
      try {
        const product = await this.productService.getProductById(item.product.productId).toPromise();
        if (product && product.productquantity < item.quantity) {
          unavailableItems.push(item.product.productName);
          if (product.productquantity === 0) {
            this.removeFromCart(item.product.productId);
          } else {
            this.updateQuantity(item.product.productId, product.productquantity);
          }
        }
      } catch (error) {
        console.error('Error verifying product availability:', error);
      }
    }

    if (unavailableItems.length > 0) {
      this.toastService.warning(`Some items in your cart are no longer available in the requested quantity`);
    }
  }

  private calculateSubtotal(product: Product, quantity: number): number {
    const total = product.productPrice * quantity;
    const discount = product.productDiscount || 0;
    return total - discount;
  }

  private updateCart(cartItems: CartItem[]): void {
    this.cartItemsSubject.next(cartItems);
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
  }

  private getStoredCart(): CartItem[] {
    const cartStr = localStorage.getItem(this.cartKey);
    if (cartStr) {
      try {
        return JSON.parse(cartStr);
      } catch {
        return [];
      }
    }
    return [];
  }
}

