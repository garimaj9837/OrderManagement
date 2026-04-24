package com.orderManagement.orderService.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.entity.OrderItem;
import com.orderManagement.orderService.service.OrderService;
import com.orderManagement.orderService.dto.OrderRequestDto;
import com.orderManagement.orderService.dto.OrderItemResponseDto;
import com.orderManagement.orderService.dto.OrderStatusRequest;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

	private final OrderService orderService;
	
	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}
	
	
	
	@PostMapping({"", "/"})
	public ResponseEntity<Order> createOrder(@RequestBody Order order) {
		Order createdOrder = orderService.createOrder(order);
		return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Order> getOrderById(@PathVariable("id") int orderId) {
		Order order=orderService.getOrderById(orderId);
		return new ResponseEntity<>(order, HttpStatus.OK); 
	}
	
	@GetMapping({"", "/"})
	public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String status) {
		List<Order> orders = status == null || status.isBlank()
				? orderService.getAllOrders()
				: orderService.getOrdersByStatus(status);
		return new ResponseEntity<>(orders, HttpStatus.OK);
		
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Order> updateOrders(@PathVariable int id, @RequestBody Order order) {
		Order updatedOrder = orderService.updateOrders(order, id);
		return ResponseEntity.ok(updatedOrder);
	}
	
	@PatchMapping("/{id}/status")
	public ResponseEntity<Order> updateStatus(@PathVariable int id, @RequestBody OrderStatusRequest request) {
		String status = request.status();
		if (status == null || status.isBlank()) {
			return ResponseEntity.badRequest().build();
		}
		Order updatedOrder = orderService.updateStatus(id, status);
		return ResponseEntity.ok(updatedOrder);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOrder(@PathVariable int id) {
		orderService.deleteOrder(id);
		return ResponseEntity.noContent().build();
	}
	
//	Method	Endpoint	Description
//	POST	/orders	Create a new order
//	GET	/orders/{id}	Get order details by ID
//	GET	/orders	Get list of all orders (optionally paginated)
//	PUT	/orders/{id}	Update entire order (not common, but possible)
//	PATCH	/orders/{id}/status	Update only the order status
//	DELETE	/orders/{id}	Delete or cancel the order
	
	@PostMapping("/addItem/{orderId}/items")
	public ResponseEntity<Order> addItemToOrder(
			@PathVariable int orderId,
			@RequestBody OrderItem item) {
		Order updatedOrder = orderService.addItemToOrder(orderId, item);
		return ResponseEntity.ok(updatedOrder);
	}
	
	@PutMapping("/updateItem/{orderId}/item/{itemId}")
	public ResponseEntity<Order> updateItem(
			@PathVariable int orderId,
			@PathVariable int itemId,
			@RequestBody OrderItem updatedItem) {
		Order updatedOrder = orderService.updateItem(orderId, itemId, updatedItem);
		return ResponseEntity.ok(updatedOrder);
	}
	
	@DeleteMapping("/deleteitem/{orderId}/items/{itemId}")
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
	
	@GetMapping("/customer/{customerId}")
	public ResponseEntity<List<Order>> getOrderByCustomerId(@PathVariable int customerId) {
		List<Order> orders = orderService.getOrdersByCustomerId(customerId);
		return ResponseEntity.ok(orders);
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
	
	@PostMapping("/placeOrder")
	public ResponseEntity<Order> placeOrder(@RequestBody OrderRequestDto orderRequestDto) {
		Order order = orderService.placeOrder(orderRequestDto);
		return new ResponseEntity<>(order, HttpStatus.CREATED);
	}
	
	
}
