import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order, OrderItem, OrderStatus } from '../../../../models/order.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  isAdmin = false;
  customerId: number | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private authService: AuthService,
    private customerService: CustomerService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.prepareCustomerContext();
  }

  private prepareCustomerContext(): void {
    if (this.isAdmin) {
      this.loadRouteOrder();
      return;
    }

    const cachedCustomer = this.customerService.getCurrentCustomer();
    if (cachedCustomer) {
      this.customerId = cachedCustomer.customerId;
      this.loadRouteOrder();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.error('User not found');
      this.router.navigate(['/orders']);
      return;
    }

    this.customerService.getCustomerByEmail(user.username).subscribe({
      next: (customer) => {
        this.customerService.setCurrentCustomer(customer);
        this.customerId = customer.customerId;
        this.loadRouteOrder();
      },
      error: () => {
        this.toastService.warning('Please complete your customer profile to view orders.');
        this.router.navigate(['/customers/create'], { queryParams: { email: user.username, returnUrl: '/orders' } });
      }
    });
  }

  private loadRouteOrder(): void {
    this.route.params.subscribe(params => {
      const orderId = +params['id'];
      this.loadOrder(orderId);
    });
  }

  loadOrder(orderId: number): void {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        if (!this.isAdmin && !this.isOwnOrder(order)) {
          this.toastService.error('You are not allowed to view this order.');
          this.router.navigate(['/orders']);
          return;
        }
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load order';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PLACED': 'badge-info',
      'SHIPPED': 'badge-warning',
      'DELIVERED': 'badge-success',
      'CANCELLED': 'badge-danger',
      'PENDING': 'badge-warning'
    };
    return statusMap[status] || 'badge-secondary';
  }

  canCancelOrder(order: Order): boolean {
    return order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED;
  }

  cancelOrder(): void {
    if (!this.order || !this.canCancelOrder(this.order)) {
      this.toastService.warning('This order cannot be cancelled.');
      return;
    }

    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.orderService.updateOrderStatus(this.order.orderId, OrderStatus.CANCELLED).subscribe({
      next: (order) => {
        this.order = order;
        this.toastService.success('Order cancelled successfully!');
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to cancel order';
        this.toastService.error(errorMessage);
      }
    });
  }

  cancelOrderItem(item: OrderItem): void {
    if (!this.order || !item.id || !this.canCancelOrder(this.order)) {
      this.toastService.warning('This item cannot be cancelled.');
      return;
    }

    if (!confirm('Are you sure you want to cancel this item?')) {
      return;
    }

    this.orderService.deleteOrderItem(this.order.orderId, item.id).subscribe({
      next: (order) => {
        this.order = order;
        this.toastService.success('Order item cancelled successfully!');
      },
      error: (error) => {
        console.error('Error cancelling order item:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to cancel order item';
        this.toastService.error(errorMessage);
      }
    });
  }

  private isOwnOrder(order: Order): boolean {
    return this.customerId === order.customerId;
  }
}

