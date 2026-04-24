import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../models/customer.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  errorMessage = '';
  isProfileView = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.resolveCustomer();
    });

    this.route.queryParams.subscribe(() => {
      this.resolveCustomer();
    });
  }

  private resolveCustomer(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    this.isProfileView = this.router.url.startsWith('/profile');

    if (idParam) {
      this.loadCustomerById(+idParam);
    } else if (emailParam) {
      this.loadCustomerByEmail(emailParam);
    } else if (this.isProfileView) {
      this.loadMyCustomer();
    } else {
      this.errorMessage = 'No customer identifier provided.';
    }
  }

  loadMyCustomer(): void {
    this.loading = true;
    this.errorMessage = '';
    this.customerService.getMyCustomer().subscribe({
      next: (customer) => {
        this.customer = customer;
        this.customerService.setCurrentCustomer(customer);
        this.loading = false;
      },
      error: () => {
        const email = this.authService.getCurrentUser()?.username || '';
        this.toastService.warning('Please complete your customer profile.');
        this.router.navigate(['/customers/create'], { queryParams: { email, returnUrl: '/profile' } });
      }
    });
  }

  loadCustomerById(customerId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.customerService.getCustomerById(customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.customerService.setCurrentCustomer(customer);
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

  loadCustomerByEmail(email: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.customerService.getCustomerByEmail(email).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.customerService.setCurrentCustomer(customer);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer by email:', error);
        this.errorMessage = error?.message || 'Unable to find customer profile.';
        this.toastService.error(this.errorMessage);
        this.loading = false;
      }
    });
  }
}

