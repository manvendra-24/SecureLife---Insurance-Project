package com.insurance.repository;

import com.insurance.entities.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpEntity, Long> {

    Optional<OtpEntity> findByOtp(String otp); 
    void deleteByUsername(String username);  
}
