import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentRequest, PaymentMethod } from '../../../../models/payment.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  loading = false;
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      orderId: ['', Validators.required],
      customerId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      transactionId: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.paymentForm.invalid) return;
    const paymentRequest: PaymentRequest = this.paymentForm.value;
    this.loading = true;

    this.paymentService.createPayment(paymentRequest).subscribe({
      next: () => this.router.navigate(['/payments']),
      error: (error) => {
        console.error('Error creating payment:', error);
        alert('Failed to create payment');
        this.loading = false;
      }
    });
  }
}

