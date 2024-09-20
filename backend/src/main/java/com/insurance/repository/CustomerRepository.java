package com.insurance.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Agent;
import com.insurance.entities.City;
import com.insurance.entities.Customer;
import com.insurance.entities.User;

public interface CustomerRepository extends JpaRepository<Customer,String >{

	Customer findByUser(User user);

	@Query("SELECT c FROM Customer c " +
	           "JOIN c.user u " +
	           "WHERE CONCAT(c.customerId, ' ', c.name, ' ', u.username, ' ', u.email, ' ', c.phoneNumber) LIKE %:searchQuery%")
	    Page<Customer> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);

	boolean existsByCityAndUserIsActive(City city, boolean b);

	   @Query("SELECT c FROM Customer c " + 
			   	"JOIN c.user u "+
	   			"WHERE c.agent = :agent " +
	           "AND CONCAT(c.customerId, ' ', c.name, ' ', u.username, ' ', u.email, ' ', c.phoneNumber) LIKE %:searchQuery%")
	    Page<Customer> findByAgentWithSearchQuery(@Param("agent") Agent agent,
	                                              @Param("searchQuery") String searchQuery,
	                                              Pageable pageable);
	   

}
