import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/order-list/order-list.component').then(m => m.OrderListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/order-form/order-form.component').then(m => m.OrderFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/order-form/order-form.component').then(m => m.OrderFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  }
];

