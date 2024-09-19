package com.insurance.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class InsuranceSchemeRequest {

    @NotBlank(message = "Scheme name is mandatory")
    private String schemeName;

    @NotBlank(message = "Description cannot be blank")
    private String description;
    
    @Positive(message = "New registration commission must be positive")
    private double newRegistrationCommission;

    @Positive(message = "Withdrawal Penalty must be positive")
    private double withdrawalPenalty;
}
