package com.orderManagement.orderService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.entity.OrderItem;
import com.orderManagement.orderService.service.OrderService;
import com.orderManagement.orderService.dto.OrderRequestDto;
import com.orderManagement.orderService.dto.OrderItemResponseDto;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

	private final OrderService orderService;
	
	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}
	
	
	
	@PostMapping("/")
	public void createOrder(@RequestBody Order order) {
		orderService.createOrder(order);
	}
	
	@GetMapping("/{id}")
	public void getOrderById() {
		
	}
	
	@GetMapping("/")
	public void getAllOrders() {
		
	}
	
	@PutMapping("/{id}")
	public void updateOrders() {
		
	}
	
	@PatchMapping("/{id}")
	public void updateStatus(String status) {
		
	}
	
	@DeleteMapping("/{id}")
	public void deleteOrder() {
		
	}
	
//	Method	Endpoint	Description
//	POST	/orders	Create a new order
//	GET	/orders/{id}	Get order details by ID
//	GET	/orders	Get list of all orders (optionally paginated)
//	PUT	/orders/{id}	Update entire order (not common, but possible)
//	PATCH	/orders/{id}/status	Update only the order status
//	DELETE	/orders/{id}	Delete or cancel the order
	
	@PostMapping("/{orderId}/items")
	public ResponseEntity<Order> addItemToOrder(
			@PathVariable int orderId,
			@RequestBody OrderItem item) {
		Order updatedOrder = orderService.addItemToOrder(orderId, item);
		return ResponseEntity.ok(updatedOrder);
	}
	
	@PutMapping("/{orderId}/items/{itemId}")
	public ResponseEntity<Order> updateItem(
			@PathVariable int orderId,
			@PathVariable int itemId,
			@RequestBody OrderItem updatedItem) {
		Order updatedOrder = orderService.updateItem(orderId, itemId, updatedItem);
		return ResponseEntity.ok(updatedOrder);
	}
	
	@DeleteMapping("/{orderId}/items/{itemId}")
	public ResponseEntity<Order> deleteItem(
			@PathVariable int orderId,
			@PathVariable int itemId) {
		Order updatedOrder = orderService.deleteItem(orderId, itemId);
		return ResponseEntity.ok(updatedOrder);
	}
	
	
//
//	🛒 OrderItem (Line Items) Endpoints (optional if managed within /orders)
//	Method	Endpoint	Description
//	POST	/orders/{orderId}/items	Add an item to an order
//	PUT	/orders/{orderId}/items/{itemId}	Update a line item (e.g., quantity, price)
//	DELETE	/orders/{orderId}/items/{itemId}	Remove an item from an order
	
	@GetMapping("?customerId={customerId}")
	public void getOrderByCustomerId() {
		
	}
	
	@GetMapping("?status={status}")
	public void getOrderByStatus() {
		
	}
	
	@GetMapping("/orders?dateFrom=...&dateTo=...")
	public void filterOrderByDateRange() {
		
	}
	
//
//	🔍 Filter and Search Endpoints
//	Method	Endpoint	Description
//	GET	/orders?customerId={customerId}	Get orders for a specific customer
//	GET	/orders?status={status}	Filter by status: PLACED, SHIPPED, etc.
//	GET	/orders?dateFrom=...&dateTo=...	Filter by date range
	
	@PostMapping("/cart")
	public ResponseEntity<List<OrderItemResponseDto>> addToCart(@RequestBody OrderRequestDto orderRequestDto) {
		List<OrderItemResponseDto> response = orderService.addToCart(orderRequestDto);
		return ResponseEntity.ok(response);
	}
}
