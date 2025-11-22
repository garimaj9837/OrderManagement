package com.orderManagement.orderService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.entity.OrderItem;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

	
}
