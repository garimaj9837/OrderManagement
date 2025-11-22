import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { Payment, PaymentStatus } from '../../../../models/payment.model';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, SearchFilterComponent, PaginationComponent],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;

  columns: TableColumn[] = [
    { key: 'paymentId', label: 'Payment ID', sortable: true },
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'paymentMethod', label: 'Method', sortable: true },
    { key: 'paymentStatus', label: 'Status', sortable: true },
    { key: 'paymentDate', label: 'Date', sortable: true }
  ];

  statusOptions = Object.values(PaymentStatus);

  constructor(
    private paymentService: PaymentService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load payments';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.payments];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.paymentId.toString().includes(term) || p.orderId.toString().includes(term));
    }
    if (this.selectedStatus) {
      filtered = filtered.filter(p => p.paymentStatus === this.selectedStatus);
    }
    this.filteredPayments = filtered;
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

  onDelete(payment: Payment): void {
    this.paymentService.deletePayment(payment.paymentId).subscribe({
      next: () => {
        this.toastService.success('Payment deleted successfully!');
        this.loadPayments();
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to delete payment';
        this.toastService.error(errorMessage);
      }
    });
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'COMPLETED': 'badge-success',
      'PENDING': 'badge-warning',
      'FAILED': 'badge-danger',
      'REFUNDED': 'badge-info'
    };
    return map[status] || 'badge-secondary';
  }

  get paginatedPayments(): Payment[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPayments.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}

