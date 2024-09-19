package com.insurance.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.InsuranceType;


public interface InsuranceTypeRepository extends JpaRepository<InsuranceType, String> {

	Optional<InsuranceType> findByInsuranceTypeId(String insurance_type_id);
	
	
	@Query("SELECT it FROM InsuranceType it WHERE " +
		       "CONCAT(it.insuranceTypeId, ' ', it.name) LIKE %:searchQuery%")
		Page<InsuranceType> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, PageRequest pageable);


}