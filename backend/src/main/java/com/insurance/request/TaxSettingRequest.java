package com.insurance.request;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TaxSettingRequest {

    @Positive(message = "Tax percentage must be positive")
    private double taxPercentage;
}
