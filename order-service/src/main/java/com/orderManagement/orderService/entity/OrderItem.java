package com.orderManagement.orderService.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class OrderItem {
	@Id
	private int id;
	private int orderId;
	private int productId;
	private int quantity;
	private BigDecimal price;
	private BigDecimal discount;
}
