package com.orderManagement.customerService.service;

import java.util.List;

import com.orderManagement.customerService.enitity.Customer;


public interface CustomerService {

	Customer addNewCustomer(Customer customer);
	List<Customer> getAllCustomers();
	Customer getCustomerById(int customerId);
	Customer updateCustomer(int id, Customer customer);
	String deleteCustomer(int customerId);
}
