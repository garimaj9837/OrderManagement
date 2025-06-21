package com.orderManagement.orderService.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Order {

	@Id
	private int orderId;
	private int customerId; // reference to Customer
	private LocalDateTime orderDate;
	private String status; // e.g., PLACED, SHIPPED, DELIVERED, CANCELLED
	private BigDecimal totalAmount;
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	private List<OrderItem> orderitems;
}
