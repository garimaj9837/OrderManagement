package com.orderManagement.orderService.dto;

import java.time.LocalDateTime;
import java.util.List;


import lombok.Data;

@Data
public class OrderRequestDto {

	private int orderId;
	private int customerId;
	private LocalDateTime orderDate;
	private String status; // e.g.,INCART, PLACED, SHIPPED, DELIVERED, CANCELLED
	//private BigDecimal totalAmount; //after adding/removing item
	private List<OrderItemRequestDto> orderitemRequest;
}
 