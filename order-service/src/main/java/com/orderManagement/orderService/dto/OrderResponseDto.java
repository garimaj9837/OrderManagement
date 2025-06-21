package com.orderManagement.orderService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.orderManagement.orderService.entity.OrderItem;

import lombok.Data;

@Data
public class OrderResponseDto {
	
	private int orderId;
	private int customerId; // reference to Customer
	private LocalDateTime orderDate;
	private String status; // e.g., PLACED, SHIPPED, DELIVERED, CANCELLED
	private BigDecimal totalAmount; //after adding/removing item
	private List<OrderItem> orderitems;

}
