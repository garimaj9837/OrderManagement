import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../models/customer.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const customerId = +params['id'];
      this.loadCustomer(customerId);
    });
  }

  loadCustomer(customerId: number): void {
    this.loading = true;
    this.customerService.getCustomerById(customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load customer';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }
}

