package com.orderManagement.productService.exceptionsHandler;

public class ProductNotFoundException extends RuntimeException {
	
	public ProductNotFoundException(String msg){
		super(msg);
	}

}
