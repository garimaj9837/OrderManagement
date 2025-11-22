import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../models/customer.model';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    SearchFilterComponent,
    PaginationComponent
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  loading = false;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  columns: TableColumn[] = [
    { key: 'customerId', label: 'ID', sortable: true },
    { key: 'customerName', label: 'Customer Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'pincode', label: 'Pincode', sortable: true }
  ];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load customers';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.customers];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.customerName.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.address.toLowerCase().includes(term) ||
        customer.pincode.toString().includes(term)
      );
    }

    this.filteredCustomers = filtered;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  onClear(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  onEdit(customer: Customer): void {
    this.router.navigate(['/customers/edit', customer.customerId]);
  }

  onDelete(customer: Customer): void {
    this.customerService.deleteCustomer(customer.customerId).subscribe({
      next: () => {
        this.toastService.success('Customer deleted successfully!');
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to delete customer';
        this.toastService.error(errorMessage);
      }
    });
  }

  onRowClick(customer: Customer): void {
    this.router.navigate(['/customers/view', customer.customerId]);
  }

  get paginatedCustomers(): Customer[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredCustomers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}

