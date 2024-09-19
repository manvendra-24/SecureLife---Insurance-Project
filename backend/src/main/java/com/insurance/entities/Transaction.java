package com.insurance.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    @JsonBackReference
    private Policy policy;

    @Column(nullable = false)
    @NotNull(message = "Amount cannot be null")
    @Min(value = 0, message = "Amount must be a positive value")
    private Double amount;

    @Column(nullable = false)
    @NotNull(message = "Date cannot be null")
    private LocalDateTime date;

    private String status; 
}
