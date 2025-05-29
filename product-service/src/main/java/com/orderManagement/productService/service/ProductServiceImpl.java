package com.orderManagement.productService.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orderManagement.productService.repository.ProductRepository;
import com.orderManagement.productService.entity.Product;
import com.orderManagement.productService.exceptionsHandler.ProductNotFoundException;

@Service
public class ProductServiceImpl implements ProductService{

	@Autowired
	ProductRepository productRepository;
	
	@Override
	public List<Product> getallProducts() {
		return productRepository.findAll();
		
	}
	
	@Override
	public Product createProduct(Product product) {
		return productRepository.save(product);		
	}
	

	@Override
	public Product updateProduct(int productId,Product product) {
		Product previousProduct=getProductById(productId);
		
		previousProduct.setProductName(product.getProductName());
		previousProduct.setProductCategory(product.getProductCategory());
		previousProduct.setProductDiscount(product.getProductDiscount());
		previousProduct.setProductPrice(product.getProductPrice());
		previousProduct.setProductquantity(product.getProductquantity());
		
		return productRepository.save(previousProduct);
	}

	@Override
	public Product getProductById(int id) {
		return productRepository.findById(id).orElseThrow(()->new ProductNotFoundException("Product not found!!!"));	
	}

	@Override
	public List<Product> getProductsbyCategory(String productCategory) {
		return productRepository.findByProductCategory(productCategory);
		//return null;
	}

	@Override
	public void deleteProduct(int productId) {
		productRepository.deleteById(productId);
		
	}
	
	public boolean existProductbyId(int id) {
		return productRepository.existsById(id);
	}

	@Override
	public Product updateDiscount(int id, int discount) {
		Product product=getProductById(id);
		product.setProductDiscount(discount);
		Product updatedProduct=productRepository.save(product);
		return updatedProduct;
	}







}
