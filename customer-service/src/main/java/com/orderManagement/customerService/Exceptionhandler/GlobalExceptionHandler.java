package com.orderManagement.customerService.Exceptionhandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler
	public ResponseEntity<String> handleCustomerNotFound(CustomerNotFoundException ex){
		//return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); both will work
		return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler
	public ResponseEntity<String> handleDuplicateCustomerException(DuplicateCustomerException ex){
		//return new ResponseEntity<>(ex.getMessage(),HttpStatus.CONFLICT);
		return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
	}
	
	@ExceptionHandler
	public ResponseEntity<String> handleGeneralException(Exception ex){
		ex.printStackTrace();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong!!!");
	}

}
