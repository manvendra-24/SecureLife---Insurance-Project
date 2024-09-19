package com.insurance.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class InsurancePlanRequest {

    @Min(value = 1, message = "Minimum policy term must be at least 1 year")
    private int minimumPolicyTerm;

    @Min(value = 1, message = "Maximum policy term must be at least 1 year")
    private int maximumPolicyTerm;

    @Min(value = 18, message = "Minimum age must be at least 18")
    private int minimumAge;

    @Min(value = 18, message = "Maximum age must be at least 18")
    private int maximumAge;

    @Positive(message = "Minimum investment amount must be positive")
    private double minimumInvestmentAmount;

    @Positive(message = "Maximum investment amount must be positive")
    private double maximumInvestmentAmount;

    @Positive(message = "Profit ratio must be positive")
    private double profitRatio;

    private boolean active;
    
}
