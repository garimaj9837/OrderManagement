package com.orderManagement.customerService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderManagement.customerService.enitity.Customer;
import com.orderManagement.customerService.service.CustomerService;

@RestController
@RequestMapping("customer")
public class CustomerController {
	
	CustomerService customerService;
	
	@Autowired
	CustomerController(CustomerService customerService){
		this.customerService=customerService;
	}
	
	
	@GetMapping("/")
	public ResponseEntity<List<Customer>> getAllCustomer() {
		List<Customer> customers=customerService.getAllCustomers();
		return new ResponseEntity<>(customers,HttpStatus.OK); 
	}
	
	@PostMapping("/")
	public ResponseEntity<Customer> addNewCustomer(@RequestBody Customer customer) {
		Customer addedCustomer=customerService.addNewCustomer(customer);
		return new ResponseEntity<>(addedCustomer,HttpStatus.CREATED); 
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Customer> getCustomerById(@PathVariable("id") int customerId) {
		Customer customer=customerService.getCustomerById(customerId);
		return new ResponseEntity<>(customer,HttpStatus.OK); 
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Customer> updateProduct(@PathVariable int id, @RequestBody Customer customer) {
		Customer updatedCustomer=customerService.updateCustomer(id, customer);
		return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable("id") int customerId) {
		String message=customerService.deleteCustomer(customerId);
		return new ResponseEntity<>(message, HttpStatus.OK);
	}
	
	

}
