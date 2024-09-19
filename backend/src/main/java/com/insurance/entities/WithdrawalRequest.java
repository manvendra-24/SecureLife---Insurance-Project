package com.insurance.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "withdrawal_requests")
@Data
public class WithdrawalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long withdrawalRequestId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer cannot be null")
    private Customer customer;

    @OneToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @Column(nullable = false)
    @NotNull(message = "Request date cannot be null")
    private LocalDateTime requestDate;

    @Column(nullable = false)
    @NotBlank(message = "Status cannot be blank")
    private String status;
    
    @ManyToOne
    @JoinColumn(name="admin_id")
    private Admin admin;
    
    
}
