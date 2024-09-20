package com.insurance.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Agent;
import com.insurance.entities.Customer;
import com.insurance.entities.Policy;
import com.insurance.enums.PolicyStatus;

public interface PolicyRepository extends JpaRepository<Policy, String> {

	Page<Policy> findByCustomer(Customer customer, Pageable pageable);

	Page<Policy> findByAgent(Agent agent, Pageable pageable);

	List<Policy> findByCustomer(Customer customer);

	List<Policy> findByAgent(Agent agent);

	@Query("SELECT p FROM Policy p " +
	           "WHERE p.agent = :agent " +
	           "AND p.status = :status")
	List<Policy> findByAgentAndStatusIsCancelled(@Param("agent") Agent agent, PolicyStatus status);

	@Query("SELECT p FROM Policy p " +
		       "JOIN p.plan plan " +
		       "WHERE p.agent = :agent " +
		       "AND (CONCAT(p.policyId, ' ', plan.insuranceId, ' ', p.startDate, ' ', p.endDate, ' ', p.policyTerm, ' ', p.totalInvestmentAmount, ' ', p.paymentInterval) " +
		       "LIKE %:searchQuery%)")
		Page<Policy> findByAgentWithSearchQuery(Agent agent, String searchQuery, Pageable pageable);

}
