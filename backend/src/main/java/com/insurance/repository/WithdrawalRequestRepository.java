package com.insurance.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Agent;
import com.insurance.entities.WithdrawalRequest;

public interface WithdrawalRequestRepository extends JpaRepository<WithdrawalRequest, Long>{

	@Query("SELECT w FROM WithdrawalRequest w " +
	           "JOIN w.policy p " +
	           "WHERE CONCAT(p.customer.customerId, ' ', p.policyId, ' ', w.withdrawalRequestId) LIKE %:searchQuery%")
	Page<WithdrawalRequest> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);

	
	@Query("SELECT wr FROM WithdrawalRequest wr WHERE wr.policy.agent = :agent")
	Page<WithdrawalRequest> findByAgent(@Param("agent") Agent agent, Pageable pageable);
	
	
	@Query("SELECT COUNT(wr) FROM WithdrawalRequest wr WHERE wr.policy.agent = :agent AND wr.status = 'APPROVED'")
	Long countApprovedByAgent(@Param("agent") Agent agent);


	@Query("SELECT w FROM WithdrawalRequest w " +
	           "JOIN w.policy p " +
	           "WHERE CONCAT(p.customer.customerId, ' ', p.policyId, ' ', w.withdrawalRequestId) LIKE %:searchQuery% " + 
	           "AND  p.agent = :agent")
	Page<WithdrawalRequest> findByAgentWithSearchQuery(Agent agent, String searchQuery, PageRequest pageRequest);

}
