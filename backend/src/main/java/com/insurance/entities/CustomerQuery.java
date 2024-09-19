package com.insurance.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
@Entity
@Table(name = "customer_queries")
public class CustomerQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queryId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is mandatory")
    private Customer customer;

    @Column(nullable = false)
    @NotBlank(message = "Subject is mandatory")
    private String subject;

    @Column(nullable = false)
    @NotBlank(message = "Message is mandatory")
    private String message;

    @Column(nullable = false)
    @NotNull(message = "Submitted at date is mandatory")
    private LocalDateTime submittedAt;

    private String status;  
    
    private String response;
    
    @ManyToOne
    @JoinColumn(name="employee_id")
    private Employee employee;

}
