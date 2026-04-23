import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { CustomerRequest } from '../../../../models/customer.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customerId?: number;
  isEditMode = false;
  loading = false;
  prefilledEmail: string | null = null;
  returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.customerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      customerName: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.prefilledEmail = params['email'];
        this.customerForm.patchValue({ email: this.prefilledEmail });
        // Mark email field as touched if prefilled value is not a valid email
        // This will show validation error immediately if username is not email format
        const emailControl = this.customerForm.get('email');
        if (emailControl && emailControl.invalid) {
          emailControl.markAsTouched();
        }
      }
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = +params['id'];
        this.isEditMode = true;
        this.loadCustomer();
      }
    });
  }

  loadCustomer(): void {
    if (!this.customerId) return;
    
    this.loading = true;
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const formValue = this.customerForm.value;
    const customerRequest: CustomerRequest = {
      email: formValue.email,
      customerName: formValue.customerName,
      address: formValue.address,
      pincode: Number(formValue.pincode)
    };
    this.loading = true;

    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer(this.customerId, customerRequest).subscribe({
        next: (customer) => {
          this.toastService.success('Customer updated successfully!');
          this.customerService.setCurrentCustomer(customer);
          this.navigateAfterSave();
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          const errorMessage = error?.message || error?.error?.message || 'Failed to update customer';
          this.toastService.error(errorMessage);
          this.loading = false;
        }
      });
    } else {
      this.customerService.createCustomer(customerRequest).subscribe({
        next: (customer) => {
          this.toastService.success('Customer created successfully!');
          this.customerService.setCurrentCustomer(customer);
          this.navigateAfterSave();
        },
        error: (error) => {
          console.error('Error creating customer:', error);
          const errorMessage = error?.message || error?.error?.message || 'Failed to create customer';
          this.toastService.error(errorMessage);
          this.loading = false;
        }
      });
    }
  }

  private navigateAfterSave(): void {
    this.loading = false;
    const nextRoute = this.returnUrl || '/customers';
    this.router.navigate([nextRoute]);
  }
}

