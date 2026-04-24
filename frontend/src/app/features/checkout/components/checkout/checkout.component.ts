import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Order, OrderRequest, OrderItemRequest } from '../../../../models/order.model';
import { Customer } from '../../../../models/customer.model';
import { PaymentMethod } from '../../../../models/payment.model';
import { PaymentService } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  paymentForm: FormGroup;
  loading = false;
  processingPayment = false;
  customerId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private customerService: CustomerService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolder: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      billingAddress: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();

    if (this.cartItems.length === 0) {
      this.toastService.warning('Your cart is empty');
      this.router.navigate(['/cart']);
      return;
    }

    this.loadCustomerId();
  }

  loadCustomerId(): void {
    const cachedCustomer = this.customerService.getCurrentCustomer();
    if (cachedCustomer) {
      this.setCustomerContext(cachedCustomer);
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.error('User not found');
      return;
    }

    this.fetchCustomerProfile(user.username);
  }

  private fetchCustomerProfile(email: string): void {
    this.customerService.getCustomerByEmail(email).subscribe({
      next: (customer) => {
        this.customerService.setCurrentCustomer(customer);
        this.setCustomerContext(customer);
      },
      error: () => {
        this.toastService.warning('Please complete your customer details before checkout.');
        this.router.navigate(['/customers/create'], { queryParams: { email, returnUrl: '/checkout' } });
      }
    });
  }

  private setCustomerContext(customer: Customer): void {
    this.customerId = customer.customerId;
    this.paymentForm.patchValue({
      billingAddress: customer.address || ''
    });
  }

  processPayment(): void {
    if (this.paymentForm.invalid) {
      this.toastService.error('Please fill in all payment details correctly');
      return;
    }

    if (!this.customerId) {
      this.toastService.error('Customer information not available');
      return;
    }

    this.processingPayment = true;

    // Mock payment processing
    setTimeout(() => {
      this.createOrder();
    }, 2000);
  }

  createOrder(): void {
    // Convert cart items to order item requests
    const orderItemRequests: OrderItemRequest[] = this.cartItems.map(item => ({
      productId: item.product.productId,
      quantity: item.quantity
    }));

    // Create order request object
    const orderRequest: OrderRequest = {
      customerId: this.customerId!,
      orderitemRequest: orderItemRequests
    };

    this.orderService.placeOrder(orderRequest).subscribe({
      next: (createdOrder: Order) => {
        this.createPaymentRecord(createdOrder);
      },
      error: (error) => {
        this.processingPayment = false;
        console.error('Error creating order:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to create order';
        this.toastService.error(errorMessage);
      }
    });
  }

  private createPaymentRecord(order: Order): void {
    this.paymentService.createPayment({
      orderId: order.orderId,
      customerId: order.customerId,
      amount: order.totalAmount,
      paymentMethod: PaymentMethod.CREDIT_CARD
    }).subscribe({
      next: () => {
        this.processingPayment = false;
        this.cartService.clearCart();
        this.toastService.success('Order placed successfully!');
        this.router.navigate(['/orders'], { queryParams: { orderId: order.orderId } });
      },
      error: (error) => {
        this.processingPayment = false;
        console.error('Error creating payment:', error);
        const errorMessage = error?.message || error?.error?.message || 'Order was placed, but payment record failed';
        this.toastService.error(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cart']);
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    this.paymentForm.patchValue({ cardNumber: value }, { emitEvent: false });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.paymentForm.patchValue({ expiryDate: value }, { emitEvent: false });
  }
}

