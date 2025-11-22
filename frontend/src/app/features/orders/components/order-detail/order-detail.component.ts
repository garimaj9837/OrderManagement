import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../models/order.model';
import { ToastService } from '../../../../shared/services/toast.service';

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

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = +params['id'];
      this.loadOrder(orderId);
    });
  }

  loadOrder(orderId: number): void {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
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
}

