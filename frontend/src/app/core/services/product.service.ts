import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductRequest } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = '/products';

  constructor(private apiService: ApiService) {}

  getAllProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}`
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.apiService.get<Product>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}/${productId}`
    );
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.apiService.post<Product>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}`,
      product
    );
  }

  updateProduct(productId: number, product: Partial<ProductRequest>): Observable<Product> {
    return this.apiService.put<Product>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}/${productId}`,
      product
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.apiService.delete<void>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}/${productId}`
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.apiService.get<Product[]>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}/category/${category}`
    );
  }

  checkStockAvailability(productId: number, quantity: number): Observable<boolean> {
    return this.apiService.get<boolean>(
      `${this.apiService.getProductServiceUrl()}${this.baseUrl}/${productId}/stock?quantity=${quantity}`
    );
  }
}

