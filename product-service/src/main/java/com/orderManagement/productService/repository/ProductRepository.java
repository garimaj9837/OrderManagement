package com.orderManagement.productService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orderManagement.productService.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer>{
	
	List<Product> findByProductCategory(String productCategory);

}
