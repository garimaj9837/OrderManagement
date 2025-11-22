import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/payment-list/payment-list.component').then(m => m.PaymentListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/payment-form/payment-form.component').then(m => m.PaymentFormComponent)
  }
];

