package com.orderManagement.orderService.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;

import com.orderManagement.orderService.dto.ProductDto;
import com.orderManagement.orderService.exceptionHandler.OrderNotFoundException;
import com.orderManagement.orderService.exceptionHandler.OutOfStockException;

import reactor.core.publisher.Mono;

@Service
public class ProductService {
    
    private final WebClient webClient;
    
    public ProductService(WebClient webClient) {
        this.webClient = webClient;
    }
    
    public ProductDto getProductById(int productId) {
        return webClient.get()
                .uri("/products/{id}", productId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(ProductDto.class)
                .doOnError(error -> {
                    throw new OrderNotFoundException("Product not found with id: " + productId);
                })
                .block(); // Using block() here since we're in a synchronous context
    }
    
    public boolean checkStockAvailability(int productId, int requestedQuantity) {
        ProductDto product = getProductById(productId);
        if (product.getStockQuantity() < requestedQuantity) {
            throw new OutOfStockException("Product " + productId + " is out of stock. Available quantity: " + product.getStockQuantity());
        }
        return true;
    }
    
    // For reactive endpoints, you can use this method
    public Mono<ProductDto> getProductByIdReactive(int productId) {
        return webClient.get()
                .uri("/products/{id}", productId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(ProductDto.class)
                .doOnError(error -> {
                    throw new OrderNotFoundException("Product not found with id: " + productId);
                });
    }
} 