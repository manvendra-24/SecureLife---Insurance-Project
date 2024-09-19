package com.insurance.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Agent;
import com.insurance.entities.City;
import com.insurance.entities.User;

public interface AgentRepository extends JpaRepository<Agent, String> {

    Agent findByUser(User user);

    @Query("SELECT a FROM Agent a " +
    	       "WHERE (:searchQuery IS NULL OR " +
    	       "LOWER(a.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
	           "LOWER(a.agentId) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
    	       "LOWER(a.user.username) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
    	       "LOWER(a.user.email) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
    	       "LOWER(a.address) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
    	       "LOWER(a.phoneNumber) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
    	Page<Agent> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);

	boolean existsByCityAndUserIsActive(City city, boolean b);
}
