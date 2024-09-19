package com.insurance.repository;


import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Employee;
import com.insurance.entities.User;

public interface EmployeeRepository extends JpaRepository<Employee, String>{

	Optional<Employee> findByUser(User user2);

	@Query("SELECT e FROM Employee e " +
	           "WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
	           "OR LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
	           "OR LOWER(e.user.username) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
	           "OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :searchQuery, '%'))")
	    Page<Employee> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);

}
