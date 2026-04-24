package com.orderManagement.customerService.service;

import java.util.List;

import com.orderManagement.customerService.enitity.Customer;


public interface CustomerService {

	Customer addNewCustomer(Customer customer, Long userId);
	List<Customer> getAllCustomers();
	Customer getCustomerById(int customerId);
	Customer getCustomerByEmail(String email);
	Customer getCustomerByUserId(Long userId);
	Customer updateCustomer(int id, Customer customer);
	String deleteCustomer(int customerId);
}
