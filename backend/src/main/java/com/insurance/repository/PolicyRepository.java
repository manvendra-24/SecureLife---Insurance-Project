package com.insurance.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.entities.Agent;
import com.insurance.entities.Customer;
import com.insurance.entities.Policy;

public interface PolicyRepository extends JpaRepository<Policy, String> {

	Page<Policy> findByCustomer(Customer customer, Pageable pageable);

	Page<Policy> findByAgent(Agent agent, Pageable pageable);

	List<Policy> findByCustomer(Customer customer);

	List<Policy> findByAgent(Agent agent);

}
