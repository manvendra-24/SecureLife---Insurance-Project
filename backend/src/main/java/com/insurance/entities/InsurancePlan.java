package com.insurance.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "insurance_plans")
public class InsurancePlan {

    @Id
    private String insuranceId;

    @OneToOne
    @JoinColumn(name = "insurance_scheme_id", nullable = false)
    @NotNull(message = "Insurance scheme cannot be null")
    private InsuranceScheme insuranceScheme;

    @Min(value = 0, message = "Minimum policy term must be non-negative")
    private int minimumPolicyTerm;

    @Min(value = 0, message = "Maximum policy term must be non-negative")
    private int maximumPolicyTerm;

    @Min(value = 0, message = "Minimum age must be non-negative")
    private int minimumAge;

    @Min(value = 0, message = "Maximum age must be non-negative")
    private int maximumAge;

    @Min(value = 0, message = "Minimum investment amount must be non-negative")
    private double minimumInvestmentAmount;

    @Min(value = 0, message = "Maximum investment amount must be non-negative")
    private double maximumInvestmentAmount;

    @Min(value = 0, message = "Profit ratio must be non-negative")
    private double profitRatio;

    private boolean active;
    
}
