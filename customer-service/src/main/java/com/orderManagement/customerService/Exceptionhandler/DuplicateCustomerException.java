package com.orderManagement.customerService.Exceptionhandler;

public class DuplicateCustomerException extends RuntimeException{
	
	public DuplicateCustomerException(String message){
		super(message);
	}

}
