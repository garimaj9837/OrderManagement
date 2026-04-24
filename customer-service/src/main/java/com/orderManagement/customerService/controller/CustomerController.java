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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderManagement.customerService.enitity.Customer;
import com.orderManagement.customerService.security.JwtUtil;
import com.orderManagement.customerService.service.CustomerService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {
	
	CustomerService customerService;
	
	JwtUtil jwtUtil;
	
	CustomerController(CustomerService customerService, JwtUtil jwtUtil){
		this.customerService=customerService;
		this.jwtUtil=jwtUtil;
	}
	
	
	@GetMapping({"", "/"})
	public ResponseEntity<List<Customer>> getAllCustomer() {
		List<Customer> customers=customerService.getAllCustomers();
		return new ResponseEntity<>(customers,HttpStatus.OK); 
	}

	@GetMapping("/me")
	public ResponseEntity<Customer> getMyCustomer(HttpServletRequest request) {
		Long userId = extractUserId(request);
		Customer customer = customerService.getCustomerByUserId(userId);
		return new ResponseEntity<>(customer, HttpStatus.OK);
	}
	
	@PostMapping({"", "/"})
	public ResponseEntity<Customer> addNewCustomer(@RequestBody Customer customer, HttpServletRequest request) {
	    Long userId = extractUserId(request);
		Customer addedCustomer=customerService.addNewCustomer(customer,userId);
		return new ResponseEntity<>(addedCustomer,HttpStatus.CREATED); 
	}

	@PutMapping("/me")
	public ResponseEntity<Customer> updateMyCustomer(@RequestBody Customer customer, HttpServletRequest request) {
		Long userId = extractUserId(request);
		Customer existingCustomer = customerService.getCustomerByUserId(userId);
		Customer updatedCustomer = customerService.updateCustomer(existingCustomer.getCustomerId(), customer);
		return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Customer> getCustomerById(@PathVariable("id") int customerId) {
		Customer customer=customerService.getCustomerById(customerId);
		return new ResponseEntity<>(customer,HttpStatus.OK); 
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Customer> updateCustomer(@PathVariable int id, @RequestBody Customer customer) {
		Customer updatedCustomer=customerService.updateCustomer(id, customer);
		return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCustomer(@PathVariable("id") int customerId) {
		String message=customerService.deleteCustomer(customerId);
		return new ResponseEntity<>(message, HttpStatus.OK);
	}
	
	@GetMapping("isValid/{id}")
	public boolean isValidCustomer(@PathVariable("id") int customerId) {
		if(customerService.getCustomerById(customerId)!=null) {
			return true;
		}else {
			return false;
		}
	}
	
	@GetMapping("/email/{email}")
	public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
		Customer customer = customerService.getCustomerByEmail(email);
		return new ResponseEntity<>(customer, HttpStatus.OK);
	}

	private Long extractUserId(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
	    String token = authHeader.substring(7);
	    return jwtUtil.extractUserId(token);
	}
	
	

}
