package com.orderManagement.orderService.exceptionHandler;

public class OutOfStockException extends RuntimeException {
    
    public OutOfStockException(String message) {
        super(message);
    }
} 