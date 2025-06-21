package com.orderManagement.orderService.service;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.entity.OrderItem;
import com.orderManagement.orderService.exceptionHandler.OrderNotFoundException;
import com.orderManagement.orderService.repository.OrderRepository;
import com.orderManagement.orderService.dto.ProductDto;

@Service
public class OrderServiceImpl implements OrderService {
	
	private final OrderRepository orderRepository;
	private final ProductService productService;

	OrderServiceImpl(OrderRepository orderRepository, ProductService productService){
		this.orderRepository=orderRepository;
		this.productService=productService;
	}
	
	@Transactional
	public Order createOrder(Order order) {
		// Check stock availability for all items before creating the order
		for (OrderItem item : order.getOrderitems()) {
			productService.checkStockAvailability(item.getProductId(), item.getQuantity());
		}
		
		// Calculate subtotals and set order total
		for (OrderItem item : order.getOrderitems()) {
			ProductDto product = productService.getProductById(item.getProductId());
			item.setPrice(product.getPrice());
			item.setDiscount(product.getDiscount());
			item.setSubtotal(calculateSubtotal(item));
		}
		updateOrderTotal(order);
		
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

	@Transactional
	public Order addItemToOrder(int orderId, OrderItem item) {
		Order order = getOrderById(orderId);
		
		// Check stock availability before adding item
		productService.checkStockAvailability(item.getProductId(), item.getQuantity());
		
		// Get product details from product service
		ProductDto product = productService.getProductById(item.getProductId());
		
		// Set product details from product service
		item.setOrder(order);
		item.setPrice(product.getPrice());
		item.setDiscount(product.getDiscount());
		item.setSubtotal(calculateSubtotal(item));
		
		order.getOrderitems().add(item);
		updateOrderTotal(order);
		return orderRepository.save(order);
	}
	
	@Transactional
	public Order updateItem(int orderId, int itemId, OrderItem updatedItem) {
		Order order = getOrderById(orderId);
		OrderItem existingItem = order.getOrderitems().stream()
			.filter(item -> item.getId() == itemId)
			.findFirst()
			.orElseThrow(() -> new OrderNotFoundException("Order item not found"));
			
		// Check stock availability for the new quantity
		productService.checkStockAvailability(existingItem.getProductId(), updatedItem.getQuantity());
		
		// Get latest product details
		ProductDto product = productService.getProductById(existingItem.getProductId());
		
		// Update only quantity, use latest price and discount from product service
		existingItem.setQuantity(updatedItem.getQuantity());
		existingItem.setPrice(product.getPrice());
		existingItem.setDiscount(product.getDiscount());
		existingItem.setSubtotal(calculateSubtotal(existingItem));
		
		updateOrderTotal(order);
		return orderRepository.save(order);
	}
	
	@Transactional
	public Order deleteItem(int orderId, int itemId) {
		Order order = getOrderById(orderId);
		order.getOrderitems().removeIf(item -> item.getId() == itemId);
		updateOrderTotal(order);
		return orderRepository.save(order);
	}
	
	private BigDecimal calculateSubtotal(OrderItem item) {
		BigDecimal total = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
		return total.subtract(item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO);
	}
	
	private void updateOrderTotal(Order order) {
		BigDecimal total = order.getOrderitems().stream()
			.map(OrderItem::getSubtotal)
			.reduce(BigDecimal.ZERO, BigDecimal::add);
		order.setTotalAmount(total);
	}

}
