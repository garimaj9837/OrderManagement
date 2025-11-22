import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { ProductService } from '../../../../core/services/product.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { OrderRequest, OrderItemRequest } from '../../../../models/order.model';
import { Product } from '../../../../models/product.model';
import { Customer } from '../../../../models/customer.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  orderId?: number;
  isEditMode = false;
  products: Product[] = [];
  customers: Customer[] = [];
  orderItems: OrderItemRequest[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.isEditMode = true;
        this.loadOrder();
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load products';
        this.toastService.error(errorMessage);
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load customers';
        this.toastService.error(errorMessage);
      }
    });
  }

  loadOrder(): void {
    if (!this.orderId) return;
    
    this.loading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          customerId: order.customerId
        });
        this.orderItems = order.orderitems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load order';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  addItem(): void {
    this.orderItems.push({ productId: 0, quantity: 1 });
  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  onSubmit(): void {
    if (this.orderForm.invalid || this.orderItems.length === 0) {
      this.toastService.warning('Please fill all required fields and add at least one item');
      return;
    }

    const orderRequest: OrderRequest = {
      customerId: this.orderForm.value.customerId,
      orderitemRequest: this.orderItems
    };

    this.loading = true;
    
    if (this.isEditMode && this.orderId) {
      // For edit, we'll update the order
      this.orderService.updateOrder(this.orderId, orderRequest as any).subscribe({
        next: () => {
          this.toastService.success('Order updated successfully!');
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          console.error('Error updating order:', error);
          const errorMessage = error?.message || error?.error?.message || 'Failed to update order';
          this.toastService.error(errorMessage);
          this.loading = false;
        }
      });
    } else {
      this.orderService.createOrder(orderRequest).subscribe({
        next: () => {
          this.toastService.success('Order created successfully!');
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          const errorMessage = error?.message || error?.error?.message || 'Failed to create order';
          this.toastService.error(errorMessage);
          this.loading = false;
        }
      });
    }
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.productId === productId);
    return product ? product.productName : 'Unknown Product';
  }
}
