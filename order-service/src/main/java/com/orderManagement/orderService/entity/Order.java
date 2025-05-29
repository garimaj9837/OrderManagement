package com.orderManagement.orderService.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Order {

	@Id
	private int id;
	private int customerId; // reference to Customer
	private LocalDateTime orderDate;
	private String status; // e.g., PLACED, SHIPPED, DELIVERED, CANCELLED
	private BigDecimal totalAmount;
}
