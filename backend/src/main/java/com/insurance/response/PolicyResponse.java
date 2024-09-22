package com.insurance.response;

import java.time.LocalDate;

import com.insurance.enums.PaymentInterval;
import com.insurance.enums.PolicyStatus;

import lombok.Data;

@Data
public class PolicyResponse {
	
    private String policyId;
    
    private String policyName;

    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private int policyTerm;
    
    private int totalInvestmentAmount;
   
    private PaymentInterval paymentInterval;
            
    private PolicyStatus status;
    
    private double totalAmountPaid;
    
	
}
