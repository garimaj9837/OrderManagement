package com.orderManagement.productService.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.orderManagement.productService.entity.Product;

public interface ProductService {
	
	public List<Product> getallProducts();
	public Product createProduct(Product product);
	public Product updateProduct(int productId, Product product);
	public Product getProductById(int id);
	public void deleteProduct(int productId);
	public List<Product> getProductsbyCategory(String category);
	public Product updateDiscount(int id, BigDecimal discount);
	public int reduceProductQuantity(int id, int quantity);
	

}
