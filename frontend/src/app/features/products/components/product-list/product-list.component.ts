import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../models/product.model';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, SearchFilterComponent, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  columns: TableColumn[] = [
    { key: 'productId', label: 'ID', sortable: true },
    { key: 'productName', label: 'Name', sortable: true },
    { key: 'productCategory', label: 'Category', sortable: true },
    { key: 'productPrice', label: 'Price', sortable: true },
    { key: 'productDiscount', label: 'Discount', sortable: true },
    { key: 'productquantity', label: 'Stock', sortable: true }
  ];

  constructor(
    private productService: ProductService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to load products';
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.productName.toLowerCase().includes(term) ||
        p.productCategory.toLowerCase().includes(term)
      );
    }
    this.filteredProducts = filtered;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  onEdit(product: Product): void {
    this.router.navigate(['/products/edit', product.productId]);
  }

  onDelete(product: Product): void {
    this.productService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.toastService.success('Product deleted successfully!');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        const errorMessage = error?.message || error?.error?.message || 'Failed to delete product';
        this.toastService.error(errorMessage);
      }
    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}

