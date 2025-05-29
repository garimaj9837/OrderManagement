package com.orderManagement.customerService.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orderManagement.customerService.Exceptionhandler.CustomerNotFoundException;
import com.orderManagement.customerService.Exceptionhandler.DuplicateCustomerException;
import com.orderManagement.customerService.enitity.Customer;
import com.orderManagement.customerService.repository.CustomerRepository;

@Service
public class CustomerServiceImpl implements CustomerService{
	
	@Autowired
	CustomerRepository customerRepository;

	public Customer addNewCustomer(Customer customer) {
		if(!existByEmail(customer.getEmail())) {
		return customerRepository.save(customer);
		}else {
			throw new DuplicateCustomerException("Duplicate Customer Found!");
		}		
	}
	
	public List<Customer> getAllCustomers(){
		return customerRepository.findAll();
	}
	
	public Customer getCustomerById(int customerId) {
		return customerRepository.findById(customerId).orElseThrow(()->new CustomerNotFoundException("Customer Not Found!"));
	}
	
	public boolean existById(int customerId) {
		return customerRepository.existsById(customerId);
	}
	
	public boolean existByEmail(String email) {
		return customerRepository.existsByEmailIgnoreCase(email);
	}
	
	public String deleteCustomer(int customerId) {
		if(existById(customerId)) {
		customerRepository.deleteById(customerId);
		return "Deleted Successfully!";
		}else {
			throw new CustomerNotFoundException("Customer Not Found!");
		}
	}

	@Override
	public Customer updateCustomer(int id, Customer updateCustomer) {
		Customer customer=getCustomerById(id);
		customer.setCustomerName(updateCustomer.getCustomerName());
		customer.setEmail(updateCustomer.getEmail());
		customer.setAddress(updateCustomer.getAddress());
		customer.setPincode(updateCustomer.getPincode());
		Customer updatedCustomer=customerRepository.save(customer);
		return updatedCustomer;
	}


	
	
}
