package com.orderManagement.orderService.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

@Data
@Entity
public class OrderItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "order_id")
	private Order order;
	
	private int productId;
	private int quantity;
	private BigDecimal price;
	private BigDecimal discount;
	private BigDecimal subtotal; // price * quantity - discount
}
