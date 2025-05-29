package com.orderManagement.productService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderManagement.productService.entity.Product;
import com.orderManagement.productService.service.ProductService;

@RestController
@RequestMapping("product")
public class ProductController {
	
	ProductService productService;
	
	@Autowired
	ProductController(ProductService productService){
		this.productService=productService;
	}
	
	@GetMapping("/")
	public ResponseEntity<List<Product>> getAllProducts() {
		List<Product> products=productService.getallProducts();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	@PostMapping("/")
	public ResponseEntity<Product> addNewProduct(@RequestBody Product product) {
		Product createdProduct=productService.createProduct(product);
		return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product product) {
		Product updatedProduct=productService.updateProduct(id, product);
		return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
	}
	
	@PatchMapping("/discount/{id}")
	public ResponseEntity<Product> updateDiscount(@PathVariable int id,@RequestBody int discount){
		Product updatedProduct= productService.updateDiscount(id,discount);
		return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
	}
	
	@GetMapping("/id/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable("id") int productId) {
		Product product=productService.getProductById(productId);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	
	@GetMapping("/category/{category}")
	public ResponseEntity<List<Product>> getProductsbyCategory(@PathVariable String category) {
		List<Product> products=productService.getProductsbyCategory(category);
		return new ResponseEntity<>(products, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable("id") int productId) {
		productService.deleteProduct(productId);
		return new ResponseEntity<>("Product deleted Successfully!", HttpStatus.OK);
	}
}
