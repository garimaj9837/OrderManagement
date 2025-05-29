package com.orderManagement.orderService.feignInterface;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@FeignClient(name = "product-service")
public interface ProductClient {
	
	//@GetMapping("/id/{id}")
    //ResponseEntity<Product> getProductById(@PathVariable("id") int id);

}
