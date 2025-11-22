import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { ProductRequest } from '../../../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId?: number;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      category: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = +params['id'];
        this.isEditMode = true;
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    const productRequest: ProductRequest = this.productForm.value;
    this.loading = true;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productRequest).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product');
          this.loading = false;
        }
      });
    } else {
      this.productService.createProduct(productRequest).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product');
          this.loading = false;
        }
      });
    }
  }
}

