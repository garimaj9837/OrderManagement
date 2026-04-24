import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../models/user.model';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard([UserRole.ADMIN])],
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'create',
    canActivate: [roleGuard([UserRole.ADMIN])],
    loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [roleGuard([UserRole.ADMIN])],
    loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent)
  }
];

