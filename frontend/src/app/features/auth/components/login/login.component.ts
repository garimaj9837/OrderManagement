import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  private defaultReturnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private customerService: CustomerService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        console.log('Login successful, user:', user);
        this.loading = false;
        this.toastService.success(`Welcome ${user.username}!`);
        this.handlePostLoginNavigation(user);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading = false;
        // Handle different error response formats
        let errorMessage = 'Login failed. Please check your credentials.';
        if (error?.error) {
          if (typeof error.error === 'string') {
            try {
              const errorObj = JSON.parse(error.error);
              errorMessage = errorObj.message || errorObj.error || errorMessage;
            } catch {
              errorMessage = error.error;
            }
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }
        this.toastService.error(errorMessage);
      }
    });
  }

  private handlePostLoginNavigation(user: User): void {
    const requestedUrl = this.route.snapshot.queryParams['returnUrl'] || this.defaultReturnUrl;
    const targetUrl = user.role === 'ADMIN' ? requestedUrl : this.getUserSafeReturnUrl(requestedUrl);

    this.customerService.getMyCustomer().subscribe({
      next: (customer) => {
        this.customerService.setCurrentCustomer(customer);
        this.navigateTo(targetUrl);
      },
      error: (error) => {
        console.warn('Customer profile missing or failed to load', error);
        const message = error?.status === 404
          ? 'Please complete your customer details before shopping.'
          : 'Unable to load customer profile. Please re-enter your details.';
        this.toastService.info(message);
        this.customerService.clearCurrentCustomer();
        this.router.navigate(
          ['/customers/create'],
          { queryParams: { email: user.username, returnUrl: targetUrl } }
        );
      }
    });
  }

  private getUserSafeReturnUrl(url: string): string {
    const adminOnlyRoutes = ['/products', '/customers', '/payments', '/admin'];
    return adminOnlyRoutes.some(route => url.startsWith(route)) ? this.defaultReturnUrl : url;
  }

  private navigateTo(url: string): void {
    setTimeout(() => {
      this.router.navigate([url]).then(success => {
        if (!success) {
          console.error('Navigation failed');
        }
      });
    }, 100);
  }
}

