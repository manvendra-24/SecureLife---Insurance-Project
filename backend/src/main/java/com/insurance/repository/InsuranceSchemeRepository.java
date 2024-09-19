package com.insurance.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.InsuranceScheme;
import com.insurance.entities.InsuranceType;

public interface InsuranceSchemeRepository extends JpaRepository<InsuranceScheme, String>{

	
	@Query("SELECT is FROM InsuranceScheme is WHERE " +
		       "CONCAT(is.insuranceSchemeId, ' ', is.name) LIKE %:searchQuery%")
	Page<InsuranceScheme> findAllWithSearchQuery(String searchQuery, PageRequest pageable);

	@Query("SELECT is FROM InsuranceScheme is " +
		       "JOIN is.insuranceType it " +
		       "WHERE it = :type AND " +
		       "(CONCAT(is.insuranceSchemeId, ' ', is.name, ' ', it.insuranceTypeId) LIKE %:searchQuery%)")
		Page<InsuranceScheme> findByInsuranceType(@Param("type") InsuranceType type, 
		                                          @Param("searchQuery") String searchQuery, 
		                                          Pageable pageable);


}
