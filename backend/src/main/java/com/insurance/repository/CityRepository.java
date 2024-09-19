package com.insurance.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.City;

public interface CityRepository extends JpaRepository<City, String>{

	
	@Query("SELECT c FROM City c " +
	           "JOIN c.state s " +
	           "WHERE CONCAT(c.cityId, ' ', c.name, ' ', s.name) LIKE %:searchQuery%")
	Page<City> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, Pageable pageable);

}

