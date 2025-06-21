package com.orderManagement.orderService.service;

import java.util.List;
import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.entity.OrderItem;

public interface OrderService {
    Order createOrder(Order order);
    Order getOrderById(int orderId);
    List<Order> getAllOrders();
    Order updateOrders(Order updateOrder, int id);
    Order updateStatus(int id, String status);
    void deleteOrder(int id);
    boolean existByOrderId(int id);
    
    // Order item management methods
    Order addItemToOrder(int orderId, OrderItem item);
    Order updateItem(int orderId, int itemId, OrderItem updatedItem);
    Order deleteItem(int orderId, int itemId);
}
