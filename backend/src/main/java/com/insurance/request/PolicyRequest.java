package com.insurance.request;




import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PolicyRequest {

    @NotNull(message = "Insurance plan cannot be null")
    private String plan_id;

    @NotNull(message = "Policy term cannot be null")
    private int policyTerm;
    
    @NotNull(message = "Total Investment Amount cannot be null")
    private int totalInvestmentAmount;
    
    @NotNull(message = "Payment interval cannot be null")
    private String paymentInterval;
    
    private String agent_id;
}
