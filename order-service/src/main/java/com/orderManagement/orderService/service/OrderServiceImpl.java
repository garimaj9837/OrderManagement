package com.orderManagement.orderService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.exceptionHandler.OrderNotFoundException;
import com.orderManagement.orderService.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {
	
	OrderRepository orderRepository;
	
	OrderServiceImpl(OrderRepository orderRepository){
		this.orderRepository=orderRepository;
	}
	
	public Order createOrder(Order order) {
		return orderRepository.save(order);
	}
	

	public Order getOrderById(int orderId) {
		return orderRepository.findById(orderId).orElseThrow(()-> new OrderNotFoundException("Order not Found!"));
	}

	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}
	

	public Order updateOrders(Order updateOrder, int id) {
		Order order=getOrderById(id);
		order.setCustomerId(updateOrder.getCustomerId());
		order.setStatus(updateOrder.getStatus());
		order.setTotalAmount(updateOrder.getTotalAmount());
		order.setOrderDate(updateOrder.getOrderDate());
		Order updatedOrder=orderRepository.save(order);
		return updatedOrder;
	}
	

	public Order updateStatus(int id, String status) {
		Order order=getOrderById(id);
		order.setStatus(status);
		Order updatedOrder=orderRepository.save(order);
		return updatedOrder;
	}
	

	public void deleteOrder(int id) {
		orderRepository.deleteById(id);
	}
	
	public boolean existByOrderId(int id) {
		return orderRepository.existsById(id);
	}
	

	public void addItemToOrder() {
		
	}
	
	public void updateItem() {
		
	}
	
	public void deleteItem() {
		
	}
	
	public void getOrderByCustomerId() {
		
	}
	
	public void getOrderByStatus() {
		
	}

	public void filterOrderByDateRange() {
		
	}

}
