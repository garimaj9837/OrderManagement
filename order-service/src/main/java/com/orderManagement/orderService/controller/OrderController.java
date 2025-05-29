package com.orderManagement.orderService.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderManagement.orderService.entity.OrderItem;

@RestController
@RequestMapping("/order")
public class OrderController {

	@PostMapping("/")
	public void createOrder() {
		
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
	
	@PostMapping("/orders/{orderId}/items")
	public void addItemToOrder(OrderItem item) {
		
	}
	
	@PutMapping("/orders/{orderId}/items/{itemId}")
	public void updateItem() {
		
	}
	
	@DeleteMapping("/orders/{orderId}/items/{itemId}")
	public void deleteItem() {
		
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
}
