package com.insurance.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.CustomerQuery;

public interface CustomerQueryRepository extends JpaRepository<CustomerQuery,Long>{

	

	  @Query("SELECT q FROM CustomerQuery q " +
	           "JOIN q.customer c " +
	           "LEFT JOIN q.employee e " +
	           "WHERE CONCAT(q.queryId, ' ', q.subject, ' ', q.message, ' ', c.customerId, ' ', COALESCE(e.employeeId, ''), ' ', COALESCE(q.response, '')) LIKE %:searchQuery%")
	    Page<CustomerQuery> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);
}
