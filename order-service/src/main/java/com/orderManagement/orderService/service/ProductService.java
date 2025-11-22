package com.orderManagement.orderService.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatusCode;

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
        try {
            return webClient.get()
                    .uri("/product/id/{id}", productId)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, response -> 
                        Mono.error(new OrderNotFoundException("Product not found with id: " + productId)))
                    .onStatus(HttpStatusCode::is5xxServerError, response -> 
                        Mono.error(new RuntimeException("Product service error for id: " + productId)))
                    .bodyToMono(ProductDto.class)
                    .doOnError(error -> {
                        System.err.println("Error fetching product " + productId + ": " + error.getMessage());
                    })
                    .block();
        } catch (Exception e) {
            System.err.println("Exception in getProductById: " + e.getMessage());
            throw new OrderNotFoundException("Product not found with id: " + productId);
        }
    }
    
    public boolean checkStockAvailability(int productId, int requestedQuantity) {
        try {
            ProductDto product = getProductById(productId);
            System.out.println("Checking stock for product: " + product.getProductName() + ", Available: " + product.getProductquantity() + ", Requested: " + requestedQuantity);
            
            if (product.getProductquantity() < requestedQuantity) {
                throw new OutOfStockException("Product " + productId + " is out of stock. Available quantity: " + product.getProductquantity());
            }
            return true;
        } catch (OutOfStockException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error checking stock for product " + productId + ": " + e.getMessage());
            throw new OrderNotFoundException("Product not found with id: " + productId);
        }
    }
    
    public void reduceStock(int productId, int quantity){
    	 try {
    	        webClient.put() // Use PUT since we are updating stock
    	            .uri((UriBuilder uriBuilder) -> uriBuilder
    	                .path("/product/reduceStock/{id}")
    	                .queryParam("quantity", quantity)
    	                .build(productId))
    	            .accept(MediaType.APPLICATION_JSON)
    	            .retrieve()
    	            .onStatus(HttpStatusCode::is4xxClientError, response ->
    	                Mono.error(new RuntimeException("Invalid request — Product not found or insufficient stock.")))
    	            .onStatus(HttpStatusCode::is5xxServerError, response ->
    	                Mono.error(new RuntimeException("Server error while reducing stock.")))
    	            .bodyToMono(Void.class) // no body expected from server
    	            .doOnSuccess(v -> System.out.println("Stock reduced for product: " + productId))
    	            .doOnError(error ->
    	                System.err.println("❌ Error reducing stock for product " + productId + ": " + error.getMessage()))
    	            .block();
    	    }  catch (Exception e) {
    	        throw new RuntimeException("Failed to reduce stock for product " + productId + ": " + e.getMessage(), e);
    	    }
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