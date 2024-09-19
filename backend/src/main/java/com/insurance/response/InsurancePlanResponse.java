package com.insurance.response;

import lombok.Data;

@Data
public class InsurancePlanResponse {

    private String insuranceId;
    private String insuranceSchemeId;
    private String insuranceSchemeName;
    private int minimumPolicyTerm;
    private int maximumPolicyTerm;
    private int minimumAge;
    private int maximumAge;
    private double minimumInvestmentAmount;
    private double maximumInvestmentAmount;
    private double profitRatio;
    private boolean active;
}
