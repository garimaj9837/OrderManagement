package com.orderManagement.orderService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orderManagement.orderService.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
	
    List<OrderItem> findByOrderOrderId(int orderId);
}
