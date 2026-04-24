package com.orderManagement.paymentService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orderManagement.paymentService.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByOrderId(int orderId);

    List<Payment> findByCustomerId(int customerId);
}
