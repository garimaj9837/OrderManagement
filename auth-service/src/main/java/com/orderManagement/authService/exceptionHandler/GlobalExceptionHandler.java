package com.orderManagement.authService.exceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
		Map<String, String> errorResponse = new HashMap<>();
		String message = ex.getMessage();
		
		// Determine appropriate HTTP status based on error message
		HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
		
		if (message != null) {
			if (message.contains("User not found") || message.contains("Invalid Password")) {
				status = HttpStatus.UNAUTHORIZED;
				errorResponse.put("error", "Authentication failed");
				errorResponse.put("message", message);
			} else {
				errorResponse.put("error", "Error occurred");
				errorResponse.put("message", message);
			}
		} else {
			errorResponse.put("error", "An unexpected error occurred");
			errorResponse.put("message", "Please try again later");
		}
		
		return ResponseEntity.status(status).body(errorResponse);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("error", "Internal server error");
		errorResponse.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	}
}

