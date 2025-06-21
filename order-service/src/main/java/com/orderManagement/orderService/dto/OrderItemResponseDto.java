package com.orderManagement.orderService.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemResponseDto {
    @NotNull
    private int id;
    @NotEmpty
    private int productId;
    private int quantity;
    // Price and discount will be fetched from product service
    private BigDecimal price;      // Read-only, set by service
    private BigDecimal discount;   // Read-only, set by service
    private BigDecimal subtotal;   // Read-only, calculated by service
    private boolean available;
    private String message;
}
