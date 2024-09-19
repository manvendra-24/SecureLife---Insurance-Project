package com.insurance.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.entities.InsurancePlan;
import com.insurance.entities.InsuranceScheme;

public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, String>{

	InsurancePlan findByInsuranceScheme(InsuranceScheme insuranceScheme);

	Page<InsurancePlan> findByInsuranceSchemeInsuranceSchemeId(String schemeId, PageRequest pageable);


}
