import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order, OrderStatus } from '../../../../models/order.model';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    SearchFilterComponent,
    PaginationComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;

  columns: TableColumn[] = [
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'customerId', label: 'Customer ID', sortable: true },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true }
  ];

  statusOptions = Object.values(OrderStatus);

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load orders';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(term) ||
        order.customerId.toString().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    this.filteredOrders = filtered;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(filter: { key: string; value: any }): void {
    if (filter.key === 'status') {
      this.selectedStatus = filter.value;
      this.currentPage = 1;
      this.applyFilters();
    }
  }

  onClear(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  onEdit(order: Order): void {
    this.router.navigate(['/orders/edit', order.orderId]);
  }

  onDelete(order: Order): void {
    this.orderService.deleteOrder(order.orderId).subscribe({
      next: () => {
        this.toastService.success('Order deleted successfully!');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error deleting order:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to delete order';
        this.toastService.error(errorMessage);
      }
    });
  }

  onRowClick(order: Order): void {
    this.router.navigate(['/orders/view', order.orderId]);
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

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}

