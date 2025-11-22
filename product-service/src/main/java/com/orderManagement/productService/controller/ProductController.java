package com.orderManagement.productService.controller;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RequestParam;
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
	public ResponseEntity<Product> updateDiscount(@PathVariable int id,@RequestBody BigDecimal discount){
		Product updatedProduct= productService.updateDiscount(id,discount);
		return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
	}
	
	@GetMapping("/id/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable("id") int productId) {
		System.out.println("Fetching product by id" +productId);
		Product product=productService.getProductById(productId);
		System.out.println("product found : " +product.getProductName()+"  "+product.getProductquantity());
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
	
	@PutMapping("/reduceStock/{id}")
	public ResponseEntity<String> reduceStock(@PathVariable int id, @RequestParam int quantity) {
	    int remainingQuantity=productService.reduceProductQuantity(id, quantity);
	    return new ResponseEntity<String>("reduced stock successfully! Now available quantity for product Id:"+id+"is : "+remainingQuantity,HttpStatus.OK);
	}
}
