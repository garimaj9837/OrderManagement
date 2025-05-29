package com.orderManagement.customerService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orderManagement.customerService.enitity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer>{
	//Derived Query
	
	// This will automatically generate a query like:
    // SELECT COUNT(*) FROM customer WHERE email = ?
    boolean existsByEmail(String email);
    
    boolean existsByEmailIgnoreCase(String email);
    
//    Method Name Prefix	What it does
//    findBy	Returns entity or list
//    existsBy	Returns boolean
//    countBy	Returns count
//    deleteBy	Deletes matching records
//    readBy / getBy	Same as findBy
    
//    For Complex Query
//    1)JPQL (Java Persistence Query Language)
//    
//    @Query("SELECT c FROM Customer c WHERE c.email = :email AND c.status = :status")
//    Customer findActiveCustomer(@Param("email") String email, @Param("status") String status);
//    
//    2) Native SQL Query
//
//	@Query(value = "SELECT * FROM customer WHERE email = :email AND status = :status", nativeQuery = true)
//    Customer findByEmailNative(@Param("email") String email, @Param("status") String status);

}
