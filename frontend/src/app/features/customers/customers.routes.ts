import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/customer-list/customer-list.component').then(m => m.CustomerListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent)
  }
];

