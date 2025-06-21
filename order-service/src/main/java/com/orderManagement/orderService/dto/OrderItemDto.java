package com.orderManagement.orderService.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class OrderItemDto {
    private int id;
    private int productId;
    private int quantity;
    // Price and discount will be fetched from product service
    private BigDecimal price;      // Read-only, set by service
    private BigDecimal discount;   // Read-only, set by service
    private BigDecimal subtotal;   // Read-only, calculated by service
}
