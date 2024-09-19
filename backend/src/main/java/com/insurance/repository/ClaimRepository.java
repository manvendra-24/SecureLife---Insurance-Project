package com.insurance.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Long>{

	 @Query("SELECT c FROM Claim c WHERE c.policy.customer.customerId = :customerId")
	    Page<Claim> findAllByCustomerId(@Param("customerId") String customerId, Pageable pageable);

}
