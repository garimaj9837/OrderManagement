package com.orderManagement.orderService.dto;

import lombok.Data;

@Data
public class OrderItemRequestDto {
	
    private int productId;
    private int quantity;

}
