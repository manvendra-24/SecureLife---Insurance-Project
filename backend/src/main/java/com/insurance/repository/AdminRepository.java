package com.insurance.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.insurance.entities.Admin;
import com.insurance.entities.User;

public interface AdminRepository extends JpaRepository<Admin, String>{

	Admin findByUser(User user);

	@Query("SELECT a FROM Admin a " +
	           "WHERE (:searchQuery IS NULL OR " +
	           "LOWER(a.adminId) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
	           "LOWER(a.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
	           "LOWER(a.user.username) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
	           "LOWER(a.user.email) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
	    Page<Admin> findAllWithSearchQuery(@Param("searchQuery") String searchQuery, PageRequest pageable);
}
