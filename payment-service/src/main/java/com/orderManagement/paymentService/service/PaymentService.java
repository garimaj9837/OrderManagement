package com.orderManagement.paymentService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orderManagement.paymentService.entity.Payment;
import com.orderManagement.paymentService.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(Payment payment) {
        payment.setPaymentId(0);
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(int paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
    }

    public Payment updatePayment(int paymentId, Payment updatedPayment) {
        Payment payment = getPaymentById(paymentId);
        payment.setOrderId(updatedPayment.getOrderId());
        payment.setCustomerId(updatedPayment.getCustomerId());
        payment.setAmount(updatedPayment.getAmount());
        payment.setPaymentMethod(updatedPayment.getPaymentMethod());
        payment.setTransactionId(updatedPayment.getTransactionId());
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(int paymentId, String status) {
        Payment payment = getPaymentById(paymentId);
        payment.setPaymentStatus(status);
        return paymentRepository.save(payment);
    }

    public void deletePayment(int paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }

    public List<Payment> getPaymentsByOrderId(int orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public List<Payment> getPaymentsByCustomerId(int customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }
}
