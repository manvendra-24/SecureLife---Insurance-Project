package com.insurance.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.State;

public interface StateRepository  extends JpaRepository<State, String>{

	@Query("SELECT s FROM State s " +
	           "WHERE s.name LIKE %:searchQuery% " +
	           "OR s.stateId LIKE %:searchQuery%")
	Page<State> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);
}