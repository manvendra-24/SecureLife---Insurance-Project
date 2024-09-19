package com.insurance.response;


import lombok.Data;


@Data
public class InsuranceSchemeResponse {

    private String insuranceSchemeId;
    private String name;
    private double RegistrationCommissionForAgent;
    private double withdrawalPenaltyForAgent;
    private boolean isActive;
    private String insuranceType;


}
