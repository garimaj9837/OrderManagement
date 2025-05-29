package com.orderManagement.orderService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orderManagement.orderService.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

}
