import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
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
      next: (token) => {
        console.log('Login successful, token received:', token ? 'Yes' : 'No');
        this.loading = false;
        this.toastService.success('Login successful!');
        // Small delay to ensure token is stored and auth state is updated
        setTimeout(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/orders';
          this.router.navigate([returnUrl]).then(success => {
            if (!success) {
              console.error('Navigation failed');
            }
          });
        }, 100);
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
}

