package com.orderManagement.customerService.Exceptionhandler;

public class CustomerNotFoundException extends RuntimeException {
	
	public CustomerNotFoundException(String message){
		super(message);
	}

}
