package com.orderManagement.orderService.exceptionHandler;

public class OrderNotFoundException extends RuntimeException{
	
	public OrderNotFoundException(String msg){
		super(msg);
	}

}
